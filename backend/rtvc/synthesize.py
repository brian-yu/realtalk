from encoder.params_model import model_embedding_size as speaker_embedding_size
from utils.argutils import print_args
from synthesizer.inference import Synthesizer
from encoder import inference as encoder
from vocoder import inference as vocoder
from pathlib import Path
import numpy as np
import soundfile as sf
import librosa
import argparse
import torch
import sys
import os
from audioread.exceptions import NoBackendError
import pickle

def synthesize(text, person_name, filename):
    syn_model_fpath = Path("synthesizer/saved_models/pretrained/pretrained.pt")
    voc_model_fpath = Path("vocoder/saved_models/pretrained/pretrained.pt")

    synthesizer = Synthesizer(syn_model_fpath)
    vocoder.load_model(voc_model_fpath)

    with open(Path(f"embeds/{person_name}.embed"), 'rb') as f:
        embed = pickle.load(f)
    print("Loaded the embedding")

    # The synthesizer works in batch, so you need to put your data in a list or numpy array
    texts = [text]
    embeds = [embed]
    # If you know what the attention layer alignments are, you can retrieve them here by
    # passing return_alignments=True
    specs = synthesizer.synthesize_spectrograms(texts, embeds)
    spec = specs[0]
    print("Created the mel spectrogram")
    
    
    ## Generating the waveform
    print("Synthesizing the waveform:")

    # Synthesizing the waveform is fairly straightforward. Remember that the longer the
    # spectrogram, the more time-efficient the vocoder.
    generated_wav = vocoder.infer_waveform(spec)
    
    
    ## Post-generation
    # There's a bug with sounddevice that makes the audio cut one second earlier, so we
    # pad it.
    generated_wav = np.pad(generated_wav, (0, synthesizer.sample_rate), mode="constant")

    # Trim excess silences to compensate for gaps in spectrograms (issue #53)
    generated_wav = encoder.preprocess_wav(generated_wav)
    
    # Save it on the disk
    print(generated_wav.dtype)
    sf.write(filename, generated_wav.astype(np.float32), synthesizer.sample_rate)
    print("\nSaved output as %s\n\n" % filename)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument("--text", type=str, 
                        help="Text to synthesize to speech")
    parser.add_argument("--person", type=str, 
                        help="Person to clone speech from")
    parser.add_argument("--outfile", type=Path, 
                        help="Path to save wav")
    args = parser.parse_args()
    print_args(args, parser)
    synthesize(args.text, args.person, args.outfile)