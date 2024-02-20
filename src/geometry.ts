import * as THREE from 'three';

const points = [
  [68.5, 185.5],
  [1, 262.5],
  [270.9, 281.9],
  [345.5, 212.8],
  [178, 155.7],
  [240.3, 72.3],
  [153.4, 0.6],
  [52.6, 53.3],
  [68.5, 185.5]
];

const vertices = points.map(([x, z]) => new THREE.Vector3(x, 0, z));

export const path = new THREE.CatmullRomCurve3(vertices);

export const geometry = new THREE.TubeGeometry(path, 300, 4, 32, true);
