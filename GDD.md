# Game Design Document (GDD) — GunSwarm 3D

## 1. Executive Summary & Viewport Specifications

* **Game Title:** GunSwarm 3D
* **Genre:** 3D Hyper-Casual Swarm Runner & Auto-Shooter.
* **Target Viewport:** Strict Vertical Portrait (Aspect Ratio 9:16).
  * **Mobile:** Fullscreen touch canvas.
  * **Desktop Web:** Responsive 9:16 container centered horizontally on screen with a dark matte backdrop (`#0d0f12`), preserving identical camera Field of View (FOV) and coordinate space across all devices.
* **Camera Configuration:**
  * **Type:** Perspective Camera.
  * **Field of View (FOV):** 60 degrees.
  * **Offset Vector:** `(0, 14, -12)` relative to Squad Leader position.
  * **LookAt Target:** Squad Leader position offset by `(0, 1.5, 6)` forward.
  * **Damping (Smooth Follow):** Linear interpolation factor $L = 0.1$ on $X$ axis; rigid lock on $Z$ axis.

---

## 2. World Coordinate System & Track Layout

* **Coordinate System:**
  * $+X$: Right.
  * $-X$: Left.
  * $+Y$: Up.
  * $+Z$: Forward direction of travel.
* **Track Metric Dimensions:**
  * **Width:** Total width = 10.0 units. Lateral boundaries are clamped at $X_{min} = -4.5$ and $X_{max} = 4.5$.
  * **Segment Length:** Standard modular track segment length = 50.0 units.
  * **Phase Distance:** Levels span between 200.0 and 350.0 units along the $+Z$ axis before reaching the Boss Arena.
* **Track Physical Boundaries:**
  * Left and Right elevated curb barriers: Width = 0.5, Height = 0.8, Length = 50.0, placed at $X = \pm 4.75$.

---

## 3. Core Locomotion & Swarm Formation Mechanics

### 3.1 Squad Leader Movement
* **Forward Velocity ($V_z$):** Base constant velocity = $14.0\text{ units/second}$.
* **Lateral Velocity ($V_x$):** Driven by user input touch/drag delta ($\Delta X$).
  * Transfer ratio: $X_{target} = X_{current} + (\text{InputDeltaX} \times 0.035)$.
  * Clamping: $X_{target} \in [-4.5, 4.5]$.
  * Smoothing: $X_{leader} = \text{lerp}(X_{leader}, X_{target}, 0.25)$.

### 3.2 Swarm Packing Algorithm (Fermat Spiral / Hexagonal Lattice)
The squad consists of 1 Squad Leader plus $N$ active troopers ($N \ge 0$). Troopers do not trail in single file; they arrange dynamically around the Leader's local origin $(X_0, Z_0)$ using an offset packing calculation:

$$\Delta X_i = r \cdot \sqrt{i} \cdot \cos(i \cdot \theta)$$
$$\Delta Z_i = -r \cdot \sqrt{i} \cdot \sin(i \cdot \theta)$$

* Where index $i \in [1, N]$.
* Golden Angle $\theta \approx 2.399963\text{ radians } (137.5^\circ)$.
* Spacing constant $r = 0.65\text{ units}$.
* **Collision Avoidance:** Troopers maintain a minimum personal distance of $0.55\text{ units}$. If a trooper is pushed into lateral boundary $|X| > 4.5$, its position is clamped, compressing the swarm inward.
* **Interpolation:** Each trooper updates its local position via $\text{lerp}$ with factor $0.15$ per frame to smoothly adapt when members are added or killed.

---

## 4. Weapons & Combat Mechanics

All active squad members wield identical weaponry determined by the current Squad Weapon Tier.

### 4.1 Weapon Arsenal Tiers

