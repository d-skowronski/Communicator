# Prepare React build
FROM node:19-alpine3.16 as react_build
LABEL maintainer="github.com/d-skowronski"

COPY ./frontend/app /app
WORKDIR /app

ARG API_URL
ARG WEBSOCKET_URL
ENV REACT_APP_API_URL $API_URL
ENV REACT_APP_WEBSOCKET_URL $WEBSOCKET_URL

RUN npm install --silent && \
    npm run build

# Prepare nginx
FROM nginx:1.23.4-alpine3.17
LABEL maintainer="github.com/d-skowronski"

COPY --from=react_build /app/build /usr/share/nginx/html
COPY ./proxy/default.conf /etc/nginx/conf.d/default.conf
COPY ./proxy/certs /etc/nginx/certs

USER root
RUN mkdir -p /vol/static && \
    chmod 755 /vol/static