# Technical Architecture Specification — GunSwarm 3D

## 1. Architectural Overview & System Boundaries

GunSwarm 3D is architected strictly according to **Domain-Driven Design (DDD)** and **Hexagonal Architecture (Ports and Adapters)**. The fundamental invariant of this system is that **the Domain Layer has zero dependencies on any external framework, rendering library, physics engine, or platform API**.

```text
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                           INFRASTRUCTURE LAYER                              │
 │  ┌───────────────────────┐                        ┌──────────────────────┐  │
 │  │ BrowserTouchAdapter   │                        │ ThreeJsRenderAdapter │  │
 │  │ KeyboardInputAdapter  │                        │ CannonPhysicsAdapter │  │
 │  └───────────┬───────────┘                        │ WebAudioAdapter      │  │
 │              │ (Driving)                          │ LocalStorageAdapter  │  │
 │              ▼                                    └──────────▲───────────┘  │
 │ ┌────────────────────────────────────────────────────────────┴────────────┐ │
 │ │                      APPLICATION LAYER (Use Cases)                      │ │
 │ │   MoveSquadUseCase              ProcessCombatUseCase                    │ │
 │ │   TickGameLoopUseCase           UpgradeMetaAttributeUseCase             │ │
 │ │   RecruitTrooperUseCase         LoadGameProgressUseCase                 │ │
 │ │            │                                          ▲                 │ │
 │ │            │ (Invokes)                                │ (Queries)       │ │
 │ │            ▼                                          │                 │ │
 │ │ ┌─────────────────────────────────────────────────────┴───────────────┐ │ │
 │ │ │                         DOMAIN LAYER                                │ │ │
 │ │ │  Aggregates:     SquadAggregate, StageAggregate                     │ │ │
 │ │ │  Entities:       Trooper, Obstacle, Boss, Gate, Projectile, Pickup  │ │ │
 │ │ │  Value Objects:  Position3D, Velocity3D, Health, Damage, BoundingBox│ │ │
 │ │ │  Domain Events:  TrooperRecruitedEvent, ObstacleDestroyedEvent      │ │ │
 │ │ │  Services:       FormationEngine, CollisionMatrixService            │ │ │
 │ │ └─────────────────────────────────────────────────────────────────────┘ │ │
 │ └─────────────────────────────────────────────────────────────────────────┘ │
 └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Strict Anti-God-File Policy

To prevent the emergence of monolithic files common in AI-generated game code, the following constraints are **mandatory and non-negotiable**:

1. **Hard Line Limit:** No single source file (`.ts`) may exceed **150 lines of code** (excluding standard license headers).
2. **One Definition Per File:**
   * One Class, Interface, or Enum per file.
   * Combining an Entity and its Value Objects in the same file is strictly prohibited.
3. **No Monolithic "GameManager":**
   * The orchestration of the game loop is partitioned into single-responsibility application use cases coordinated by an event-driven dispatcher.
4. **Dedicated Factory Classes:**
   * Procedural mesh generation for each of the 27 entities is split into dedicated factory classes (e.g., `SquadLeaderMeshFactory.ts`, `ExplosiveBarrelMeshFactory.ts`). Under no circumstances may all models be generated in a single utility file.

---

## 3. SOLID Principles Implementation Matrix

| Principle | Architectural Enforcement |
| :--- | :--- |
| **S — Single Responsibility** | Every class has one reason to change. `FormationEngine` only calculates spatial offsets; it never modifies trooper health or triggers sounds. |
| **O — Open/Closed** | New obstacles or boss behaviors are added by implementing domain interfaces (`ObstacleBehavior`) without modifying existing loop code. |
| **L — Liskov Substitution** | Any subclass or implementation of `Entity` (e.g., `StandardTrooper`, `BossEntity`) conforms to identical lifecycle and bounding contracts. |
| **I — Interface Segregation** | Secondary ports are granular: `RenderPort`, `PhysicsPort`, `AudioPort`, `StoragePort`, and `InputPort` are isolated. No adapter is forced to implement methods it does not consume. |
| **D — Dependency Inversion** | High-level application use cases depend exclusively on abstract Port interfaces. Concrete adapters (`ThreeJsRenderAdapter`, `CannonPhysicsAdapter`) implement these interfaces and are injected at the Composition Root (`main.ts`). |

---

## 4. Directory & Module Blueprint

```text
src/
├── domain/                                 # Pure TypeScript. Zero dependencies.
│   ├── aggregates/
│   │   ├── SquadAggregate.ts               # Root entity for swarm state and troopers
│   │   └── StageAggregate.ts               # Root entity for phase track, boss, and pacing
│   ├── entities/
│   │   ├── Trooper.ts                      # Individual swarm unit
│   │   ├── Obstacle.ts                     # Destructible/indestructible track blocker
│   │   ├── Boss.ts                         # End-phase boss entity
│   │   ├── MathGate.ts                     # Multiplier gate entity
│   │   ├── Projectile.ts                   # Active bullet entity
│   │   └── Pickup.ts                       # Collectible item (coin, weapon chest)
│   ├── value-objects/
│   │   ├── Position3D.ts                   # Immutable vector (x, y, z)
│   │   ├── Velocity3D.ts                   # Immutable velocity vector
│   │   ├── BoundingBox3D.ts                # AABB collision volume
│   │   ├── Health.ts                       # Non-negative clamped integer
│   │   ├── Damage.ts                       # Positive combat impact value
│   │   ├── WeaponTier.ts                   # Enum + value object (Tier 1 through 5)
│   │   └── Currency.ts                     # Player gold balance
│   ├── events/
│   │   ├── TrooperRecruitedEvent.ts
│   │   ├── TrooperKilledEvent.ts
│   │   ├── ObstacleDestroyedEvent.ts
│   │   ├── GatePassedEvent.ts
│   │   ├── BossDefeatedEvent.ts
│   │   └── SquadWipedEvent.ts
│   └── services/
│       ├── FormationEngine.ts              # Mathematical Fermat spiral slot calculator
│       └── CollisionDetectionService.ts    # Pure mathematical AABB intersection checks
│
├── application/                            # Application Orchestration & Ports
│   ├── ports/
│   │   ├── driving/                        # Inbound interfaces
│   │   │   └── GameLoopPort.ts
│   │   └── driven/                         # Outbound secondary ports (SPI)
│   │       ├── RenderPort.ts               # Abstract visual commands
│   │       ├── PhysicsPort.ts              # Abstract physics/collision queries
│   │       ├── AudioPort.ts                # Abstract sound trigger commands
│   │       ├── StoragePort.ts              # Abstract persistence contracts
│   │       └── InputPort.ts                # Abstract user interaction stream
│   ├── use-cases/
│   │   ├── TickGameLoopUseCase.ts          # Advances 1 frame of physics & logic
│   │   ├── MoveSquadUseCase.ts             # Applies lateral user inputs to swarm
│   │   ├── ProcessCombatUseCase.ts         # Raycasting, shooting, damage resolution
│   │   ├── ResolveCollisionsUseCase.ts     # Dispatches gate, obstacle & pickup contacts
│   │   ├── UpgradeAttributeUseCase.ts      # Handles meta-progression shop purchases
│   │   └── LoadProgressUseCase.ts          # Restores save state on boot
│   └── dtos/
│       ├── GameStateDTO.ts                 # Read-only snapshot for presentation
│       └── SaveGameDTO.ts                  # Serialization structure for LocalStorage
│
├── infrastructure/                         # External Technology Adapters
│   ├── rendering/
│   │   ├── ThreeJsRenderAdapter.ts         # Implements RenderPort
│   │   ├── SceneManager.ts                 # Camera, lighting, and linear fog
│   │   └── factories/                      # 27 Isolated Procedural Mesh Factories
│   │       ├── SquadLeaderMeshFactory.ts
│   │       ├── StandardTrooperMeshFactory.ts
│   │       ├── HeavyTrooperMeshFactory.ts
│   │       ├── BossMeshFactory.ts
│   │       ├── ObstacleMeshFactory.ts
│   │       └── GateMeshFactory.ts
│   ├── physics/
│   │   └── CannonPhysicsAdapter.ts         # Implements PhysicsPort
│   ├── audio/
│   │   ├── WebAudioAdapter.ts              # Implements AudioPort
│   │   └── SoundSynthesizers.ts            # Oscillator/Noise automation functions
│   ├── storage/
│   │   └── LocalStorageAdapter.ts          # Implements StoragePort
│   └── input/
│       ├── BrowserTouchInputAdapter.ts     # Implements InputPort (Touch events)
│       └── KeyboardInputAdapter.ts         # Implements InputPort (Desktop fallback)
│
└── main.ts                                 # Composition Root (Dependency Injection wiring)
```

---

## 5. Port Contract Specifications (TypeScript Interfaces)

### 5.1 `RenderPort.ts`
```typescript
import { Position3D } from '../../domain/value-objects/Position3D';

