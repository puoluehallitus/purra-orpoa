import * as THREE from 'three';

import rocks from 'url:./rocks.jpg';
import ending from 'url:./ending.png';

const textureLoader = new THREE.TextureLoader();

const loadTexture = (textureURL: string): Promise<THREE.Texture> => {
  return new Promise((resolve) => {
    textureLoader.load(textureURL, (texture) => {
      resolve(texture);
    });
  });
};

const loadTextures = (): Promise<THREE.Texture[]> => Promise.all([
  loadTexture(rocks),
  loadTexture(ending),
]);

export default loadTextures;
