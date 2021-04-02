import base64
import json
import logging
import os
import subprocess
import shutil
import time
import uuid

import firebase_admin
from firebase_admin import auth
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from google.cloud import texttospeech, storage, firestore, secretmanager
import openai
import requests

# cred = credentials.Certificate("hoohacks-21-49578c0b88ef.json")
# firebase_admin.initialize_app(cred)

if "OPENAI_API_KEY" in os.environ:
    openai.api_key = os.environ["OPENAI_API_KEY"]
else:
    secret_client = secretmanager.SecretManagerServiceClient()
    secret_response = secret_client.access_secret_version(request={"name": "projects/hoohacks-21/secrets/openai/versions/latest"})
    openai.api_key = secret_response.payload.data.decode("UTF-8")
default_app = firebase_admin.initialize_app()

app = Flask(__name__)
cors = CORS(app)
# app.config["CORS_HEADERS"] = "Content-Type"

ttsvoices = {
    "franklin": "en-GB-Wavenet-A",
    "obama": "en-US-Wavenet-J",
    "feynman": "en-US-Wavenet-J",
    "king": "en-US-Wavenet-J",
    "curie": "fr-FR-Wavenet-A",
    "harris": "en-US-Wavenet-F",
    "einstein": "de-DE-Wavenet-E",
    "lennon": "en-GB-Wavenet-B",
    "earhart": "en-US-Wavenet-F",
    "granger": "en-GB-Wavenet-A",
    "bond": "en-GB-Wavenet-B",
}


def authenticate_id_token(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token["uid"]
    except Exception as e:
        logging.info(e)
        raise e


def get_user(uid):
    # https://firebase.google.com/docs/reference/admin/python/firebase_admin.auth#userrecord
    return auth.get_user(uid)


def upload_blob(bucket_name, source_file_name, destination_blob_name):
    """Uploads a file to the bucket."""
    # bucket_name = "your-bucket-name"
    # source_file_name = "local/path/to/file"
    # destination_blob_name = "storage-object-name"

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    print("File {} uploaded to {}.".format(source_file_name, destination_blob_name))


def quick_anim_gen(input_file_name, output_file_name):
    shutil.move("./" + input_file_name, "./first-order-model/" + input_file_name)
    subprocess.Popen(
        "python3 quick_animation.py --input_file_name ./"
        + input_file_name
        + " --output_file_name ./"
        + output_file_name,
        cwd="./first-order-model",
        shell=True,
    ).wait()


def get_lip_sync(audio_file_name, output_file_name, person_name):
    shutil.move("./" + audio_file_name, "./Wav2Lip/" + audio_file_name)
    subprocess.Popen(
        "python3 inference.py --checkpoint_path wav2lip.pth --face "
        + person_name
        + ".mp4 --audio "
        + audio_file_name
        + " --resize_factor 1 --face_det_batch_size 16 --face_det_pickle "
        + person_name
        + ".mp4_det.pickle --outfile "
        + output_file_name,
        cwd="./Wav2Lip",
        shell=True,
    ).wait()


def person_text_to_speech(text, person, outfile):
    args = "python3 synthesize.py --text".split()
    args.append(text)
    args.extend(["--person", person, "--outfile", outfile])
    subprocess.Popen(args, cwd="./rtvc").wait()


def text_to_speech(input_text, voice, file_name):
    # Instantiates a client
    client = texttospeech.TextToSpeechClient()

    # Set the text input to be synthesized
    synthesis_input = texttospeech.SynthesisInput(text=input_text)

    # Build the voice request, select the language code ("en-US") and the ssml
    # voice gender ("neutral")
    voice = texttospeech.VoiceSelectionParams(
        language_code=voice.split("-W")[0],
        name=voice,
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL,
    )

    # Select the type of audio file you want returned
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    # Perform the text-to-speech request on the text input with the selected
    # voice parameters and audio file type
    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )
    #     list_voices()

    # The response's audio_content is binary.
    with open(file_name, "wb") as out:
        # Write the response to the output file.
        out.write(response.audio_content)
        print('Audio content written to file "output.mp3"')


@app.route("/")
@cross_origin()
def hello():
    return "Hello from hoohacks backend!"


def get_chat_completion(person, prompt, message):
    start_sequence = f"\n{person}:"
    restart_sequence = "\nStranger: "

    prompt_with_message = f"{prompt}{restart_sequence}{message}" + start_sequence

    print(prompt_with_message)

    response = openai.Completion.create(
        engine="curie",
        prompt=prompt_with_message,
        temperature=0.5,
        max_tokens=75,  # formerly 150
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0.6,
        stop=["\n", "Stranger:", start_sequence],
    )

    completion = response.choices[0].text
    returned_prompt = prompt_with_message + completion

    return completion, returned_prompt


