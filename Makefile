SHELL := /bin/bash
.DEFAULT_GOAL := help

HOST_UID ?= $(shell id -u)
HOST_GID ?= $(shell id -g)
export HOST_UID
export HOST_GID

DC := $(shell if docker compose version >/dev/null 2>&1; then echo "docker compose"; else echo "docker-compose"; fi)
COMPOSE := $(DC) -f docker-compose.yml
DEV_RUN := $(COMPOSE) run --rm --no-deps dev

.PHONY: help init init-ci ci dev preview test test-watch bot lint build-web build-apk clean

help: ## Display all available commands
	@echo "GunSwarm 3D — Docker workflow"
	@awk 'BEGIN {FS = ":.*## "; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z0-9_-]+:.*## / {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2} END {printf "\n"}' $(MAKEFILE_LIST)

init: ## Build images, install dependencies and verify toolchains
	@mkdir -p src/domain src/application src/infrastructure tests/unit tests/integration output dist node_modules
	$(COMPOSE) build dev builder
	$(DEV_RUN) npm install --no-audit --no-fund
	$(DEV_RUN) npm run typecheck
	@$(COMPOSE) run --rm --no-deps builder bash -lc "java -version && node --version && gradle --version --quiet && sdkmanager --version"
	@echo "Phase 0 infrastructure initialized successfully."

init-ci: ## Build the dev image and install locked dependencies for CI
	@mkdir -p src/domain src/application src/infrastructure tests/unit tests/integration output dist node_modules
	$(COMPOSE) build dev
	$(DEV_RUN) npm ci --no-audit --no-fund

ci: init-ci lint test build-web ## Run the full CI quality gate
	@echo "CI quality gate passed."

dev: ## Start the Vite development server at http://localhost:5173
	$(COMPOSE) up dev

preview: ## Preview the production web build at http://localhost:4173
	$(COMPOSE) run --rm --no-deps -p 4173:4173 dev npm run preview

test: ## Run the Vitest suite once inside Docker
	$(DEV_RUN) npm test

test-watch: ## Run Vitest in interactive watch mode
	$(DEV_RUN) npm run test:watch

bot: ## Run the automated bot across all five phases
	$(DEV_RUN) env RUN_BOT=1 npx vitest run tests/integration/bot/AutoPlayBot.test.ts

lint: ## Run strict type-checking and ESLint inside Docker
	$(DEV_RUN) npm run lint

build-web: ## Build the production web bundle into dist/
	$(DEV_RUN) npm run build

build-apk: init-ci build-web ## Build the debug Android APK into output/
	@mkdir -p output
	$(COMPOSE) run --rm --no-deps builder bash -lc "cd /workspace && npm ci && npx cap sync android && echo \"sdk.dir=\$$ANDROID_HOME\" > android/local.properties && chmod +x android/gradlew && ./android/gradlew -p android assembleDebug --no-daemon"
	@cp android/app/build/outputs/apk/debug/app-debug.apk output/app-debug.apk
	@echo "APK generated at output/app-debug.apk"

clean: ## Stop containers, remove volumes and purge build artifacts
	@$(COMPOSE) down -v --remove-orphans || true
	@rm -rf dist output
	@echo "Workspace cleaned."