| Tier | Weapon Name | Fire Rate (shots/sec/unit) | Damage / Bullet | Projectile Speed | Spread Angle | Visual Geometry (Primitives) | Projectile Primitive |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **1** | Service Pistol | 2.5 | 1.0 | 45.0 | $0^\circ$ | Single black box `(0.1, 0.15, 0.3)` in right hand. | Yellow glowing sphere `radius: 0.1`. |
| **2** | Dual SMGs | 6.0 (3.0 per hand) | 1.0 | 50.0 | $\pm 2^\circ$ | Twin dark-grey boxes in both hands with top mini-cylinders. | Dual elongated yellow capsules `(0.06, 0.25)`. |
| **3** | Combat Shotgun | 1.4 | 2.5 per pellet | 40.0 | $\{-8^\circ, 0^\circ, +8^\circ\}$ | Long grey box with double silver cylinders for barrels. | Triple orange spheres `radius: 0.12`. |
| **4** | Assault Rifle | 4.5 | 2.0 (Pierces 1 target) | 55.0 | $\pm 1^\circ$ | Extended black box with curved magazine box underneath. | Cyan laser-like capsules `(0.08, 0.45)`. |
| **5** | Rocket Launcher | 0.8 | 15.0 (AoE radius 2.5) | 30.0 | $0^\circ$ | Olive-green shoulder cylinder `(radius: 0.15, len: 0.8)`. | Red/white rocket cone + cylinder with trail. |

### 4.2 Targeting & Projectile Lifecycle
* **Auto-Fire Detection:** Every active squad member emits a continuous raycast forward $(0, 0, 1)$ up to a range of $35.0\text{ units}$. If any obstacle, enemy, or boss intersects, shooting is engaged.
* **Projectile Pooling:** Projectiles are managed via a pre-allocated object pool (maximum 200 active projectiles) to eliminate memory allocation during combat.
* **Impact Resolution:**
  * Bullet intersects target hitbox $\rightarrow$ Deduct bullet damage from target HP $\rightarrow$ Spawn procedural spark particles $\rightarrow$ Return bullet to pool.
  * Tier 4 Piercing: Decrements target penetration counter; bullet survives 1 collision and despawns on the 2nd.
  * Tier 5 Rocket: Detonates on first impact; queries all entities within radius $2.5\text{ units}$ and deals damage inversely proportional to distance.

---

## 5. Interactive Entities & Obstacle Catalog

### 5.1 Math Multiplier Gates (Height: 3.5, Width: 4.5)
Floating planar energy barriers dividing the track into Left ($X \in [-4.5, 0]$) and Right ($X \in [0, 4.5]$) decision lanes.
* **Positive Blue Gate:** Material emissive cyan. Operations:
  * `+N`: Instantly spawns $N$ troopers into the swarm ($N \in \{5, 10, 15, 25\}$).
  * `xN`: Multiplies total current squad count by $N$ ($N \in \{2, 3\}$).
* **Negative Red Gate:** Material emissive crimson. Operations:
  * `-N`: Removes $N$ troopers from the swarm.
  * `÷N`: Divides total current squad count by $N$ (rounded down).
* **Gate Consumption:** Passing through one lane gate destroys the adjacent sibling gate to prevent double activation.

### 5.2 Destructible & Hazardous Obstacles
* **Wood Crate (HP: 5 - 15):** Cube `(1.2, 1.2, 1.2)`. Drops 1 gold coin upon destruction.
* **Concrete Block (HP: 20 - 50):** Heavy block `(1.8, 1.8, 1.8)`. Displays floating integer HP text above mesh. If hit by squad, subtracts remaining HP from squad count 1:1 and breaks.
* **Steel Vault (HP: 100 - 200):** Dark-grey metallic cube with corner rivets. Drops a guaranteed Weapon Upgrade Chest upon destruction.
* **Explosive Barrel (HP: 1):** Red cylinder with yellow stripes `(radius: 0.6, height: 1.4)`. Explodes on lethal damage: deals 50 damage to all objects in radius $3.5\text{ units}$.
* **Toxic Barrel (HP: 1):** Bright green cylinder. Upon destruction, leaves an acid puddle on the road for $4.0\text{ seconds}$. Any trooper touching the puddle is eliminated (1 trooper lost per $0.2\text{ seconds}$).
* **Rotating Spike Roller (Indestructible):** Horizontal cylinder spanning 4.0 units with 8 triangular cones, rotating at $180^\circ/\text{sec}$. Instantly kills any trooper making contact.
* **Swinging Blade (Indestructible):** Overhead pendulum arm holding a crescent blade swinging between $X = -4.0$ and $X = +4.0$ with period $T = 1.8\text{ seconds}$.

