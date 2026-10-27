# Implementation Progress Tracker — GunSwarm 3D

This document serves as the single source of truth for tracking project execution. Tasks are structured into granular, atomic steps to enforce the Anti-God-File rule and maintain architectural integrity.

**Protocol:** Complete one atomic task at a time, verify with `make test` and `make lint`, mark with `[x]`, and proceed.

---

## Phase 0: Project Infrastructure & Docker Orchestration
- [x] `0.1` Create `.docker/dev.Dockerfile` (Node 20 Alpine, non-root user, Vite port 5173).
- [x] `0.2` Create `.docker/builder.Dockerfile` (Ubuntu 22.04, OpenJDK 17, Android CLI SDK, Gradle).
- [x] `0.3` Create `docker-compose.yml` defining `dev` and `builder` services with volume bindings.
- [x] `0.4` Create root `Makefile` implementing all targets (`help`, `init`, `dev`, `test`, `lint`, `build-web`, `build-apk`, `clean`).
- [x] `0.5` Initialize `package.json` with TypeScript, Vite, Vitest, Three.js, Cannon-es, and Capacitor dependencies.
- [x] `0.6` Create `tsconfig.json` with strict mode, target ES2022, and path aliases.
- [x] `0.7` Create `public/index.html` with responsive 9:16 portrait viewport canvas container.
- [x] `0.8` Verify infrastructure: run `make init` and ensure container health.

---

## Phase 1: Pure Domain Layer (DDD Core)
*Constraint: Zero external dependencies in this phase. Run `make test` after each subtask.*

### Value Objects (`src/domain/value-objects/`)
- [x] `1.1` Implement `Position3D.ts` and `Position3D.test.ts` (Immutable vector with distance and lerp methods).
- [x] `1.2` Implement `Velocity3D.ts` and `Velocity3D.test.ts` (Immutable velocity vector).
- [x] `1.3` Implement `BoundingBox3D.ts` and `BoundingBox3D.test.ts` (Axis-Aligned Bounding Box intersection math).
- [x] `1.4` Implement `Health.ts` and `Health.test.ts` (Clamped non-negative integer with damage/heal operations).
- [x] `1.5` Implement `Damage.ts` and `Damage.test.ts` (Positive combat impact value with multipliers).
- [x] `1.6` Implement `WeaponTier.ts` and `WeaponTier.test.ts` (Enum + Value Object for Tiers 1 through 5).
- [x] `1.7` Implement `Currency.ts` and `Currency.test.ts` (Gold value object with add/deduct safety checks).

### Domain Events (`src/domain/events/`)
- [x] `1.8` Implement `DomainEvent.ts` base interface and EventDispatcher.
- [x] `1.9` Implement `TrooperRecruitedEvent.ts` and `TrooperKilledEvent.ts`.
- [x] `1.10` Implement `ObstacleDestroyedEvent.ts` and `GatePassedEvent.ts`.
- [x] `1.11` Implement `BossDamagedEvent.ts`, `BossDefeatedEvent.ts`, and `SquadWipedEvent.ts`.

### Domain Entities (`src/domain/entities/`)
- [x] `1.12` Implement `Trooper.ts` and unit tests (Lifecycle state: Active, Dead, Hopping).
- [x] `1.13` Implement `Obstacle.ts` and unit tests (Destructible vs Indestructible, HP tracking).
- [x] `1.14` Implement `MathGate.ts` and unit tests (Operation types: `+`, `-`, `x`, `÷`).
- [x] `1.15` Implement `Projectile.ts` and unit tests (Position, velocity, penetration counter).
- [x] `1.16` Implement `Pickup.ts` and unit tests (Gold coin, weapon chest, shield orb).
- [x] `1.17` Implement `Boss.ts` and unit tests (Multi-phase health thresholds, approach movement).

### Aggregates & Domain Services (`src/domain/aggregates/`, `src/domain/services/`)
- [x] `1.18` Implement `FormationEngine.ts` and `FormationEngine.test.ts` (Fermat spiral/lattice slot distribution).
- [x] `1.19` Implement `CollisionDetectionService.ts` and unit tests (Pure mathematical AABB broadphase).
- [x] `1.20` Implement `SquadAggregate.ts` and unit tests (Leader, active troopers, weapon tier, swarm center).
- [x] `1.21` Implement `StageAggregate.ts` and unit tests (Current phase distance, track bounds, boss state).

