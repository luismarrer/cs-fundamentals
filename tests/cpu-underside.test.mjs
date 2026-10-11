import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import * as THREE from 'three';

const sourcePath = new URL('../src/lib/cpu-opening.ts', import.meta.url);
const componentPath = new URL('../src/components/CpuOpening.astro', import.meta.url);

function functionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} should be present in the CPU scene`);

  const bodyStart = source.indexOf('{', start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}' && --depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`Could not isolate ${name}`);
}

function currentCameraAction(source, camera, controls) {
  const actionSource = functionSource(source, 'changeCamera').replace('action: CameraAction', 'action');
  return new Function('THREE', 'camera', 'controls', 'resetCamera', 'requestRender', `${actionSource}; return changeCamera;`)(
    THREE,
    camera,
    controls,
    () => {},
    () => {},
  );
}

function configuredMaxPolarAngle(source) {
  const match = source.match(/controls\.maxPolarAngle = ([^;]+);/);
  assert.ok(match, 'the CPU scene should configure a maximum orbit angle');
  return new Function(`return (${match[1]});`)();
}

test('the down camera action can orbit into the lower hemisphere', async () => {
  const source = await readFile(sourcePath, 'utf8');
  const target = new THREE.Vector3(0, .82, -.55);
  const camera = { position: new THREE.Vector3().setFromSpherical(new THREE.Spherical(12, 1.12, .3)).add(target) };
  const controls = { target, minPolarAngle: .2, maxPolarAngle: configuredMaxPolarAngle(source), minDistance: 8, maxDistance: 23, update() {} };

  const changeCamera = currentCameraAction(source, camera, controls);
  for (let step = 0; step < 4; step += 1) changeCamera('down');

  const phi = new THREE.Spherical().setFromVector3(camera.position.clone().sub(target)).phi;
  assert.ok(phi > Math.PI / 2, `expected lower-hemisphere orbit, received phi ${phi}`);
});

test('the underside keeps its contact field visible without a bench or top-side pick-through', async () => {
  const [sceneSource, componentSource] = await Promise.all([
    readFile(sourcePath, 'utf8'),
    readFile(componentPath, 'utf8'),
  ]);

  assert.match(sceneSource, /const ground = new THREE\.Group\(\);/);
  assert.match(sceneSource, /ground\.visible = !isUndersideView\(\);/);
  assert.match(sceneSource, /new THREE\.InstancedMesh\(undersideContactGeometry, copper, 308\)/);
  assert.match(sceneSource, /\|\| isUndersideView\(\)\) return;/);
  assert.match(sceneSource, /function showUnderside\(\)/);
  assert.match(sceneSource, /status\.textContent = openTarget \? 'Silicio expuesto · selecciona un bloque' : 'Encapsulado cerrado';/);
  assert.match(componentSource, /data-camera="underside">Ver cara inferior/);
});