### 5.3 Pickups & Collectibles
* **Civilian Recruit:** Grey neutral trooper standing in place with arms waving. Touching them converts them into an active Blue Trooper with a celebratory hop.
* **Weapon Upgrade Chest:** Floating golden chest with upward-pulsing glow ring. Advances squad weapon tier by $+1$ (capped at Tier 5).
* **Shield Orb:** Spherical pickup granting the Squad Leader invulnerability for $3.5\text{ seconds}$.
* **Gold Coin:** Rotating golden disc `(radius: 0.35, thickness: 0.08)`. Adds $+1$ to run currency.

---

## 6. Procedural 3D Entity Models (27 Geometric Assemblies)

No external 3D model files are permitted. All entities are assembled strictly via `THREE.Group` compositions:

```text
1. SquadLeader          : Blue capsule body + brown backpack box + cap box + visor box + antenna cylinder.
2. StandardTrooper      : Blue capsule body (radius 0.25, height 0.8) + dark-blue helmet hemisphere.
3. HeavyTrooper         : Scaled blue capsule (1.2x) + grey chest armor box + dual cubic shoulder pads.
4. CivilianRecruit      : Yellow capsule body + neutral white spherical head + waving cylinder arms.
5. MeleeRunner          : Slender red capsule + dual red knife blades (angled boxes) in hands.
6. RiotShieldEnemy      : Red capsule + large grey curved front shield box (width 1.2, height 1.6).
7. KamikazeBomber       : Orange capsule + pulsing white-to-red chest sphere + sparking fuse cylinder.
8. StaticSniper         : Dark-red crouching capsule + long black rifle barrel cylinder on tripod.
9. DroneScout           : Red central disc + 4 diagonal cylinder struts + 4 spinning rotor boxes.
10. WoodCrate           : Brown cube + cross-brace raised planar strips on 6 faces.
11. ConcreteBlock       : Textured light-grey cube with beveled top edges and procedural damage cracks.
12. SteelVault          : Metallic dark-grey cube + central circular wheel handle + corner rivet spheres.
13. ExplosiveBarrel     : Red cylinder + yellow caution band ring + top circular valve box.
14. ToxicBarrel         : Lime-green cylinder + biohazard cross primitives + glowing top opening.
15. RotatingSpikeRoller : Steel axis cylinder + 8 conical spike primitives evenly spaced in radial pattern.
16. SwingingBlade       : Pivot joint box + long vertical strut cylinder + flat curved crescent blade mesh.
17. ConveyorTile        : Flat ground box with 3 consecutive chevron arrow planes pointing forward.
18. MathGatePositive    : Dual vertical cyan support pillars + top lintel box + glowing glass quad + text.
19. MathGateNegative    : Dual vertical crimson support pillars + top lintel box + warning chevron glass + text.
20. WeaponUpgradeChest  : Metallic green chest box + gold lock latch cube + rotating aura torus.
21. ShieldOrb           : Translucent blue outer sphere (opacity 0.6) + rotating inner wireframe icosahedron.
22. GoldCoin            : 16-segment yellow cylinder with raised edge ring and center star primitive.
23. Boss1_WarRig        : Massive 6-wheeled truck base + armored cab box + dual roof turret cylinders.
24. Boss2_DreadChopper  : Aerodynamic fuselage box + tail boom + dual top counter-rotating rotor boxes + rocket pods.
25. Boss3_SpiderMech    : Central armored sphere core + 4 two-segmented jointed mechanical legs.
26. Boss4_FrostBehemoth : Massive humanoid mech: heavy leg pillars + torso block + shoulder missile battery.
27. Boss5_DreadNexus    : Core floating glowing sphere + 3 concentric orbiting polygonal rings + 4 shield generators.
```

