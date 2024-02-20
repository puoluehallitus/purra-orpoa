import * as THREE from 'three';

import loadFont from './loadFont';
import loadMusic from './loadMusic';
import loadTextures from './loadTextures';
import { geometry, path } from './geometry';
import getText from './getText';

const ASPECT_X = 16;
const ASPECT_Y = 9;
const PX_WIDTH = 1920;
const PX_HEIGHT = PX_WIDTH / ASPECT_X * ASPECT_Y;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xcccccc, 50, 200);
const light = new THREE.PointLight(0xff00ff, 5, 100);
scene.add(light);
const light2 = new THREE.PointLight(0x0000ff, 2, 50);
scene.add(light2);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.001, 100);
camera.position.z = 400;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(PX_WIDTH, PX_HEIGHT);
let percentage = 0;

function render() {
  const p1 = path.getPointAt(percentage % 1);
  const p2 = path.getPointAt((percentage + 0.03) % 1);
  const p3 = path.getPointAt((percentage + 0.01) % 1);
  camera.position.set(p1.x, p1.y, p1.z);
  camera.lookAt(p2);
  light.position.set(p2.x, p2.y, p2.z);
  light.power = Math.random() * 150;
  light2.position.set(p3.x, p3.y, p3.z);
  light2.power = percentage * 100;
  renderer.render(scene, camera);
  if (percentage < 0.970) {
    requestAnimationFrame(render);
  }
}

function resize() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  if (width / height >= ASPECT_X / ASPECT_Y) {
    width = window.innerHeight / ASPECT_Y * ASPECT_X;
    const margin = (window.innerWidth - width) / 2;
    renderer.domElement.style.marginLeft = `${margin}px`;
    renderer.domElement.style.marginRight = `${margin}px`;
  } else {
    height = window.innerWidth / ASPECT_X * ASPECT_Y;
    const margin = (window.innerHeight - height) / 2;
    renderer.domElement.style.marginTop = `${margin}px`;
    renderer.domElement.style.marginBottom = `${margin}px`;
  }
  renderer.domElement.style.width = `${width}px`;
  renderer.domElement.style.height = `${height}px`;
  camera.updateProjectionMatrix();
}

(async function() {
  document.body.appendChild(renderer.domElement);

  const { listener, sound } = await loadMusic();
  camera.add(listener);
  const textures = await loadTextures();

  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    emissive: 0x000000,
    specular: 0xffaa00,
    side: THREE.BackSide,
    bumpMap: textures[0],
    bumpScale: 10,
    shininess: 100,
    visible: true
  });
  const tube = new THREE.Mesh(geometry, material);
  scene.add(tube);

  renderer.domElement.addEventListener('click', () => {
    (window as any).electronAPI?.toggleFullscreen?.();
    resize();
    if (!sound.isPlaying) {
      sound.play( );
    }
  });

  document.onkeydown = (event) => {
    if (event.key === 'Escape') {
      (window as any).electronAPI?.exitFullscreen?.();
      resize();
    }
  };

  resize();
  requestAnimationFrame(render);
  window.addEventListener('resize', resize);

  const fonts = await loadFont();
  let text1 = getText(fonts[0], "Hello World", path.getPointAt(0.08 % 1), 4);
  scene.add(text1);
  text1.setRotationFromQuaternion(camera.quaternion);

  const ending = new THREE.SpriteMaterial({
    map: textures[1],
  });
  const sprite = new THREE.Sprite(ending);
  sprite.scale.set(5, 5*275/500, 1);
  const position = path.getPointAt(0.975);
  sprite.position.x = position.x;
  sprite.position.y = position.y;
  sprite.position.z = position.z;
  sprite.setRotationFromQuaternion(camera.quaternion);
  scene.add(sprite);

  const maxTime = sound.buffer?.duration ?? 100;

  const interval = setInterval(() => {
    const time = listener.context.currentTime;
    percentage = time / maxTime;

    if (time === 1000) {
      console.log('second');
    }
  }, 10);

  sound.onEnded = () => {
    clearInterval(interval);
  };
})();
