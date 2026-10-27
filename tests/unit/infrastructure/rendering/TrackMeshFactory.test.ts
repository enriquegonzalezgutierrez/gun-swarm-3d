import { describe, expect, it } from 'vitest';
import { BoxGeometry, Group, Mesh } from 'three';
import { TrackMeshFactory } from '@infrastructure/rendering/TrackMeshFactory';

describe('TrackMeshFactory', () => {
  it('builds a road with two curbs', () => {
    const track = TrackMeshFactory.create(100);

    expect(track).toBeInstanceOf(Group);
    expect(track.children).toHaveLength(3);
    const road = track.children[0];
    expect(road).toBeInstanceOf(Mesh);
    expect((road as Mesh).geometry).toBeInstanceOf(BoxGeometry);
    expect(road?.position.z).toBe(50);
  });

  it('rejects invalid track lengths', () => {
    expect(() => TrackMeshFactory.create(0)).toThrow(RangeError);
    expect(() => TrackMeshFactory.create(-1)).toThrow(RangeError);
  });
});