---

## 7. The 5 Biomes & Canonical Phase Catalog

Each phase features distinct track materials, skybox/fog palettes, dynamic side props, and special environmental mechanics:

### Phase 1: "Metropolis Boulevard"
* **Theme:** Sleek urban night highway.
* **Palette:** Asphalte `#1a1a24`, Fog `#0c0d14` (Range: 60 - 150), Neon Blue `#00e5ff`.
* **Side Scenery Props:** Dual-arm street light poles, overhead highway gantries, glowing neon skyscraper backdrops.
* **Track Length:** 220 units.
* **Progression:** Weapon Tier 1 $\rightarrow$ Tier 2. Focus on teaching gate math (`+5`, `x2`) and soft wood crates.
* **Boss:** `Boss1_WarRig` (HP: 200). Stationary at $Z = 220$; emits exhaust smoke; launches single explosive shells every $3.0\text{ seconds}$.

### Phase 2: "Scorched Canyon"
* **Theme:** Desert wasteland military outpost.
* **Palette:** Red sand `#4a2211`, Fog `#2a1208` (Range: 50 - 130), Rust Orange `#ff5722`.
* **Side Scenery Props:** Nodding oil pumpjacks, desert rock spires, barbed wire barriers, abandoned rusted car chassis.
* **Track Length:** 250 units.
* **Environmental Hazard:** Crosswind Gusts: Gentle sinusoidal lateral force $F_x = \sin(Z \cdot 0.05) \cdot 1.5$ applied to swarm.
* **Progression:** Weapon Tier 2 $\rightarrow$ Tier 3. Introduces explosive barrel chains and narrow rock canyon chokepoints.
* **Boss:** `Boss2_DreadChopper` (HP: 450). Hovers at low altitude, strafing side-to-side between $X = -3.5$ and $X = 3.5$.

### Phase 3: "Toxic Foundry"
* **Theme:** Heavy industrial refinery over a chemical abyss.
* **Palette:** Steel grating `#26292b`, Toxic Fog `#121f15` (Range: 45 - 120), Acid Green `#76ff03`.
* **Side Scenery Props:** Giant industrial cooling towers, overhead crisscrossing pipe networks, steam exhaust vents, circular chemical vats.
* **Track Length:** 280 units.
* **Environmental Hazard:** Toxic Puddles: Pools of green acid on road. Stepping on them dissolves 1 trooper every $0.2\text{ seconds}$.
* **Progression:** Weapon Tier 3 $\rightarrow$ Tier 4. Introduces rotating spike rollers and high-HP concrete barriers.
* **Boss:** `Boss3_SpiderMech` (HP: 800). Steps forward incrementally; periodically pounds the ground, sending shockwaves that must be dodged laterally.

### Phase 4: "Arctic Fortress"
* **Theme:** Snowbound high-security military compound.
* **Palette:** Blue Ice `#c8e6c9`, Blizzard Fog `#b0bec5` (Range: 40 - 110), Warning Amber `#ffb300`.
* **Side Scenery Props:** Wooden watchtowers with active searchlight cones, radar dish installations, snow-draped pine trees, sandbag bunkers.
* **Track Length:** 300 units.
* **Environmental Hazard:** Low Traction Ice: Lateral velocity deceleration damping reduced by $50\%$, introducing drift mechanics.
* **Progression:** Weapon Tier 4 $\rightarrow$ Tier 5. Heavy waves of counter-running `MeleeRunner` and `RiotShieldEnemy` squads.
* **Boss:** `Boss4_FrostBehemoth` (HP: 1400). Slow lumbering steps toward the squad; periodically raises a personal frost shield requiring sustained fire to shatter.

