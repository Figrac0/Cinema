FROM python:3.12-alpine
COPY ./app/requirements.txt /app/requirements.txt
RUN pip install --upgrade pip
RUN apk add gcc musl-dev libc-dev
RUN pip3 install -r /app/requirements.txt
WORKDIR /app