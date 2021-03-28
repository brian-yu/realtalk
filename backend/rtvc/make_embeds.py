from encoder.params_model import model_embedding_size as speaker_embedding_size
from utils.argutils import print_args
from utils.modelutils import check_model_paths
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

if __name__ == '__main__':
    person_name = "obama"
    in_fpath = Path(f"samples/{person_name}.mp3")
    out_fpath = Path(f"embeds/{person_name}.embed")

    enc_model_fpath = Path("encoder/saved_models/pretrained.pt")
    encoder.load_model(enc_model_fpath)

    preprocessed_wav = encoder.preprocess_wav(in_fpath)
    print("Loaded file succesfully")


    embed = encoder.embed_utterance(preprocessed_wav)
    print("Created the embedding")

    with open(out_fpath, 'wb') as f:
        pickle.dump(embed, f, protocol=pickle.HIGHEST_PROTOCOL)