export interface RenderPort {
  initViewport(container: HTMLElement): void;
  render(): void;
  createEntityMesh(id: string, type: string, position: Position3D): void;
  updateEntityTransform(id: string, position: Position3D, rotationY?: number): void;
  removeEntityMesh(id: string): void;
  updateCameraTarget(targetPosition: Position3D): void;
  spawnExplosionParticles(position: Position3D, color: number): void;
  setBiomeEnvironment(biomeId: number): void;
}
```

### 5.2 `PhysicsPort.ts`
```typescript
import { Position3D } from '../../domain/value-objects/Position3D';
import { BoundingBox3D } from '../../domain/value-objects/BoundingBox3D';

export interface PhysicsPort {
  step(deltaTime: number): void;
  registerCollider(id: string, box: BoundingBox3D, isStatic: boolean): void;
  updateColliderPosition(id: string, position: Position3D): void;
  removeCollider(id: string): void;
  queryOverlaps(id: string): string[];
}
```

### 5.3 `AudioPort.ts`
```typescript
export interface AudioPort {
  initContext(): Promise<void>;
  playPistolShot(): void;
  playSMGShot(): void;
  playShotgunBlast(): void;
  playAssaultLaser(): void;
  playRocketExplosion(): void;
  playRecruitChime(): void;
  playGateWhoosh(): void;
  playCoinPickup(): void;
  playPlayerDeath(): void;
  playBossDefeat(): void;
}
```

### 5.4 `StoragePort.ts`
```typescript
import { SaveGameDTO } from '../dtos/SaveGameDTO';

