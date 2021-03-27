import json
import os

from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import openai

openai.api_key = os.environ["OPENAI_API_KEY"]

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


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
        engine="davinci",
        prompt=prompt_with_message,
        temperature=0.5,
        max_tokens=150,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0.6,
        stop=["\n", "Stranger:", start_sequence],
    )

    completion = response.choices[0].text
    returned_prompt = prompt_with_message + completion

    return completion, returned_prompt

@app.route("/chat", methods=["POST"])
@cross_origin()
def chat():
    body = request.get_json()

    person = body["person"]
    prompt = body["prompt"]
    message = body["message"]

    completion, returned_prompt = get_chat_completion(person, prompt, message)

    return jsonify({"prompt": returned_prompt})