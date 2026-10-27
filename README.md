# GunSwarm 3D

GunSwarm 3D is a production-grade, 3D hyper-casual crowd-runner and auto-shooter game built for Web (Mobile/Desktop) and packaged natively as an Android APK. The project is engineered strictly following Domain-Driven Design (DDD), Hexagonal Architecture (Ports and Adapters), and the SOLID principles, enforcing a strict Anti-God-File policy.

The entire development and build lifecycle is 100% Dockerized and orchestrated via a `Makefile`. No local runtime dependencies (Node.js, Java, Android Studio, Gradle) are required on the host machine—only Docker and Make.

---

## 1. Project Specifications

* **Genre:** 3D Hyper-Casual Crowd Runner / Auto-Shooter / Swarm Defense.
* **Target Platforms:**
  * **Web Browsers:** Responsive portrait viewport (9:16 aspect ratio container with centered desktop presentation).
  * **Android Mobile:** Native APK generated via Capacitor without requiring local Android Studio.
* **Language & Runtime:** TypeScript (Strict Mode) on Node.js 20 (within Docker).
* **Rendering Engine:** Three.js (Procedural geometries only; external `.gltf` / `.obj` assets are strictly prohibited).
* **Physics Engine:** Cannon-es (Decoupled in an isolated infrastructure adapter).
* **Audio Engine:** Web Audio API (100% procedural sound synthesis using oscillators and noise buffers; no external audio files).
* **Persistence:** LocalStorage adapter for meta-progression, currency, and persistent player upgrades.
* **Testing Framework:** Vitest (Executing headless domain and integration tests inside Docker).

---

## 2. Architectural Principles

1. **Domain-Driven Design (DDD):**
   * The core business domain (swarm coordinates, recruitment math, projectile collision calculations, combat stats, health, and wave progression) is pure TypeScript.
   * The domain layer contains zero imports from Three.js, Cannon-es, Capacitor, or browser DOM APIs.

2. **Hexagonal Architecture (Ports & Adapters):**
   * **Domain Core:** Pure entities, value objects, domain events, and aggregates.
   * **Application Layer:** Driving ports (Use Cases) orchestrating domain operations.
   * **Driven Ports (Interfaces):** `RenderPort`, `PhysicsPort`, `AudioPort`, `StoragePort`, and `InputPort`.
   * **Infrastructure Adapters:** `ThreeJsRenderAdapter`, `CannonPhysicsAdapter`, `WebAudioAdapter`, `LocalStorageAdapter`, and `BrowserInputAdapter`.

3. **Strict Anti-God-File Policy:**
   * No single file may exceed **150 lines of code**.
   * One class, interface, or responsibility per file.
   * Monolithic game managers or all-in-one update loops are strictly forbidden. All logic is decomposed into single-responsibility services and handlers.

4. **Procedural Aesthetics:**
   * All 27 game entities (troopers, enemies, hazards, gates, bosses) are generated programmatically by assembling Three.js primitives (`BoxGeometry`, `CylinderGeometry`, `SphereGeometry`, `CapsuleGeometry`).
   * 5 distinct environmental biomes with dynamic procedural scenery to eliminate visual fatigue.

---

## 3. Directory Layout Blueprint

```text
gun-swarm-3d/
├── .docker/
│   ├── dev.Dockerfile              # Development runtime (Node + Vite)
│   └── builder.Dockerfile          # Android SDK + Gradle headless build runtime
├── docker-compose.yml              # Container orchestration
├── Makefile                        # Single entry point for all workflows
├── README.md                       # Project overview and quickstart (This file)
├── GDD.md                          # Comprehensive Game Design Document
├── ARCHITECTURE.md                 # Detailed DDD, Hexagonal, and SOLID design rules
├── AGENT_RULES.md                  # Operating instructions and constraints for OpenCode / LLMs
├── PROGRESS.md                     # Atomic task tracker for autonomous implementation
├── public/                         # Static web assets (index.html, manifest)
├── src/
│   ├── domain/                     # Pure enterprise logic (Entities, Value Objects, Events)
│   ├── application/                # Use cases and port contracts
│   ├── infrastructure/             # Concrete adapters (Three.js, Cannon-es, Audio, Storage)
│   └── main.ts                     # Composition root / Dependency injection bootstrapper
└── tests/                          # Vitest automated test suite (Unit & Integration)
```

---

## 4. Makefile Command Reference

The project uses a self-documenting `Makefile`. Running `make` or `make help` displays the available targets:

| Command | Description |
| :--- | :--- |
| `make help` | Displays all available commands with descriptions (Default target). |
| `make init` | Pulls images, sets up volumes, and initializes the project skeleton inside Docker. |
| `make init-ci` | Builds only the dev image and installs locked dependencies for CI. |
| `make ci` | Runs lint, tests, and the web build inside Docker (CI quality gate). |
| `make dev` | Starts the local Vite development server with Hot Module Replacement (HMR) at `http://localhost:5173`. |
| `make preview` | Serves the production `dist/` bundle at `http://localhost:4173`. |
| `make test` | Runs the full Vitest suite headlessly inside the Docker development container. |
| `make test-watch` | Runs Vitest in interactive watch mode for rapid test-driven development. |
| `make lint` | Executes TypeScript type-checking (`tsc --noEmit`) and ESLint validations. |
| `make build-web` | Compiles and bundles production-ready HTML/CSS/JS artifacts into the `dist/` directory. |
| `make build-apk` | Triggers the headless Android build container, runs Gradle via CLI, and outputs `app-debug.apk` to `./output/`. |
| `make clean` | Stops all containers, removes network bridges, and purges temporary build artifacts. |

---

## 5. Development Workflow

1. **Host Prerequisites:**
   * Docker Engine `>= 24.0`
   * Docker Compose `>= 2.20`
   * GNU Make `>= 4.3`

2. **Starting the Dev Environment:**
   ```bash
   make init
   make dev
   ```
   Open `http://localhost:5173` on your host machine browser. Any changes to `src/` will reflect immediately via Hot Module Replacement.

3. **Running Quality Checks:**
   ```bash
   make test
   make lint
   ```

4. **Generating the Android APK:**
   ```bash
   make build-apk
   ```
   The compiled APK binary will be placed at:
   `./output/app-debug.apk`

---

## 6. Language & Code Standards

* **100% English Codebase:** All code, variables, function signatures, interfaces, classes, filenames, tests, error messages, and inline documentation must be written in idiomatic English.
* **Zero Host Contamination:** Never run `npm install`, `npx`, or `gradle` directly on your host operating system. All execution happens within the verified Docker containers via the `Makefile`.

---

## 7. CI Pipeline

* `make ci` runs the complete quality gate inside Docker: `init-ci`, `lint`, `test`, and `build-web`.
* `.github/workflows/ci.yml` exposes the required check **Quality Gate** on pull requests and pushes to `main`.
* Branch protection instructions are documented in `.github/BRANCH_PROTECTION.md`. Once enabled, GitHub blocks merges while the check is failing.
* `.github/workflows/android-apk.yml` builds and uploads the debug APK on manual dispatch and `v*` tags.

## 8. Android Packaging

* Capacitor is configured in `capacitor.config.ts` with app id `com.gunswarm.game`.
* The committed `android/` project enforces portrait orientation and immersive fullscreen mode.
* Build the debug APK with:

  ```bash
  make build-apk
  ```

* The artifact is written to `./output/app-debug.apk`.

