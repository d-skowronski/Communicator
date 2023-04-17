FROM python:3.12.0a3-alpine3.17
LABEL maintainer="github.com/d-skowronski"

COPY ./requirements.txt /tmp/requirements.txt
COPY ./app /app
COPY ./scripts /scripts
RUN mkdir -p /vol/media && \
    mkdir -p /vol/static
# For media files that come with the project. For example, default profile picture.
COPY ./app/media /vol/media


ENV PYTHONUNBUFFERED 1
ENV PATH="/py/bin:$PATH"
ENV PATH="/scripts:${PATH}"

WORKDIR /app
EXPOSE 8000

RUN chmod +x /scripts/* && \
    apk add --update --no-cache gcc musl-dev jpeg-dev zlib-dev libjpeg libffi-dev && \
    python -m venv /py && \
    /py/bin/pip install --upgrade pip setuptools wheel && \
    /py/bin/pip install --use-pep517 -r /tmp/requirements.txt && \
    rm -rf /tmp

CMD ["entrypoint.sh"]