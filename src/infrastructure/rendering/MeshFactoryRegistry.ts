import type { Group, Mesh } from 'three';
import { Boss1_WarRigMeshFactory } from './factories/Boss1_WarRigMeshFactory';
import { Boss2_DreadChopperMeshFactory } from './factories/Boss2_DreadChopperMeshFactory';
import { Boss3_SpiderMechMeshFactory } from './factories/Boss3_SpiderMechMeshFactory';
import { Boss4_FrostBehemothMeshFactory } from './factories/Boss4_FrostBehemothMeshFactory';
import { Boss5_DreadNexusMeshFactory } from './factories/Boss5_DreadNexusMeshFactory';
import { CivilianRecruitMeshFactory } from './factories/CivilianRecruitMeshFactory';
import { ConcreteBlockMeshFactory } from './factories/ConcreteBlockMeshFactory';
import { ConveyorTileMeshFactory } from './factories/ConveyorTileMeshFactory';
import { DroneScoutMeshFactory } from './factories/DroneScoutMeshFactory';
import { ExplosiveBarrelMeshFactory } from './factories/ExplosiveBarrelMeshFactory';
import { GoldCoinMeshFactory } from './factories/GoldCoinMeshFactory';
import { HeavyTrooperMeshFactory } from './factories/HeavyTrooperMeshFactory';
import { KamikazeBomberMeshFactory } from './factories/KamikazeBomberMeshFactory';
import { MathGateMeshFactory } from './factories/MathGateMeshFactory';
import { MeleeRunnerMeshFactory } from './factories/MeleeRunnerMeshFactory';
import { ProjectileMeshFactory } from './factories/ProjectileMeshFactory';
import { RiotShieldEnemyMeshFactory } from './factories/RiotShieldEnemyMeshFactory';
import { RotatingSpikeRollerMeshFactory } from './factories/RotatingSpikeRollerMeshFactory';
import { ShieldOrbMeshFactory } from './factories/ShieldOrbMeshFactory';
import { SquadLeaderMeshFactory } from './factories/SquadLeaderMeshFactory';
import { StandardTrooperMeshFactory } from './factories/StandardTrooperMeshFactory';
import { StaticSniperMeshFactory } from './factories/StaticSniperMeshFactory';
import { SteelVaultMeshFactory } from './factories/SteelVaultMeshFactory';
import { SwingingBladeMeshFactory } from './factories/SwingingBladeMeshFactory';
import { ToxicBarrelMeshFactory } from './factories/ToxicBarrelMeshFactory';
import { WeaponUpgradeChestMeshFactory } from './factories/WeaponUpgradeChestMeshFactory';
import { WoodCrateMeshFactory } from './factories/WoodCrateMeshFactory';

export class MeshFactoryRegistry {
  public create(type: string): Group | Mesh {
    switch (type) {
      case 'SquadLeader':
        return new SquadLeaderMeshFactory().createMesh();
      case 'StandardTrooper':
        return new StandardTrooperMeshFactory().createMesh();
      case 'HeavyTrooper':
        return new HeavyTrooperMeshFactory().createMesh();
      case 'CivilianRecruit':
        return new CivilianRecruitMeshFactory().createMesh();
      case 'MeleeRunner':
        return new MeleeRunnerMeshFactory().createMesh();
      case 'RiotShieldEnemy':
        return new RiotShieldEnemyMeshFactory().createMesh();
      case 'KamikazeBomber':
        return new KamikazeBomberMeshFactory().createMesh();
      case 'StaticSniper':
        return new StaticSniperMeshFactory().createMesh();
      case 'DroneScout':
        return new DroneScoutMeshFactory().createMesh();
      case 'WoodCrate':
        return new WoodCrateMeshFactory().createMesh();
      case 'ConcreteBlock':
        return new ConcreteBlockMeshFactory().createMesh();
      case 'SteelVault':
        return new SteelVaultMeshFactory().createMesh();
      case 'ExplosiveBarrel':
        return new ExplosiveBarrelMeshFactory().createMesh();
      case 'ToxicBarrel':
        return new ToxicBarrelMeshFactory().createMesh();
      case 'RotatingSpikeRoller':
        return new RotatingSpikeRollerMeshFactory().createMesh();
      case 'SwingingBlade':
        return new SwingingBladeMeshFactory().createMesh();
      case 'ConveyorTile':
        return new ConveyorTileMeshFactory().createMesh();
      case 'MathGatePositive':
        return new MathGateMeshFactory(true).createMesh();
      case 'MathGateNegative':
        return new MathGateMeshFactory(false).createMesh();
      case 'WeaponUpgradeChest':
        return new WeaponUpgradeChestMeshFactory().createMesh();
      case 'ShieldOrb':
        return new ShieldOrbMeshFactory().createMesh();
      case 'GoldCoin':
        return new GoldCoinMeshFactory().createMesh();
      case 'projectile':
        return new ProjectileMeshFactory().createMesh();
      case 'Boss1_WarRig':
        return new Boss1_WarRigMeshFactory().createMesh();
      case 'Boss2_DreadChopper':
        return new Boss2_DreadChopperMeshFactory().createMesh();
      case 'Boss3_SpiderMech':
        return new Boss3_SpiderMechMeshFactory().createMesh();
      case 'Boss4_FrostBehemoth':
        return new Boss4_FrostBehemothMeshFactory().createMesh();
      case 'Boss5_DreadNexus':
        return new Boss5_DreadNexusMeshFactory().createMesh();
      default:
        throw new Error(`Unknown mesh type: ${type}`);
    }
  }
}
