# syntax=docker/dockerfile:1

# Headless Android build runtime for GunSwarm 3D.
# Provides OpenJDK 17, Node.js 20, Gradle and the Android command-line SDK.
FROM ubuntu:22.04

ARG USER_UID=1000
ARG USER_GID=1000
ARG NODE_VERSION=20.18.0
ARG GRADLE_VERSION=8.7
ARG ANDROID_CMDLINE_TOOLS=11076708
ARG ANDROID_PLATFORM=34
ARG ANDROID_BUILD_TOOLS=34.0.0

ENV DEBIAN_FRONTEND=noninteractive
ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV NODE_HOME=/opt/node
ENV GRADLE_HOME=/opt/gradle
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=${NODE_HOME}/bin:${GRADLE_HOME}/bin:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools:${PATH}

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates curl git openjdk-17-jdk-headless unzip xz-utils \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" -o /tmp/node.tar.xz \
    && mkdir -p "${NODE_HOME}" \
    && tar -xJf /tmp/node.tar.xz -C "${NODE_HOME}" --strip-components=1 \
    && rm -f /tmp/node.tar.xz

RUN curl -fsSL "https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip" -o /tmp/gradle.zip \
    && unzip -q /tmp/gradle.zip -d /opt \
    && mv "/opt/gradle-${GRADLE_VERSION}" "${GRADLE_HOME}" \
    && rm -f /tmp/gradle.zip

RUN mkdir -p "${ANDROID_HOME}/cmdline-tools" \
    && curl -fsSL "https://dl.google.com/android/repository/commandlinetools-linux-${ANDROID_CMDLINE_TOOLS}_latest.zip" -o /tmp/cmdline-tools.zip \
    && unzip -q /tmp/cmdline-tools.zip -d /tmp/android-cmdline \
    && mv /tmp/android-cmdline/cmdline-tools "${ANDROID_HOME}/cmdline-tools/latest" \
    && rm -rf /tmp/cmdline-tools.zip /tmp/android-cmdline

RUN groupadd --gid "${USER_GID}" builder \
    && useradd --create-home --uid "${USER_UID}" --gid builder --shell /bin/bash builder \
    && mkdir -p /home/builder/.gradle \
    && chown -R builder:builder /home/builder "${ANDROID_HOME}" "${NODE_HOME}" "${GRADLE_HOME}"

ENV HOME=/home/builder
ENV GRADLE_USER_HOME=/home/builder/.gradle

USER builder

RUN yes | sdkmanager --licenses > /dev/null \
    && sdkmanager --install "platform-tools" "platforms;android-${ANDROID_PLATFORM}" "build-tools;${ANDROID_BUILD_TOOLS}"

WORKDIR /workspace

CMD ["sleep", "infinity"]
