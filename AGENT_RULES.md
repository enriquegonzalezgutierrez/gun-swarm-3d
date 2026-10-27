# Autonomous Agent Operational Rules — GunSwarm 3D

This document specifies the strict behavioral constraints, engineering standards, and execution protocol that **OpenCode**, **DeepSeek**, or any autonomous AI coding agent must follow when operating on this repository.

---

## 1. Absolute Prohibitions ("NEVER" Rules)

Violation of any of these rules will result in an immediate architectural failure:

1. **NEVER execute package managers on the host machine.**
   * Do NOT run `npm`, `npx`, `yarn`, `pnpm`, `pip`, or `gradle` directly on the host system.
   * All commands must be routed through the project `Makefile` which executes exclusively inside isolated Docker containers.
2. **NEVER introduce external binary 3D assets or audio files.**
   * Do NOT download, load, or reference `.gltf`, `.glb`, `.obj`, `.fbx`, `.mp3`, `.wav`, or `.ogg` files.
   * All 3D visual entities must be generated programmatically using Three.js geometric primitives (`BoxGeometry`, `CylinderGeometry`, `SphereGeometry`, `CapsuleGeometry`).
   * All sound effects must be synthesized programmatically using the Web Audio API.
3. **NEVER create "God Files" or monolithic classes.**
   * The hard limit is **150 lines of code per file**.
   * If a file approaches 130 lines, refactor immediately by extracting sub-components, helper strategies, or value objects into separate files.
   * Do NOT combine multiple classes, interfaces, or entities into a single file. One definition per file.
4. **NEVER violate Domain boundaries (Hexagonal Architecture).**
   * Files inside `src/domain/` MUST NOT import anything from `three`, `cannon-es`, `@capacitor/*`, or browser DOM APIs (`window`, `document`, `HTMLElement`).
   * Domain logic must remain 100% pure TypeScript.
5. **NEVER skip testing.**
   * Do NOT mark any task as completed in `PROGRESS.md` unless `make test` has been executed and reports 100% passing test suites.
6. **NEVER use non-English naming.**
   * All identifiers, variable names, classes, interfaces, filenames, comments, and commit messages must be strictly in professional technical English.

---

## 2. Mandatory Verification & Workflow Protocol

The agent must operate in a disciplined, atomic loop. Follow this exact 6-step cycle for every task:

```text
1. READ PROGRESS.md  --> Identify the next unchecked atomic task [ ].
2. REVIEW CONTRACTS  --> Check ARCHITECTURE.md and GDD.md for required interfaces.
3. IMPLEMENT (TDD)   --> Create unit test first (or alongside) small single-purpose files.
4. EXECUTE TESTS     --> Run `make test` via the container.
5. VERIFY BOUNDS     --> Ensure no new file exceeds 150 lines and types check via `make lint`.
6. UPDATE STATE      --> Mark task as [x] in PROGRESS.md and proceed to the next item.
```

---

## 3. Makefile Command Authority

The agent must interact with the project workspace exclusively using these targets:

| Agent Intent | Authorized Command | Expected Outcome |
| :--- | :--- | :--- |
| Initialize workspace | `make init` | Containers built, dependencies installed in Docker volume. |
| Run test suite | `make test` | Vitest executes headlessly; exits with code `0`. |
| Validate types and lint | `make lint` | `tsc --noEmit` verifies strict type correctness. |
| Test web compilation | `make build-web` | Vite builds production bundle into `dist/`. |
| Compile Android APK | `make build-apk` | Headless Gradle builds `output/app-debug.apk`. |
| Inspect targets | `make help` | Prints available commands and usage hints. |

---

## 4. Coding Standards & File Organization

### 4.1 File Naming Conventions
* **Classes & Interfaces:** UpperCamelCase (e.g., `SquadLeaderMeshFactory.ts`, `RenderPort.ts`).
* **Value Objects & Entities:** UpperCamelCase (e.g., `Position3D.ts`, `Trooper.ts`).
* **Unit Tests:** Match source filename with `.test.ts` suffix (e.g., `FormationEngine.test.ts`).
* **Directory Names:** kebab-case (e.g., `value-objects/`, `use-cases/`, `math-gates/`).

### 4.2 TypeScript Strictness
* `"strict": true` in `tsconfig.json` is mandatory.
* No usage of the `any` type under any circumstances. Use explicit interfaces, generics, or `unknown` with type guards.
* All public methods on entities, use cases, and ports must declare explicit return types.

### 4.3 Procedural Mesh Factories
Every entity mesh must reside in its own isolated factory class under `src/infrastructure/rendering/factories/`.
Example contract:
```typescript
export interface EntityMeshFactory {
  createMesh(): THREE.Group | THREE.Mesh;
}
```
Do NOT place multiple entity mesh creations inside a single file.

---

## 5. Error Recovery & Debugging Rules

When a test fails or compilation breaks during `make test` or `make lint`:

1. **Do not hallucinate external libraries:** Do NOT add new third-party npm packages to fix issues unless explicitly instructed in `ARCHITECTURE.md`.
2. **Read the compiler output carefully:** Fix the exact type mismatch or logic error reported by Vitest or TypeScript.
3. **Keep changes minimal:** Do not rewrite unrelated files when troubleshooting an issue.
4. **Revert if stuck:** If a code modification causes cascading failures across multiple layers, revert the atomic change and reconsider the domain design before trying again.