export interface StoragePort {
  save(data: SaveGameDTO): Promise<void>;
  load(): Promise<SaveGameDTO | null>;
  clear(): Promise<void>;
}
```

### 5.5 `InputPort.ts`
```typescript
export interface InputPort {
  getNormalizedLateralDelta(): number;
  resetDelta(): void;
  isActionTriggered(): boolean;
}
```

---

## 6. Composition Root & Dependency Injection Pattern

The entry point `main.ts` functions exclusively as the Composition Root. It instantiates the infrastructure adapters, connects them to the application use cases, and triggers the bootstrap sequence:

```typescript
// Conceptual wiring in main.ts
const renderAdapter = new ThreeJsRenderAdapter();
const physicsAdapter = new CannonPhysicsAdapter();
const audioAdapter = new WebAudioAdapter();
const storageAdapter = new LocalStorageAdapter();
const inputAdapter = new BrowserTouchInputAdapter();

const tickGameLoop = new TickGameLoopUseCase(
  renderAdapter,
  physicsAdapter,
  audioAdapter,
  inputAdapter
);

// Start game loop
function loop(timestamp: number) {
  tickGameLoop.execute(timestamp);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
```

---

## 7. Testing Strategy Architecture

The codebase enforces a high pyramid of automated tests using **Vitest**:

1. **Domain Unit Tests (`tests/unit/domain/`):**
   * Test business calculations (`FormationEngine`, `Health`, `CombatResolution`).
   * Execution time: $< 5\text{ms}$ per test suite. Zero browser or canvas mocks required.
2. **Application Use Case Tests (`tests/unit/application/`):**
   * Mock implementations of `RenderPort`, `PhysicsPort`, and `AudioPort` verify that use cases invoke external ports correctly in response to domain events.
3. **Integration Tests (`tests/integration/`):**
   * Verify that `LocalStorageAdapter` correctly serializes and restores complex aggregate states.
   * Verify that `ThreeJsRenderAdapter` manages mesh hierarchies without leaking memory buffers.
