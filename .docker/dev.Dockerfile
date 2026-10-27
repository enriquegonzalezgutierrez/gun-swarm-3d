# syntax=docker/dockerfile:1

# Development runtime for GunSwarm 3D.
# Contains Node.js 20 LTS and runs as a non-root developer that mirrors the host UID/GID.
FROM node:20-alpine

ARG USER_UID=1000
ARG USER_GID=1000

RUN apk add --no-cache bash ca-certificates curl git \
    && (deluser node >/dev/null 2>&1 || true) \
    && (delgroup node >/dev/null 2>&1 || true) \
    && addgroup -g "${USER_GID}" developer \
    && adduser -D -u "${USER_UID}" -G developer -s /bin/bash developer

WORKDIR /app

COPY package.json package-lock.json* ./
RUN mkdir -p /app/node_modules \
    && chown -R developer:developer /app

USER developer

ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=0

EXPOSE 5173

CMD ["npm", "run", "dev"]