### Phase 5: "Cyber Void / Dread Core"
* **Theme:** Floating alien citadel suspended in an interstellar nexus.
* **Palette:** Carbon Hex `#08080c`, Void Fog `#1a002c` (Range: 50 - 160), Violet Neon `#d500f9`.
* **Side Scenery Props:** Levitating geometric obelisks, rotating holographic data rings, bottomless abyss with distant nebula skybox.
* **Track Length:** 350 units.
* **Environmental Hazard:** Split Pathways: The track splits into two separated 4.0-unit highways with a fatal void gap in the center ($X \in [-1.5, 1.5]$).
* **Progression:** Maximum intensity; constant weapon crate upgrades, high-speed dodging, dense minefields.
* **Boss:** `Boss5_DreadNexus` (HP: 2500). Multi-phase boss:
  * Phase A (100% - 66% HP): 4 orbiting shield nodes absorb all damage until individually destroyed.
  * Phase B (66% - 33% HP): Core emits twin laser sweeps sweeping left and right across the arena.
  * Phase C (33% - 0% HP): Core charges forward in an enrage state at double approach speed.

---

## 8. Phase Lifecycle & State Machine

The game flows through a deterministic finite state machine (FSM):

```text
[START_RUN] --> [GAUNTLET_RUN] --> [BOSS_ARENA_TRANSITION] --> [BOSS_BATTLE] --> [STAGE_VICTORY]
      │                                                              │
      └───────────────────────────> [DEFEAT] <───────────────────────┘
```

1. **`START_RUN`:**
   * Camera sweeps from front facing ($Z + 6$) to shoulder chase view ($Z - 12$).
   * Display 3-2-1 countdown overlay.
   * Squad Leader accelerates from $0$ to $V_z = 14.0\text{ units/s}$ over $1.5\text{ seconds}$.
2. **`GAUNTLET_RUN`:**
   * Active runner phase: player maneuvers laterally, collects units, shoots obstacles, avoids traps.
   * Failure Condition: If total squad count drops to $0$, transition immediately to `DEFEAT`.
3. **`BOSS_ARENA_TRANSITION`:**
   * Triggered when Squad Leader crosses the Finish Line gantry ($Z = Z_{phase\_end}$).
   * Forward velocity $V_z$ decelerates to $0.0$ over $1.0\text{ second}$.
   * Swarm members automatically re-align from the Fermat spiral into a tight, flat firing arc (semi-circle) facing $+Z$.
4. **`BOSS_BATTLE`:**
   * Camera pulls back to `(0, 18, -16)` to frame the entire arena and the massive Boss.
   * Boss health bar appears prominently at the top of the viewport.
   * All squad members enter maximum continuous auto-fire mode.
   * Boss advances forward at constant approach speed $V_{boss} = 2.0\text{ units/s}$.
   * **Victory Condition:** Boss HP reaches $0 \rightarrow$ Transition to `STAGE_VICTORY`.
   * **Defeat Condition:** Boss reaches squad position ($Z_{boss} \le Z_{squad} + 2.0$) $\rightarrow$ Boss crushes the squad $\rightarrow$ Transition to `DEFEAT`.
5. **`STAGE_VICTORY`:**
   * Boss mesh shatters into particle debris and bursts with 50 gold coins.
   * Troopers perform procedural victory hops (sinusoidal vertical jump + arms raised).
   * Score Calculation: $\text{FinalGold} = \text{RunCoins} + (\text{SurvivingTroopers} \times 10 \times \text{PhaseNumber})$.
   * UI displays Level Clear screen with "Claim & Upgrade" button leading to the Meta-Shop.
