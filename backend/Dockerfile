FROM python:3.12.0a3-alpine3.17
LABEL maintainer="github.com/d-skowronski"

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /tmp/requirements.txt
COPY ./requirements.dev.txt /tmp/requirements.dev.txt
COPY ./app /app
WORKDIR /app
EXPOSE 8000

ARG DEV=false
RUN apk add gcc musl-dev jpeg-dev zlib-dev libjpeg libffi-dev && \
    python -m venv /py && \
    /py/bin/pip install --upgrade pip setuptools wheel && \
    /py/bin/pip install --use-pep517 -r /tmp/requirements.txt && \
    if [ $DEV = "true" ]; \
        then /py/bin/pip install -r /tmp/requirements.dev.txt ; \
    fi && \
    rm -rf /tmp

ENV PATH="/py/bin:$PATH"
