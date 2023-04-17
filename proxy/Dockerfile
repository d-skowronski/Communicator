FROM nginx:1.23.4-alpine3.17
LABEL maintainer="github.com/d-skowronski"

COPY ./default.conf /etc/nginx/conf.d/default.conf

USER root
RUN mkdir -p /vol/static && \
    chmod 755 /vol/static
