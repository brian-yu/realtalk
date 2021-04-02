FROM pytorch/pytorch:1.8.1-cuda11.1-cudnn8-runtime

COPY . /app

workdir /app


RUN apt-get update && apt-get install -y python3-dev build-essential
RUN pip install Cython pandas scipy
RUN pip install -r requirements.txt

# RUN gunicorn -b:80 server:app