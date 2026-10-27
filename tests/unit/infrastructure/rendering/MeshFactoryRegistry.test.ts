import { describe, expect, it } from 'vitest';
import { Mesh } from 'three';
import { MeshFactoryRegistry } from '@infrastructure/rendering/MeshFactoryRegistry';

const MESH_TYPES = [
  'SquadLeader',
  'StandardTrooper',
  'HeavyTrooper',
  'CivilianRecruit',
  'MeleeRunner',
  'RiotShieldEnemy',
  'KamikazeBomber',
  'StaticSniper',
  'DroneScout',
  'WoodCrate',
  'ConcreteBlock',
  'SteelVault',
  'ExplosiveBarrel',
  'ToxicBarrel',
  'RotatingSpikeRoller',
  'SwingingBlade',
  'ConveyorTile',
  'MathGatePositive',
  'MathGateNegative',
  'WeaponUpgradeChest',
  'ShieldOrb',
  'GoldCoin',
  'Boss1_WarRig',
  'Boss2_DreadChopper',
  'Boss3_SpiderMech',
  'Boss4_FrostBehemoth',
  'Boss5_DreadNexus',
  'projectile',
] as const;

describe('MeshFactoryRegistry', () => {
  it.each(MESH_TYPES)('builds the %s entity procedurally', (type) => {
    const mesh = new MeshFactoryRegistry().create(type);
    let meshCount = 0;
    mesh.traverse((object) => {
      if (object instanceof Mesh) {
        meshCount += 1;
      }
    });

    expect(mesh.children.length).toBeGreaterThan(0);
    expect(meshCount).toBeGreaterThan(0);
  });

  it('rejects unknown mesh types', () => {
    expect(() => new MeshFactoryRegistry().create('UnknownEntity')).toThrow(Error);
  });
});