@app.route("/upload", methods=["POST"])
@cross_origin()
def upload():
    name = request.form["name"]
    bio = request.form["bio"]
    image = request.files["image"]
    user_id = request.form["userId"]
    user_id_token = request.form["userIdToken"]

    uid = authenticate_id_token(user_id_token)
    if uid != user_id:
        return jsonify(
            {
                "ok": False,
                "message": "Unauthenticated request. Please try signing in again.",
            }
        )
    user = get_user(uid)

    print(
        f"== UPLOAD FROM {uid}: {user.email} {user.display_name} name: {name} bio: {bio}"
    )

    if user.email in {'jrm5qk@virginia.edu'}:
        return jsonify(
            {
                "ok": False,
                "message": "Stop spamming us. Check your email.",
            }
        )

    myuuid = str(uuid.uuid4())
    filename = myuuid + image.filename
    image.save(filename)

    quick_anim_gen(filename, f"{myuuid}.mp4")
    blob_name = f"{myuuid}.mp4"
    upload_blob("hoohacks21-user--uploads", f"./{myuuid}.mp4", blob_name)
    os.remove(f"{myuuid}.mp4")
    os.remove("./first-order-model/" + filename)
    # Add a new document
    db = firestore.Client()
    # doc_ref = db.collection(u'profiles').document(profile_id)

    doc_ref = db.collection("profiles").add(
        {
            "name": name,
            "bio": bio,
            "video_url": "https://storage.googleapis.com/hoohacks21-user--uploads/"
            + blob_name,
            "user_id": user_id,
            "uploaded_by": user.display_name,
        }
    )

    return jsonify({"ok": True})


@app.route("/profiles")
@cross_origin()
def profiles():
    profile_list = []
    db = firestore.Client()
    for profile in db.collection("profiles").stream():
        profile_dict = profile.to_dict()
        profile_dict["id"] = profile.id
        profile_list.append(profile_dict)

    return jsonify(profile_list)


@app.route("/profile/<id>")
@cross_origin()
def profile(id):
    db = firestore.Client()
    profile = db.collection("profiles").document(id).get().to_dict()
    print(profile)
    return jsonify(profile)


@app.route("/chat", methods=["POST"])
# @cross_origin()
def chat():
    body = request.get_json()

    person_id = body["personId"]
    person = body["person"]
    prompt = body["prompt"]
    message = body["message"]
    video_url = body["videoUrl"]
    voice_cloning_enabled = body["voiceCloningEnabled"]
    user_id = body["userId"]
    user_id_token = body["userIdToken"]

    if len(message) > 140:
        return jsonify(
            {
                "ok": False,
                "message": "Your message was too long. Please try a shorter one.",
            }
        )
    
    uid = authenticate_id_token(user_id_token)
    if uid != user_id:
        return jsonify(
            {
                "ok": False,
                "message": "Unauthenticated request. Please try signing in again.",
            }
        )
    user = get_user(uid)

    print(f"== REQUEST FROM {uid}: {user.email} {user.display_name}")

    completion, returned_prompt = get_chat_completion(person, prompt, message)

    #     completion = "I once was on a beach, and I saw the waves come in and out. They came in groups of three, and they were not evenly spaced. I noticed that the waves were not evenly spaced."
    file_id = str(uuid.uuid4())

    if voice_cloning_enabled:
        person_text_to_speech(completion, person_id, f"../{file_id}.wav")
    else:
        text_to_speech(
            completion, ttsvoices.get(person_id, "en-US-Wavenet-J"), f"{file_id}.wav"
        )

    should_delete = False
    if not os.path.exists(f"./Wav2Lip/{person_id}.mp4"):
        should_delete = True
        r = requests.get(video_url)
        with open(f"./Wav2Lip/{person_id}.mp4", "wb") as f:
            f.write(r.content)

    get_lip_sync(f"{file_id}.wav", f"{file_id}.mp4", person_id)

    if should_delete:
        os.remove(f"./Wav2Lip/{person_id}.mp4")

    blob_name = f"{file_id}.mp4"
    upload_blob("hoohacks21", f"./Wav2Lip/{file_id}.mp4", blob_name)
    os.remove(f"./Wav2Lip/{file_id}.wav")
    os.remove(f"./Wav2Lip/{file_id}.mp4")

    return jsonify(
        {
            "ok": True,
            "prompt": returned_prompt,
            "video": "https://storage.googleapis.com/hoohacks21/" + blob_name,
        }
    )