---

## Phase 2: Application Layer (Ports & Use Cases)
*Verify application logic using mocks for secondary ports.*

### Port Interfaces (`src/application/ports/`)
- [x] `2.1` Define `RenderPort.ts` (Visual creation, transform updates, particle triggers).
- [x] `2.2` Define `PhysicsPort.ts` (Collider registration, step, overlap queries).
- [x] `2.3` Define `AudioPort.ts` (Procedural sound invocation signatures).
- [x] `2.4` Define `StoragePort.ts` (Meta-save and load contracts).
- [x] `2.5` Define `InputPort.ts` (Normalized lateral delta input query).

### DTOs & Use Cases (`src/application/dtos/`, `src/application/use-cases/`)
- [x] `2.6` Implement `GameStateDTO.ts` and `SaveGameDTO.ts`.
- [x] `2.7` Implement `MoveSquadUseCase.ts` and unit test with mock input port.
- [x] `2.8` Implement `ProcessCombatUseCase.ts` and unit test (Auto-fire raycast, bullet spawning, damage).
- [x] `2.9` Implement `ResolveCollisionsUseCase.ts` and unit test (Gate triggers, obstacles, pickups).
- [x] `2.10` Implement `UpgradeAttributeUseCase.ts` and unit test (Cost curve calculation, gold deduction).
- [x] `2.11` Implement `LoadProgressUseCase.ts` and unit test (Save-state restoration).
- [x] `2.12` Implement `TickGameLoopUseCase.ts` and unit test (Frame orchestration).

---

## Phase 3: Procedural Audio Infrastructure (Web Audio API)
*Constraint: Zero audio asset files. 100% code synthesis.*

- [x] `3.1` Implement `SoundSynthesizers.ts` (Oscillator frequency drops, noise buffer generators, envelopes).
- [x] `3.2` Implement `WebAudioAdapter.ts` implementing `AudioPort.ts`.
- [x] `3.3` Implement unit tests/mocks for `WebAudioAdapter.ts` ensuring clean audio context handling.

---

## Phase 4: Procedural 3D Visuals & Rendering Infrastructure (Three.js)
*Constraint: Zero external 3D models. Maximum 150 lines per factory.*

### Core Renderer & Scene Management
- [x] `4.1` Implement `SceneManager.ts` (Perspective camera, directional light, ambient light, linear fog).
- [x] `4.2` Implement `ThreeJsRenderAdapter.ts` implementing `RenderPort.ts`.

### Procedural Entity Mesh Factories (`src/infrastructure/rendering/factories/`)
- [x] `4.3` Implement `SquadLeaderMeshFactory.ts` (Blue capsule, cap, backpack, antenna).
- [x] `4.4` Implement `StandardTrooperMeshFactory.ts` (Blue capsule, helmet).
- [x] `4.5` Implement `HeavyTrooperMeshFactory.ts` (Scaled blue capsule, chest plate, shoulder pads).
- [x] `4.6` Implement `CivilianRecruitMeshFactory.ts` (Yellow capsule, waving arms).
- [x] `4.7` Implement `MeleeRunnerMeshFactory.ts` (Slender red capsule, dual daggers).
- [x] `4.8` Implement `RiotShieldEnemyMeshFactory.ts` (Red capsule, curved shield box).
- [x] `4.9` Implement `KamikazeBomberMeshFactory.ts` (Orange capsule, pulsing chest sphere).
- [x] `4.10` Implement `StaticSniperMeshFactory.ts` (Crouching red capsule, tripod rifle).
- [x] `4.11` Implement `DroneScoutMeshFactory.ts` (Quad-rotor disc drone).
- [x] `4.12` Implement `WoodCrateMeshFactory.ts` and `ConcreteBlockMeshFactory.ts`.
- [x] `4.13` Implement `SteelVaultMeshFactory.ts` and `ExplosiveBarrelMeshFactory.ts`.
- [x] `4.14` Implement `ToxicBarrelMeshFactory.ts` and `RotatingSpikeRollerMeshFactory.ts`.
- [x] `4.15` Implement `SwingingBladeMeshFactory.ts` and `ConveyorTileMeshFactory.ts`.
- [x] `4.16` Implement `MathGateMeshFactory.ts` (Positive and negative variants with canvas text texture).
- [x] `4.17` Implement `PickupMeshFactories.ts` (Weapon chest, shield orb, gold coin).
- [x] `4.18` Implement `Boss1_WarRigMeshFactory.ts` (6-wheeled truck with roof turrets).
- [x] `4.19` Implement `Boss2_DreadChopperMeshFactory.ts` (Fuselage, dual rotors, rocket pods).
- [x] `4.20` Implement `Boss3_SpiderMechMeshFactory.ts` (Central core, 4 articulated legs).
- [x] `4.21` Implement `Boss4_FrostBehemothMeshFactory.ts` (Giant bipedal mech).
- [x] `4.22` Implement `Boss5_DreadNexusMeshFactory.ts` (Concentric rotating rings, core sphere).
- [x] `4.23` Implement `ParticleSystemManager.ts` (Explosion sparks and debris particle recycling).

