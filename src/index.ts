import * as THREE from 'three';

import loadFont from './loadFont';
import loadMusic from './loadMusic';
import loadTextures from './loadTextures';
import { geometry, path } from './geometry';
import getText from './getText';

const ASPECT_X = 16;
const ASPECT_Y = 9;
const PX_WIDTH = 3840;
const PX_HEIGHT = PX_WIDTH / ASPECT_X * ASPECT_Y;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xcccccc, 50, 200);
const light = new THREE.PointLight(0xff00ff, 5, 100);
scene.add(light);
const light2 = new THREE.PointLight(0x0000ff, 2, 50);
light2.power = 100;
scene.add(light2);
const camera = new THREE.PerspectiveCamera(45, ASPECT_X / ASPECT_Y, 0.001, 100);
camera.position.z = 400;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(PX_WIDTH, PX_HEIGHT);
let percentage = 0;

function render() {
  if (percentage < 0.97) {
    const p1 = path.getPointAt(percentage % 1);
    const p2 = path.getPointAt((percentage + 0.03) % 1);
    const p3 = path.getPointAt((percentage + 0.01) % 1);
    camera.position.set(p1.x, p1.y, p1.z);
    camera.lookAt(p2);
    light.position.set(p2.x, p2.y, p2.z);
    light2.position.set(p3.x, p3.y, p3.z);
  }

  if (percentage < 0.9) {
    light.power = Math.random() * 150;
  } else {
    light.power -= 0.25;
    light2.power -= 0.25;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function resize() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  if (width / height > ASPECT_X / ASPECT_Y) {
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

const fired: Record<string, boolean> = {};
function fireOnce(id: string, callback: Function) {
  if (!fired[id]) {
    fired[id] = true;
    callback();
  }
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
    bumpScale: 250,
    shininess: 50,
    visible: true
  });
  const tube = new THREE.Mesh(geometry, material);
  scene.add(tube);

  renderer.domElement.addEventListener('click', () => {
    (window as any).electronAPI?.toggleFullscreen?.();
    resize();
    if (!sound.isPlaying) {
      sound.play();
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

  const text1 = getText(fonts[0], "Puoluehallitus\n       presents...", path.getPointAt(0.08 % 1), { x: 4, y: -1.5 });

  const text2 = getText(fonts[0], "PURRA\n    ORPOA", path.getPointAt(0.20 % 1), { z: -1 });
  scene.add(text2);

  const text3 = getText(fonts[0], "Music by:\n    Puoluehallitus\n\nCode by: Spot", path.getPointAt(0.30 % 1), { z: -3 });
  scene.add(text3);

  const text4 = getText(fonts[0], "Greetings\n      to...", path.getPointAt(0.50 % 1), { x: -4 });
  scene.add(text4);
  const text5 = getText(fonts[0], "Jml", path.getPointAt(0.51 % 1), { x: -4 });
  scene.add(text5);
  const text6 = getText(fonts[0], "Accession", path.getPointAt(0.52 % 1), { x: -4 });
  scene.add(text6);
  const text7 = getText(fonts[0], "Byterapers", path.getPointAt(0.53 % 1), { x: -4 });
  scene.add(text7);
  const text8 = getText(fonts[0], "...especially\n     Nyyrikki", path.getPointAt(0.54 % 1), { x: -4 });
  scene.add(text8);
  const text9 = getText(fonts[0], "Trsac", path.getPointAt(0.55 % 1), { x: -4 });
  scene.add(text9);

  const ending = new THREE.SpriteMaterial({
    map: textures[1],
  });
  const sprite = new THREE.Sprite(ending);
  sprite.scale.set(5, 5*275/500, 1);
  const position = path.getPointAt(0.955);
  sprite.position.x = position.x;
  sprite.position.y = position.y;
  sprite.position.z = position.z;
  sprite.setRotationFromQuaternion(camera.quaternion);

  const maxTime = sound.buffer?.duration ?? 100;

  const interval = setInterval(() => {
    const time = listener.context.currentTime;
    percentage = time / maxTime;
    const roundedPercentage = Math.round(percentage * 1000) / 10;

    if (roundedPercentage === 0.1) {
      fireOnce('text1', () => {
        scene.add(text1);
        text1.setRotationFromQuaternion(camera.quaternion);
      });
    }

    if (roundedPercentage === 11.5) {
      fireOnce('text2_3', () => {
        text2.setRotationFromQuaternion(camera.quaternion);
        text3.setRotationFromQuaternion(camera.quaternion);
      });
    }

    if (roundedPercentage === 44) {
      fireOnce('creditsTexts', () => {
        text4.setRotationFromQuaternion(camera.quaternion);
        text5.setRotationFromQuaternion(camera.quaternion);
        text6.setRotationFromQuaternion(camera.quaternion);
        text7.setRotationFromQuaternion(camera.quaternion);
        text8.setRotationFromQuaternion(camera.quaternion);
        text9.setRotationFromQuaternion(camera.quaternion);
      });
    }

    if (roundedPercentage === 88) {
      fireOnce('endCredits', () => {
        const p = path.getPointAt((percentage + 0.024) % 1)
        sprite.position.set(p.x, p.y, p.z);
        scene.add(sprite);
      });
    }

    if (percentage > 0.9 && percentage <= 0.97) {
      const p = path.getPointAt((percentage + 0.004) % 1)
      sprite.position.set(p.x, p.y, p.z);
    }
  }, 10);

  sound.onEnded = () => {
    clearInterval(interval);
  };
})();
