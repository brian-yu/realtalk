FROM nvcr.io/nvidia/pytorch:21.03-py3

COPY . /app

workdir /app

RUN pip install -r requirements.txt

RUN gunicorn -b:80 server:app