---

## Phase 5: Physics & Collision Infrastructure (Cannon-es)
- [x] `5.1` Implement `CannonPhysicsAdapter.ts` implementing `PhysicsPort.ts`.
- [x] `5.2` Implement collider mapping between `BoundingBox3D` and Cannon-es bodies.
- [x] `5.3` Implement integration test verifying overlap detection synchronization with domain coordinates.

---

## Phase 6: Input & Storage Adapters
- [x] `6.1` Implement `BrowserTouchInputAdapter.ts` implementing `InputPort.ts` (Touch drag normalization).
- [x] `6.2` Implement `KeyboardInputAdapter.ts` (Arrow / A-D keys fallback for desktop web).
- [x] `6.3` Implement `LocalStorageAdapter.ts` implementing `StoragePort.ts`.
- [x] `6.4` Implement integration test for `LocalStorageAdapter.ts` save/load/clear cycles.

---

## Phase 7: Biomes & Environment Architecture
- [x] `7.1` Implement `BiomeConfig.ts` and biome theme registry.
- [x] `7.2` Implement `MetropolisBiomeFactory.ts` (Street lamps, gantry signs, neon buildings).
- [x] `7.3` Implement `ScorchedCanyonBiomeFactory.ts` (Pumpjacks, rock spires, rusted car frames).
- [x] `7.4` Implement `ToxicFoundryBiomeFactory.ts` (Cooling towers, pipe networks, vats).
- [x] `7.5` Implement `ArcticFortressBiomeFactory.ts` (Watchtowers, searchlights, pine trees, bunkers).
- [x] `7.6` Implement `CyberVoidBiomeFactory.ts` (Floating obelisks, data rings, starry skybox).

---

## Phase 8: Level Progression, UI Overlays & Composition Root
- [x] `8.1` Implement `PhaseCatalog.ts` defining configurations for Phases 1 through 5.
- [x] `8.2` Implement HTML/CSS UI Overlays:
  - HUD (Active squad count, current weapon tier, gold counter, distance bar).
  - Start Run Overlay (3-2-1 Countdown).
  - Victory Overlay (Boss defeated, gold multiplier breakdown, next level button).
  - Defeat Overlay (Retry button, upgrade shop button, run stats).
  - Meta-Upgrade Shop Modal (Attribute upgrade cards with cost and level).
- [x] `8.3` Implement `main.ts` (Composition Root: instantiate adapters, wire use cases, launch loop).
- [x] `8.4` Verify end-to-end playable loop in browser (`make dev`).

---

## Phase 9: Android Packaging Pipeline (Headless Build)
- [x] `9.1` Initialize Capacitor Android configuration via `builder` container.
- [x] `9.2` Configure `AndroidManifest.xml` (Enforce portrait orientation, fullscreen immersive mode).
- [x] `9.3` Execute production web build via `make build-web`.
- [x] `9.4` Execute headless Gradle APK compilation via `make build-apk`.
- [x] `9.5` Verify final output artifact: `./output/app-debug.apk`.