6. **`DEFEAT`:**
   * Slow-motion camera effect ($0.3\times$ speed for $1.5\text{ seconds}$).
   * Overlay modal displays:
     * Run Distance Traveled ($Z$ units).
     * Enemies/Obstacles Destroyed.
     * Gold Coins Collected.
     * "Retry Level" button and "Upgrade" button.

---

## 9. Procedural Audio Engine (Web Audio API)

No audio assets (`.mp3` or `.wav`) are loaded. The audio subsystem synthesizes all sound effects programmatically using `AudioContext`, oscillators, noise buffers, and gain envelope automation:

1. **Pistol Shot:** Square wave oscillator, frequency drop $600\text{Hz} \rightarrow 150\text{Hz}$ over $0.08\text{s}$, fast exponential decay.
2. **SMG Rapid Shot:** Triangle wave, $450\text{Hz} \rightarrow 200\text{Hz}$ over $0.04\text{s}$, low volume.
3. **Shotgun Blast:** White noise buffer passed through a low-pass filter ($1200\text{Hz}$) layered with a $120\text{Hz}$ sine thump, decaying over $0.25\text{s}$.
4. **Assault Rifle Laser:** Sawtooth wave, high-pass filter ($800\text{Hz}$), frequency chirp $1200\text{Hz} \rightarrow 400\text{Hz}$ over $0.09\text{s}$.
5. **Rocket Explosion:** Pink noise burst through resonant band-pass filter, combined with a deep $60\text{Hz}$ sine sub-bass rumble decaying over $0.8\text{s}$.
6. **Unit Recruited Chime:** Two-tone sine arpeggio ($523.25\text{Hz} \text{ [C5]} \rightarrow 659.25\text{Hz} \text{ [E5]}$), duration $0.15\text{s}$.
7. **Gate Multiplier Whoosh:** Frequency-swept bandpass white noise ($200\text{Hz} \rightarrow 1800\text{Hz} \rightarrow 300\text{Hz}$), duration $0.3\text{s}$.
8. **Coin Pickup:** Dual high sine harmonics ($1760\text{Hz} \text{ [A6]} \rightarrow 2637\text{Hz} \text{ [E7]}$), duration $0.08\text{s}$.
9. **Player Death Hit:** Distorted triangle wave ($150\text{Hz} \rightarrow 40\text{Hz}$) with crunchy overdrive clipping.
10. **Boss Defeat Fanfare:** Ascending 4-chord major triad arpeggio using warm filtered sawtooth leads.

---

## 10. Meta-Progression & Persistence (LocalStorage)

Player progression persists across sessions in browser storage under key `gun_swarm_3d_save`:

### 10.1 Data Schema (JSON)
```json
{
  "version": 1,
  "currency": {
    "gold": 0
  },
  "upgrades": {
    "startingSquadSize": {
      "level": 1,
      "baseValue": 1,
      "step": 1
    },
    "baseDamageMultiplier": {
      "level": 1,
      "baseValue": 1.0,
      "step": 0.15
    },
    "coinMultiplier": {
      "level": 1,
      "baseValue": 1.0,
      "step": 0.20
    }
  },
  "progression": {
    "highestUnlockedPhase": 1,
    "lastPlayedPhase": 1
  }
}
```

### 10.2 Upgrade Cost Formula
The cost to upgrade any attribute from level $L$ to $L + 1$ scales exponentially:

$$\text{Cost}(L) = \text{floor}\left(\text{BaseCost} \times (1.45)^{L - 1}\right)$$

* **`startingSquadSize`:** Base Cost = $100\text{ gold}$. Max Level = 15 (Start with up to 15 troopers).
* **`baseDamageMultiplier`:** Base Cost = $150\text{ gold}$. Max Level = 20 ($+300\%$ damage).
* **`coinMultiplier`:** Base Cost = $80\text{ gold}$. Max Level = 10 ($+200\%$ gold drop).
