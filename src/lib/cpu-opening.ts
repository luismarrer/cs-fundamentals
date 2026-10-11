import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

type PartId = 'control' | 'alu' | 'registers' | 'cache' | 'clock' | 'buses';
type CameraAction = 'left' | 'right' | 'up' | 'down' | 'in' | 'out' | 'underside' | 'reset';

const blocks: { id: PartId; label: string; x: number; z: number; width: number; depth: number }[] = [
  { id: 'control', label: 'UC / CONTROL', x: -1.17, z: -1.03, width: 1.76, depth: 1.44 },
  { id: 'registers', label: 'REG / 8 BIT', x: -1.17, z: .48, width: 1.76, depth: .96 },
  { id: 'alu', label: 'ALU / + XOR', x: 1.16, z: .08, width: 1.58, depth: 1.86 },
  { id: 'clock', label: 'CLK / RELOJ', x: 1.16, z: -1.48, width: 1.58, depth: .7 },
  { id: 'cache', label: 'L1 / SRAM', x: 0, z: 1.62, width: 4.08, depth: .62 },
  { id: 'buses', label: 'BUS', x: .05, z: -.3, width: .38, depth: 2.92 },
];

/** The lesson remains in HTML; this scene only mirrors its selection and phase. */
export function mountCpuOpening(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-opening-canvas]');
  const workbench = root.closest<HTMLElement>('.cpu-workbench');
  const host = root.parentElement;
  if (!canvas || !workbench || !host) throw new Error('Missing CPU scene host');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(43, 1, .1, 70);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  let controls!: OrbitControls;
  try {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    controls = new OrbitControls(camera, canvas);
    controls.enablePan = false;
    controls.enableDamping = false;
    controls.autoRotate = false;
    controls.minPolarAngle = .2;
    controls.maxPolarAngle = Math.PI - .2;
    controls.minDistance = 8;
    controls.maxDistance = 23;
    controls.rotateSpeed = .55;
    controls.zoomSpeed = .7;
    controls.target.set(0, .82, -.55);
    controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
  } catch (error) {
    // These resources exist before the main scene cleanup boundary is established.
    controls?.dispose();
    renderer.dispose();
    throw error;
  }

  const abort = new AbortController();
  const cleanupTasks: (() => void)[] = [];
  const listenerOptions = { signal: abort.signal };
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const instancedMeshes = new Set<THREE.InstancedMesh>();
  const colors = new Map<THREE.Material, string>();
  const selectedMaterials = new Map<PartId, THREE.MeshPhysicalMaterial>();
  const outlines = new Map<PartId, THREE.LineSegments>();
  const pickTargets: THREE.Mesh[] = [];
  const phaseLines = new Map<string, THREE.Line>();
  const phaseMarkers = new Map<string, THREE.Group>();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const darkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const fallback = host.querySelector<SVGSVGElement>('.cpu-map');
  const fallbackParts = [...host.querySelectorAll<SVGElement>('[data-cpu-part]')];
  const toggle = root.querySelector<HTMLButtonElement>('[data-opening-toggle]')!;
  const tools = root.querySelector<HTMLElement>('[data-opening-tools]')!;
  const status = root.querySelector<HTMLElement>('[data-opening-status]')!;
  const toggleLabel = root.querySelector<HTMLElement>('[data-opening-toggle-label]')!;
  const instructions = root.querySelector<HTMLElement>('.opening-instructions')!;
  let selected: PartId = 'control';
  let disposed = false;
  let lost = false;
  let inViewport = true;
  let frame = 0;
  let lastTime = 0;
  let width = 0;
  let height = 0;
  let lidProgress = 0;
  let openTarget = false;

  function releaseResources() {
    disposed = true;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    abort.abort();
    cleanupTasks.forEach((cleanup) => cleanup());
    controls.dispose();
    instancedMeshes.forEach((value) => value.dispose());
    geometries.forEach((value) => value.dispose());
    materials.forEach((value) => value.dispose());
    textures.forEach((value) => value.dispose());
    renderer.dispose();
    scene.clear();
  }

  function geometry<T extends THREE.BufferGeometry>(value: T): T {
    geometries.add(value);
    return value;
  }

  function material<T extends THREE.Material>(value: T, cssVariable?: string): T {
    materials.add(value);
    if (cssVariable) colors.set(value, cssVariable);
    return value;
  }

  function physical(color: THREE.ColorRepresentation, cssVariable?: string, metalness = .25, roughness = .48) {
    return material(new THREE.MeshPhysicalMaterial({ color, metalness, roughness }), cssVariable);
  }

  function box(parent: THREE.Object3D, size: [number, number, number], position: [number, number, number], surface: THREE.Material, radius = .05) {
    const mesh = new THREE.Mesh(geometry(new RoundedBoxGeometry(...size, 2, radius)), surface);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }

  function line(parent: THREE.Object3D, points: [number, number, number][], surface: THREE.LineBasicMaterial) {
    const mesh = new THREE.Line(geometry(new THREE.BufferGeometry().setFromPoints(points.map((point) => new THREE.Vector3(...point)))), surface);
    parent.add(mesh);
    return mesh;
  }

  function label(parent: THREE.Object3D, title: string, subtitle: string, labelWidth: number, labelDepth: number, position: [number, number, number], ink = '#e8edea') {
    const image = document.createElement('canvas');
    image.width = 768;
    image.height = 256;
    const context = image.getContext('2d');
    if (!context) return;
    context.fillStyle = ink;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = '600 56px "IBM Plex Mono", monospace';
    context.fillText(title, 384, subtitle ? 90 : 128);
    if (subtitle) {
      context.font = '400 29px "IBM Plex Mono", monospace';
      context.fillText(subtitle, 384, 158);
    }
    const texture = new THREE.CanvasTexture(image);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.add(texture);
    const surface = material(new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }));
    const mesh = new THREE.Mesh(geometry(new THREE.PlaneGeometry(labelWidth, labelDepth)), surface);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }

  try {
    // A grounded package on a lab bench, not a literal commercial die floorplan.
    scene.add(new THREE.HemisphereLight(0xf7fffb, 0x374e47, 2.7));
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.6);
    keyLight.position.set(-4, 9, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xf4bd83, 2);
    rimLight.position.set(6, 3, -5);
    scene.add(rimLight);
    const undersideFill = new THREE.DirectionalLight(0xf4bd83, 1.35);
    undersideFill.position.set(-2, -6, 4);
    scene.add(undersideFill);

    const ground = new THREE.Group();
    scene.add(ground);
    box(ground, [19, .08, 17], [0, -.43, -1], physical('#e8edea', '--bg', .02, .95), .02);
    const gridSurface = material(new THREE.LineBasicMaterial({ color: '#aebbb4', transparent: true, opacity: .2 }), '--border');
    for (let coordinate = -8; coordinate <= 8; coordinate += .75) {
      line(ground, [[coordinate, -.384, -9], [coordinate, -.384, 7]], gridSurface);
      line(ground, [[-9, -.384, coordinate], [9, -.384, coordinate]], gridSurface);
    }

    // A cheap, static contact shadow avoids a continuously updated shadow map.
    const shadowImage = document.createElement('canvas');
    shadowImage.width = shadowImage.height = 128;
    const shadowContext = shadowImage.getContext('2d');
    if (shadowContext) {
      const gradient = shadowContext.createRadialGradient(64, 64, 16, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(12,27,23,.36)');
      gradient.addColorStop(.58, 'rgba(12,27,23,.21)');
      gradient.addColorStop(1, 'rgba(12,27,23,0)');
      shadowContext.fillStyle = gradient;
      shadowContext.fillRect(0, 0, 128, 128);
      const shadowTexture = new THREE.CanvasTexture(shadowImage);
      textures.add(shadowTexture);
      const shadow = new THREE.Mesh(geometry(new THREE.PlaneGeometry(9, 8)), material(new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false })));
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -.377;
      ground.add(shadow);
    }

    const chip = new THREE.Group();
    scene.add(chip);
    const substrate = physical('#28574f', undefined, .25, .52);
    const graphite = physical('#24302e', undefined, .36, .42);
    const copper = physical('#bd8651', undefined, .64, .36);
    const silver = physical('#cbd3ce', '--package', .62, .28);
    box(chip, [5.9, .3, 5.9], [0, -.14, 0], substrate, .12);
    box(chip, [5.55, .16, 5.55], [0, .075, 0], graphite, .09);
    box(chip, [4.65, .12, 4.65], [0, .225, 0], physical('#223b3a', undefined, .68, .31), .04);
    box(chip, [4.73, .035, 4.73], [0, .155, 0], copper, .03);

    const contactGeometry = geometry(new THREE.BoxGeometry(.16, .08, .22));
    const contacts = new THREE.InstancedMesh(contactGeometry, copper, 88);
    instancedMeshes.add(contacts);
    geometries.add(contactGeometry);
    const transform = new THREE.Object3D();
    let contactIndex = 0;
    for (let side = 0; side < 4; side += 1) {
      for (let index = 0; index < 22; index += 1) {
        const offset = -2.63 + index * .25;
        transform.position.set(side % 2 === 0 ? offset : (side === 1 ? 2.94 : -2.94), -.07, side % 2 === 0 ? (side === 0 ? -2.94 : 2.94) : offset);
        transform.rotation.y = side % 2 === 0 ? 0 : Math.PI / 2;
        transform.updateMatrix();
        contacts.setMatrixAt(contactIndex++, transform.matrix);
      }
    }
    chip.add(contacts);

    // This is a teaching model: the array reads as a processor contact field, not a commercial pinout.
    const undersideContactGeometry = geometry(new THREE.BoxGeometry(.18, .06, .18));
    const undersideContacts = new THREE.InstancedMesh(undersideContactGeometry, copper, 308);
    instancedMeshes.add(undersideContacts);
    let undersideContactIndex = 0;
    for (let row = 0; row < 18; row += 1) {
      for (let column = 0; column < 18; column += 1) {
        const cornerCutout = (row < 2 || row > 15) && (column < 2 || column > 15);
        if (cornerCutout) continue;
        transform.position.set(-2.32 + column * .273, -.32, -2.32 + row * .273);
        transform.rotation.set(0, 0, 0);
        transform.updateMatrix();
        undersideContacts.setMatrixAt(undersideContactIndex++, transform.matrix);
      }
    }
    undersideContacts.instanceMatrix.needsUpdate = true;
    chip.add(undersideContacts);

    const gasket = physical('#17201f', undefined, .05, .8);
    for (const z of [-2.54, 2.54]) box(chip, [5.25, .15, .2], [0, .225, z], gasket, .04);
    for (const x of [-2.54, 2.54]) box(chip, [.2, .15, 4.9], [x, .225, 0], gasket, .04);

    const fineCircuit = material(new THREE.LineBasicMaterial({ color: '#d4ebe7', transparent: true, opacity: .24 }));
    const cellGeometry = geometry(new THREE.BoxGeometry(.07, .008, .11));
    for (const block of blocks) {
      const surface = physical('#188c84', `--part-${block.id}`, .38, .4);
      selectedMaterials.set(block.id, surface);
      const hit = box(chip, [block.width, .1, block.depth], [block.x, .36, block.z], surface, .025);
      hit.userData.part = block.id;
      pickTargets.push(hit);

      const border = new THREE.LineSegments(geometry(new THREE.EdgesGeometry(hit.geometry)), material(new THREE.LineBasicMaterial({ color: '#eda73e' }), '--signal'));
      border.position.copy(hit.position);
      border.scale.set(1.025, 1.05, 1.025);
      chip.add(border);
      outlines.set(block.id, border);

      if (block.id === 'buses') {
        const busLabel = label(chip, 'BUS', '', 1.35, .3, [block.x, .417, block.z]);
        if (busLabel) busLabel.rotation.z = Math.PI / 2;
      } else {
        label(chip, block.label, '', block.width * .85, Math.min(block.depth * .52, .47), [block.x, .417, block.z - block.depth * .08]);
        const count = Math.floor(block.width / .16);
        const cells = new THREE.InstancedMesh(cellGeometry, copper, count);
        instancedMeshes.add(cells);
        for (let index = 0; index < count; index += 1) {
          transform.position.set(block.x - block.width * .4 + index * .16, .417, block.z + block.depth * .27);
          transform.rotation.set(0, 0, 0);
          transform.updateMatrix();
          cells.setMatrixAt(index, transform.matrix);
        }
        chip.add(cells);
      }
      for (let offset = 0; offset < 3; offset += 1) {
        line(chip, [[block.x - block.width * .35, .414, block.z - block.depth * .3 + offset * .035], [block.x + block.width * .35, .414, block.z - block.depth * .3 + offset * .035]], fineCircuit);
      }
    }

    label(chip, 'SILICIO / FUNCIONES LÓGICAS', '', 2.5, .18, [0, .292, -2.17], '#9ba9a5');
    const lid = new THREE.Group();
    chip.add(lid);
    box(lid, [5.42, .22, 5.42], [0, 0, 0], silver, .11);
    box(lid, [4.94, .055, 4.94], [0, .135, 0], silver, .08);
    label(lid, 'CPU–08', 'ARQUITECTURA / MODELO DIDÁCTICO', 3.7, 1.23, [0, .168, -.1], '#344d46');
    const etching = material(new THREE.LineBasicMaterial({ color: '#71857a', transparent: true, opacity: .17 }));
    for (let index = 0; index < 35; index += 1) {
      const z = -2.3 + index * .13;
      line(lid, [[-2.28, .167, z], [2.28, .167, z]], etching);
    }
    const orientationDot = new THREE.Mesh(geometry(new THREE.CircleGeometry(.09, 16)), material(new THREE.MeshBasicMaterial({ color: '#344d46' })));
    orientationDot.rotation.x = -Math.PI / 2;
    orientationDot.position.set(-2.1, .173, 2.1);
    lid.add(orientationDot);

    box(scene, [.74, .24, 1.3], [3.82, -.24, .4], graphite, .04);
    label(scene, 'RAM', '', .63, .34, [3.82, -.111, .4]);
    const signalSurface = material(new THREE.LineBasicMaterial({ color: '#eda73e', linewidth: 2 }), '--signal');
    const markerSurface = physical('#eda73e', '--signal', .05, .3);
    const routes: Record<string, [number, number, number][]> = {
      fetch: [[3.5, .46, .4], [2.5, .46, .4], [2.5, .46, 1.22], [.05, .46, 1.22], [.05, .46, .48], [-1.17, .46, .48]],
      decode: [[-1.17, .46, -1.03], [.05, .46, -1.03], [.05, .46, -.3], [1.16, .46, -.3]],
      execute: [[-1.17, .46, .48], [.05, .46, .48], [1.16, .46, .48], [1.16, .46, 1.19], [.05, .46, 1.19], [-1.17, .46, .48]],
    };
    const markerGeometry = geometry(new THREE.SphereGeometry(.055, 12, 8));
    for (const [phase, points] of Object.entries(routes)) {
      phaseLines.set(phase, line(chip, points, signalSurface));
      const markers = new THREE.Group();
      for (const point of [points[0], points[points.length - 1]]) {
        const marker = new THREE.Mesh(markerGeometry, markerSurface);
        marker.position.set(...point);
        markers.add(marker);
      }
      chip.add(markers);
      phaseMarkers.set(phase, markers);
    }

    function setFallback(visible: boolean, message?: string) {
      root.dataset.renderer = visible ? 'unavailable' : 'ready';
      host.dataset.renderer = visible ? 'fallback' : 'ready';
      tools.hidden = visible;
      fallback?.setAttribute('aria-hidden', String(!visible));
      fallbackParts.forEach((part) => part.setAttribute('tabindex', visible ? '0' : '-1'));
      canvas.tabIndex = visible ? -1 : 0;
      canvas.setAttribute('aria-hidden', String(visible));
      if (visible && root.contains(document.activeElement)) {
        workbench!.querySelector<HTMLButtonElement>('.part-select[aria-pressed="true"]')?.focus({ preventScroll: true });
      }
      if (message) status.textContent = message;
      else status.textContent = openTarget ? 'Silicio expuesto · selecciona un bloque' : 'Encapsulado cerrado';
    }

    function applyLidPose() {
      const lift = THREE.MathUtils.smoothstep(lidProgress, 0, .55);
      const removal = THREE.MathUtils.smoothstep(lidProgress, .25, 1);
      lid.position.set(0, .64 + lift * 1.05 + removal * .91, -removal * 4.15);
      lid.rotation.x = removal * 1.08;
      root.dataset.lid = lidProgress === 0 ? 'closed' : lidProgress === 1 ? 'open' : openTarget ? 'opening' : 'closing';
      if (root.dataset.renderer === 'ready') {
        const message = lidProgress === 0 ? 'Encapsulado cerrado' : lidProgress === 1 ? 'Silicio expuesto · selecciona un bloque' : openTarget ? 'Abriendo CPU…' : 'Cerrando CPU…';
        if (status.textContent !== message) status.textContent = message;
      }
    }

    function canRender() {
      return !disposed && !lost && inViewport && !document.hidden;
    }

    function requestRender() {
      if (!frame && canRender()) frame = window.requestAnimationFrame(render);
    }

    function render(time: number) {
      frame = 0;
      if (!canRender()) return;
      const nextWidth = canvas.clientWidth;
      const nextHeight = canvas.clientHeight;
      if (nextWidth <= 0 || nextHeight <= 0) return;
      if (width !== nextWidth || height !== nextHeight) {
        width = nextWidth;
        height = nextHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      const target = openTarget ? 1 : 0;
      if (lidProgress !== target) {
        const delta = lastTime ? Math.min(time - lastTime, 50) : 16;
        lidProgress = reducedMotion.matches ? target : THREE.MathUtils.clamp(lidProgress + (openTarget ? 1 : -1) * delta / 900, 0, 1);
        applyLidPose();
      }
      lastTime = time;
      try {
        renderer.render(scene, camera);
        if (renderer.getContext().isContextLost()) return;
        if (root.dataset.renderer !== 'ready') setFallback(false);
      } catch {
        lost = true;
        setFallback(true, 'Vista 2D · la lección sigue disponible');
        return;
      }
      if (lidProgress !== target) requestRender();
      else lastTime = 0;
    }

    function pause() {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      lidProgress = openTarget ? 1 : 0;
      applyLidPose();
    }

    function setOpen(open: boolean) {
      openTarget = open;
      toggle.setAttribute('aria-pressed', String(open));
      toggleLabel.textContent = open ? 'Cerrar CPU' : 'Abrir CPU';
      instructions.textContent = open ? 'Pulsa un bloque · arrastra para girar · + / − para zoom' : 'Arrastra para girar · rueda o dos dedos para acercar';
      if (reducedMotion.matches || !canRender()) lidProgress = open ? 1 : 0;
      applyLidPose();
      requestRender();
    }

    function updateSelection() {
      const active = workbench!.querySelector<HTMLButtonElement>('.part-select[aria-pressed="true"]');
      const id = active?.dataset.part as PartId | undefined;
      if (id && selectedMaterials.has(id)) selected = id;
      selectedMaterials.forEach((surface, part) => {
        surface.emissive.copy(surface.color);
        surface.emissiveIntensity = part === selected ? .24 : .025;
        outlines.get(part)!.visible = part === selected;
      });
      const phase = workbench!.dataset.phase ?? 'idle';
      phaseLines.forEach((route, id) => { route.visible = id === phase; });
      phaseMarkers.forEach((markers, id) => { markers.visible = id === phase; });
      if (root.dataset.selected !== selected) root.dataset.selected = selected;
      if (root.dataset.phase !== phase) root.dataset.phase = phase;
      requestRender();
    }

    function updateTheme() {
      const style = window.getComputedStyle(root);
      colors.forEach((variable, surface) => {
        const value = style.getPropertyValue(variable).trim();
        if (value && 'color' in surface) (surface as THREE.MeshBasicMaterial).color.setStyle(value);
      });
      updateSelection();
    }

    function isUndersideView() {
      return camera.position.y < controls.target.y;
    }

    function updateGroundVisibility() {
      ground.visible = !isUndersideView();
    }

    function resetCamera() {
      const aspect = canvas.clientWidth / Math.max(canvas.clientHeight, 1);
      const distance = aspect < .95 ? 13.5 : 11.8;
      camera.position.copy(new THREE.Vector3(.46, .74, .7).normalize().multiplyScalar(distance).add(controls.target));
      controls.update();
      updateGroundVisibility();
      status.textContent = openTarget ? 'Silicio expuesto · selecciona un bloque' : 'Encapsulado cerrado';
      requestRender();
    }

    function showUnderside() {
      const aspect = canvas.clientWidth / Math.max(canvas.clientHeight, 1);
      const distance = aspect < .95 ? 13.5 : 11.8;
      camera.position.copy(new THREE.Vector3(.46, -.74, .7).normalize().multiplyScalar(distance).add(controls.target));
      controls.update();
      updateGroundVisibility();
      status.textContent = 'Cara inferior · contactos esquemáticos';
      requestRender();
    }

    function changeCamera(action: CameraAction) {
      if (action === 'reset') return resetCamera();
      if (action === 'underside') return showUnderside();
      const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
      if (action === 'left') spherical.theta -= .19;
      if (action === 'right') spherical.theta += .19;
      if (action === 'up') spherical.phi -= .13;
      if (action === 'down') spherical.phi += .13;
      if (action === 'in') spherical.radius *= .88;
      if (action === 'out') spherical.radius /= .88;
      spherical.phi = THREE.MathUtils.clamp(spherical.phi, controls.minPolarAngle, controls.maxPolarAngle);
      spherical.radius = THREE.MathUtils.clamp(spherical.radius, controls.minDistance, controls.maxDistance);
      camera.position.setFromSpherical(spherical).add(controls.target);
      controls.update();
      requestRender();
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const pointers = new Set<number>();
    let tap: { id: number; x: number; y: number; moved: boolean } | undefined;
    canvas.addEventListener('pointerdown', (event) => {
      pointers.add(event.pointerId);
      if (pointers.size === 1 && event.button === 0) tap = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
      else tap = undefined;
    }, listenerOptions);
    canvas.addEventListener('pointermove', (event) => {
      if (tap?.id === event.pointerId && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > 6) tap.moved = true;
    }, listenerOptions);
    canvas.addEventListener('pointerup', (event) => {
      const candidate = tap;
      pointers.delete(event.pointerId);
      tap = undefined;
      // Opacity/visibility are not pick gates: no block can be picked through a closed lid.
      if (!candidate || candidate.id !== event.pointerId || candidate.moved || Math.hypot(event.clientX - candidate.x, event.clientY - candidate.y) > 6 || pointers.size || lidProgress < .999 || !openTarget || lost || isUndersideView()) return;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(pickTargets, false)[0];
      const id = hit?.object.userData.part as PartId | undefined;
      if (id) workbench!.querySelector<HTMLButtonElement>(`.part-select[data-part="${id}"]`)?.click();
    }, listenerOptions);
    canvas.addEventListener('pointercancel', (event) => { pointers.delete(event.pointerId); tap = undefined; }, listenerOptions);

    const keyActions: Record<string, CameraAction> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', '+': 'in', '=': 'in', '-': 'out', Home: 'reset' };
    canvas.addEventListener('keydown', (event) => {
      const action = keyActions[event.key];
      if (!action || event.altKey || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      changeCamera(action);
    }, listenerOptions);
    root.querySelectorAll<HTMLButtonElement>('[data-camera]').forEach((button) => {
      button.addEventListener('click', () => changeCamera(button.dataset.camera as CameraAction), listenerOptions);
    });
    toggle.addEventListener('click', () => setOpen(!openTarget), listenerOptions);
    workbench.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest('.part-select, [data-cpu-part], [data-cycle-phase], #cycle-step, #cycle-auto')) setOpen(true);
    }, listenerOptions);

    const selectionObserver = new MutationObserver((records) => {
      if (records.some(({ target }) => target === workbench || (target instanceof Element && target.matches('.part-select')))) updateSelection();
    });
    cleanupTasks.push(() => selectionObserver.disconnect());
    selectionObserver.observe(workbench, { attributes: true, attributeFilter: ['aria-pressed', 'data-phase'], subtree: true });
    const resizeObserver = new ResizeObserver(requestRender);
    cleanupTasks.push(() => resizeObserver.disconnect());
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      if (inViewport) requestRender();
      else pause();
    }, { rootMargin: '100px' });
    cleanupTasks.push(() => intersectionObserver.disconnect());
    intersectionObserver.observe(root);
    const themeObserver = new MutationObserver(updateTheme);
    cleanupTasks.push(() => themeObserver.disconnect());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] });
    darkScheme.addEventListener('change', updateTheme, listenerOptions);
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) {
        lidProgress = openTarget ? 1 : 0;
        applyLidPose();
      }
      requestRender();
    }, listenerOptions);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pause();
      else requestRender();
    }, listenerOptions);
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      lost = true;
      pause();
      setFallback(true, 'Vista 2D · la lección sigue disponible');
    }, listenerOptions);
    canvas.addEventListener('webglcontextrestored', () => {
      lost = false;
      updateTheme();
      requestRender();
    }, listenerOptions);
    const handleControlsChange = () => {
      updateGroundVisibility();
      requestRender();
    };
    controls.addEventListener('change', handleControlsChange);
    cleanupTasks.push(() => controls.removeEventListener('change', handleControlsChange));

    updateTheme();
    applyLidPose();
    resetCamera();

    return {
      dispose() {
        if (disposed) return;
        disposed = true;
        pause();
        releaseResources();
        setFallback(true);
        root.dataset.renderer = 'pending';
        delete root.dataset.lid;
        delete host.dataset.renderer;
      },
    };
  } catch (error) {
    releaseResources();
    throw error;
  }
}
