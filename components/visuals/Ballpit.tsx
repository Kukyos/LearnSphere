// @ts-nocheck
import React, { useRef, useEffect } from 'react';
import {
  Clock,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  SRGBColorSpace,
  MathUtils,
  Vector2,
  Vector3,
  MeshPhysicalMaterial,
  ShaderChunk,
  Color,
  Object3D,
  InstancedMesh,
  PMREMGenerator,
  SphereGeometry,
  AmbientLight,
  PointLight,
  ACESFilmicToneMapping,
  Raycaster,
  Plane
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

class RenderManager {
  #options;
  canvas;
  camera;
  cameraMinAspect;
  cameraMaxAspect;
  cameraFov;
  maxPixelRatio;
  minPixelRatio;
  scene;
  renderer;
  #postprocessing;
  size = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  render = this.#defaultRender;
  onBeforeRender = () => {};
  onAfterRender = () => {};
  onAfterResize = () => {};
  #isVisible = false;
  #isLooping = false;
  isDisposed = false;
  #intersectionObserver;
  #resizeObserver;
  #resizeTimeout;
  #clock = new Clock();
  #time = { elapsed: 0, delta: 0 };
  #animationFrameId;

  constructor(options) {
    this.#options = { ...options };
    this.#initCamera();
    this.#initScene();
    this.#initRenderer();
    this.resize();
    this.#initObservers();
  }

  #initCamera() {
    this.camera = new PerspectiveCamera();
    this.cameraFov = this.camera.fov;
  }

  #initScene() {
    this.scene = new Scene();
  }

  #initRenderer() {
    if (this.#options.canvas) {
      this.canvas = this.#options.canvas;
    } else if (this.#options.id) {
      this.canvas = document.getElementById(this.#options.id);
    } else {
      console.error('Three: Missing canvas or id parameter');
    }
    this.canvas.style.display = 'block';
    const options = {
      canvas: this.canvas,
      powerPreference: 'high-performance',
      ...(this.#options.rendererOptions ?? {})
    };
    this.renderer = new WebGLRenderer(options);
    this.renderer.outputColorSpace = SRGBColorSpace;
  }

  #initObservers() {
    if (!(this.#options.size instanceof Object)) {
      window.addEventListener('resize', this.#handleResize.bind(this));
      if (this.#options.size === 'parent' && this.canvas.parentNode) {
        this.#resizeObserver = new ResizeObserver(this.#handleResize.bind(this));
        this.#resizeObserver.observe(this.canvas.parentNode);
      }
    }
    this.#intersectionObserver = new IntersectionObserver(this.#handleVisibilityChange.bind(this), {
      root: null,
      rootMargin: '0px',
      threshold: 0
    });
    this.#intersectionObserver.observe(this.canvas);
    document.addEventListener('visibilitychange', this.#handleDocumentVisibilityChange.bind(this));
  }

  #cleanupObservers() {
    window.removeEventListener('resize', this.#handleResize.bind(this));
    this.#resizeObserver?.disconnect();
    this.#intersectionObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.#handleDocumentVisibilityChange.bind(this));
  }

  #handleVisibilityChange(entries) {
    this.#isVisible = entries[0].isIntersecting;
    this.#isVisible ? this.#startLoop() : this.#stopLoop();
  }

  #handleDocumentVisibilityChange() {
    if (this.#isVisible) {
      document.hidden ? this.#stopLoop() : this.#startLoop();
    }
  }

  #handleResize() {
    if (this.#resizeTimeout) clearTimeout(this.#resizeTimeout);
    this.#resizeTimeout = setTimeout(this.resize.bind(this), 100);
  }

  resize() {
    let width, height;
    if (this.#options.size instanceof Object) {
      width = this.#options.size.width;
      height = this.#options.size.height;
    } else if (this.#options.size === 'parent' && this.canvas.parentNode) {
      width = this.canvas.parentNode.offsetWidth;
      height = this.canvas.parentNode.offsetHeight;
    } else {
      width = window.innerWidth;
      height = window.innerHeight;
    }
    this.size.width = width;
    this.size.height = height;
    this.size.ratio = width / height;
    this.#updateCamera();
    this.#updateRenderer();
    this.onAfterResize(this.size);
  }

  #updateCamera() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.#updateFov(this.cameraMinAspect);
      } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
        this.#updateFov(this.cameraMaxAspect);
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();
    this.updateWorldSize();
  }

  #updateFov(aspect) {
    const fov = Math.tan(MathUtils.degToRad(this.cameraFov / 2)) / (this.camera.aspect / aspect);
    this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(fov));
  }

  updateWorldSize() {
    if (this.camera.isPerspectiveCamera) {
      const vFOV = (this.camera.fov * Math.PI) / 180;
      this.size.wHeight = 2 * Math.tan(vFOV / 2) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    } else if (this.camera.isOrthographicCamera) {
      this.size.wHeight = this.camera.top - this.camera.bottom;
      this.size.wWidth = this.camera.right - this.camera.left;
    }
  }

  #updateRenderer() {
    this.renderer.setSize(this.size.width, this.size.height);
    this.#postprocessing?.setSize(this.size.width, this.size.height);
    let pixelRatio = window.devicePixelRatio;
    if (this.maxPixelRatio && pixelRatio > this.maxPixelRatio) {
      pixelRatio = this.maxPixelRatio;
    } else if (this.minPixelRatio && pixelRatio < this.minPixelRatio) {
      pixelRatio = this.minPixelRatio;
    }
    this.renderer.setPixelRatio(pixelRatio);
    this.size.pixelRatio = pixelRatio;
  }

  get postprocessing() {
    return this.#postprocessing;
  }
  set postprocessing(val) {
    this.#postprocessing = val;
    this.render = val.render.bind(val);
  }

  #startLoop() {
    if (this.#isLooping) return;
    const animate = () => {
      this.#animationFrameId = requestAnimationFrame(animate);
      this.#time.delta = this.#clock.getDelta();
      this.#time.elapsed += this.#time.delta;
      this.onBeforeRender(this.#time);
      this.render();
      this.onAfterRender(this.#time);
    };
    this.#isLooping = true;
    this.#clock.start();
    animate();
  }

  #stopLoop() {
    if (this.#isLooping) {
      cancelAnimationFrame(this.#animationFrameId);
      this.#isLooping = false;
      this.#clock.stop();
    }
  }

  #defaultRender() {
    this.renderer.render(this.scene, this.camera);
  }

  clear() {
    this.scene.traverse(obj => {
      if (obj.isMesh && typeof obj.material === 'object' && obj.material !== null) {
        Object.keys(obj.material).forEach(prop => {
          const material = obj.material[prop];
          if (material !== null && typeof material === 'object' && typeof material.dispose === 'function') {
            material.dispose();
          }
        });
        obj.material.dispose();
        obj.geometry.dispose();
      }
    });
    this.scene.clear();
  }

  dispose() {
    this.#cleanupObservers();
    this.#stopLoop();
    this.clear();
    this.#postprocessing?.dispose();
    this.renderer.dispose();
    this.isDisposed = true;
  }
}

const interactionRegistry = new Map();
const mouseVector = new Vector2();
let isInteractionEnabled = false;

function createInteraction(options) {
  const handler = {
    position: new Vector2(),
    nPosition: new Vector2(),
    hover: false,
    touching: false,
    onEnter() {},
    onMove() {},
    onClick() {},
    onLeave() {},
    ...options
  };
  (function (domElement, handler) {
    if (!interactionRegistry.has(domElement)) {
      interactionRegistry.set(domElement, handler);
      if (!isInteractionEnabled) {
        document.body.addEventListener('pointermove', handlePointerMove);
        document.body.addEventListener('pointerleave', handlePointerLeave);
        document.body.addEventListener('click', handleClick);

        document.body.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.body.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.body.addEventListener('touchend', handleTouchEnd, { passive: false });
        document.body.addEventListener('touchcancel', handleTouchEnd, { passive: false });

        isInteractionEnabled = true;
      }
    }
  })(options.domElement, handler);
  
  handler.dispose = () => {
    const domElement = options.domElement;
    interactionRegistry.delete(domElement);
    if (interactionRegistry.size === 0) {
      document.body.removeEventListener('pointermove', handlePointerMove);
      document.body.removeEventListener('pointerleave', handlePointerLeave);
      document.body.removeEventListener('click', handleClick);

      document.body.removeEventListener('touchstart', handleTouchStart);
      document.body.removeEventListener('touchmove', handleTouchMove);
      document.body.removeEventListener('touchend', handleTouchEnd);
      document.body.removeEventListener('touchcancel', handleTouchEnd);

      isInteractionEnabled = false;
    }
  };
  return handler;
}

function handlePointerMove(e) {
  mouseVector.x = e.clientX;
  mouseVector.y = e.clientY;
  processInteraction();
}

function processInteraction() {
  for (const [elem, handler] of interactionRegistry) {
    const rect = elem.getBoundingClientRect();
    if (isInside(rect)) {
      updateHandlerPosition(handler, rect);
      if (!handler.hover) {
        handler.hover = true;
        handler.onEnter(handler);
      }
      handler.onMove(handler);
    } else if (handler.hover && !handler.touching) {
      handler.hover = false;
      handler.onLeave(handler);
    }
  }
}

function handleClick(e) {
  mouseVector.x = e.clientX;
  mouseVector.y = e.clientY;
  for (const [elem, handler] of interactionRegistry) {
    const rect = elem.getBoundingClientRect();
    updateHandlerPosition(handler, rect);
    if (isInside(rect)) handler.onClick(handler);
  }
}

function handlePointerLeave() {
  for (const handler of interactionRegistry.values()) {
    if (handler.hover) {
      handler.hover = false;
      handler.onLeave(handler);
    }
  }
}

function handleTouchStart(e) {
  if (e.touches.length > 0) {
    e.preventDefault();
    mouseVector.x = e.touches[0].clientX;
    mouseVector.y = e.touches[0].clientY;

    for (const [elem, handler] of interactionRegistry) {
      const rect = elem.getBoundingClientRect();
      if (isInside(rect)) {
        handler.touching = true;
        updateHandlerPosition(handler, rect);
        if (!handler.hover) {
          handler.hover = true;
          handler.onEnter(handler);
        }
        handler.onMove(handler);
      }
    }
  }
}

function handleTouchMove(e) {
  if (e.touches.length > 0) {
    e.preventDefault();
    mouseVector.x = e.touches[0].clientX;
    mouseVector.y = e.touches[0].clientY;

    for (const [elem, handler] of interactionRegistry) {
      const rect = elem.getBoundingClientRect();
      updateHandlerPosition(handler, rect);

      if (isInside(rect)) {
        if (!handler.hover) {
          handler.hover = true;
          handler.touching = true;
          handler.onEnter(handler);
        }
        handler.onMove(handler);
      } else if (handler.hover && handler.touching) {
        handler.onMove(handler);
      }
    }
  }
}

function handleTouchEnd() {
  for (const [, handler] of interactionRegistry) {
    if (handler.touching) {
      handler.touching = false;
      if (handler.hover) {
        handler.hover = false;
        handler.onLeave(handler);
      }
    }
  }
}

function updateHandlerPosition(handler, rect) {
  const { position, nPosition } = handler;
  if (!position || !nPosition) return;
  position.x = mouseVector.x - rect.left;
  position.y = mouseVector.y - rect.top;
  nPosition.x = (position.x / rect.width) * 2 - 1;
  nPosition.y = (-position.y / rect.height) * 2 + 1;
}

function isInside(rect) {
  const { x, y } = mouseVector;
  const { left, top, width, height } = rect;
  return x >= left && x <= left + width && y >= top && y <= top + height;
}

const { randFloat, randFloatSpread } = MathUtils;
const vTmp1 = new Vector3();
const vTmp2 = new Vector3();
const vTmp3 = new Vector3();
const vTmp4 = new Vector3();
const vTmp5 = new Vector3();
const vTmp6 = new Vector3();
const vTmp7 = new Vector3();
const vTmp8 = new Vector3();
const vTmp9 = new Vector3();
const vTmp10 = new Vector3();

class PhysicsEngine {
  constructor(config) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count).fill(0);
    this.velocityData = new Float32Array(3 * config.count).fill(0);
    this.sizeData = new Float32Array(config.count).fill(1);
    this.center = new Vector3();
    this.#initPositions();
    this.setSizes();
  }
  #initPositions() {
    const { config, positionData } = this;
    this.center.toArray(positionData, 0);
    for (let i = 1; i < config.count; i++) {
      const idx = 3 * i;
      positionData[idx] = randFloatSpread(2 * config.maxX);
      positionData[idx + 1] = randFloatSpread(2 * config.maxY);
      positionData[idx + 2] = randFloatSpread(2 * config.maxZ);
    }
  }
  setSizes() {
    const { config, sizeData } = this;
    sizeData[0] = config.size0;
    for (let i = 1; i < config.count; i++) {
      sizeData[i] = randFloat(config.minSize, config.maxSize);
    }
  }
  update(time) {
    const { config, center, positionData, sizeData, velocityData } = this;
    let startIndex = 0;
    if (config.controlSphere0) {
      startIndex = 1;
      vTmp1.fromArray(positionData, 0);
      vTmp1.lerp(center, 0.1).toArray(positionData, 0);
      vTmp4.set(0, 0, 0).toArray(velocityData, 0);
    }
    for (let idx = startIndex; idx < config.count; idx++) {
      const base = 3 * idx;
      vTmp2.fromArray(positionData, base);
      vTmp5.fromArray(velocityData, base);
      vTmp5.y -= time.delta * config.gravity * sizeData[idx];
      vTmp5.multiplyScalar(config.friction);
      vTmp5.clampLength(0, config.maxVelocity);
      vTmp2.add(vTmp5);
      vTmp2.toArray(positionData, base);
      vTmp5.toArray(velocityData, base);
    }
    for (let idx = startIndex; idx < config.count; idx++) {
      const base = 3 * idx;
      vTmp2.fromArray(positionData, base);
      vTmp5.fromArray(velocityData, base);
      const radius = sizeData[idx];
      for (let jdx = idx + 1; jdx < config.count; jdx++) {
        const otherBase = 3 * jdx;
        vTmp3.fromArray(positionData, otherBase);
        vTmp6.fromArray(velocityData, otherBase);
        const otherRadius = sizeData[jdx];
        vTmp7.copy(vTmp3).sub(vTmp2);
        const dist = vTmp7.length();
        const sumRadius = radius + otherRadius;
        if (dist < sumRadius) {
          const overlap = sumRadius - dist;
          vTmp8.copy(vTmp7)
            .normalize()
            .multiplyScalar(0.5 * overlap);
          vTmp9.copy(vTmp8).multiplyScalar(Math.max(vTmp5.length(), 1));
          vTmp10.copy(vTmp8).multiplyScalar(Math.max(vTmp6.length(), 1));
          vTmp2.sub(vTmp8);
          vTmp5.sub(vTmp9);
          vTmp2.toArray(positionData, base);
          vTmp5.toArray(velocityData, base);
          vTmp3.add(vTmp8);
          vTmp6.add(vTmp10);
          vTmp3.toArray(positionData, otherBase);
          vTmp6.toArray(velocityData, otherBase);
        }
      }
      if (config.controlSphere0) {
        vTmp7.copy(vTmp1).sub(vTmp2);
        const dist = vTmp7.length();
        const sumRadius0 = radius + sizeData[0];
        if (dist < sumRadius0) {
          const diff = sumRadius0 - dist;
          vTmp8.copy(vTmp7.normalize()).multiplyScalar(diff);
          vTmp9.copy(vTmp8).multiplyScalar(Math.max(vTmp5.length(), 2));
          vTmp2.sub(vTmp8);
          vTmp5.sub(vTmp9);
        }
      }
      if (Math.abs(vTmp2.x) + radius > config.maxX) {
        vTmp2.x = Math.sign(vTmp2.x) * (config.maxX - radius);
        vTmp5.x = -vTmp5.x * config.wallBounce;
      }
      if (config.gravity === 0) {
        if (Math.abs(vTmp2.y) + radius > config.maxY) {
          vTmp2.y = Math.sign(vTmp2.y) * (config.maxY - radius);
          vTmp5.y = -vTmp5.y * config.wallBounce;
        }
      } else if (vTmp2.y - radius < -config.maxY) {
        vTmp2.y = -config.maxY + radius;
        vTmp5.y = -vTmp5.y * config.wallBounce;
      }
      const maxBoundary = Math.max(config.maxZ, config.maxSize);
      if (Math.abs(vTmp2.z) + radius > maxBoundary) {
        vTmp2.z = Math.sign(vTmp2.z) * (config.maxZ - radius);
        vTmp5.z = -vTmp5.z * config.wallBounce;
      }
      vTmp2.toArray(positionData, base);
      vTmp5.toArray(velocityData, base);
    }
  }
}

class ExtendedMaterial extends MeshPhysicalMaterial {
  constructor(parameters) {
    super(parameters);
    this.uniforms = {
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2 },
      thicknessScale: { value: 10 }
    };
    this.defines.USE_UV = '';
    this.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.fragmentShader =
        '\n        uniform float thicknessPower;\n        uniform float thicknessScale;\n        uniform float thicknessDistortion;\n        uniform float thicknessAmbient;\n        uniform float thicknessAttenuation;\n      ' +
        shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        '\n        void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {\n          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));\n          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;\n          #ifdef USE_COLOR\n            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor;\n          #else\n            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;\n          #endif\n          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;\n        }\n\n        void main() {\n      '
      );
      const lightFragmentBegin = ShaderChunk.lights_fragment_begin.replaceAll(
        'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
        '\n          RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n          RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);\n        '
      );
      shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_begin>', lightFragmentBegin);
      if (this.onBeforeCompile2) this.onBeforeCompile2(shader);
    };
  }
}

const DEFAULT_CONFIG = {
  count: 200,
  colors: [0, 0, 0],
  ambientColor: 16777215,
  ambientIntensity: 1,
  lightIntensity: 200,
  materialParams: {
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.15
  },
  minSize: 0.5,
  maxSize: 1,
  size0: 1,
  gravity: 0.5,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  followCursor: true
};

const dummyObject = new Object3D();

class SpheresInstance extends InstancedMesh {
  constructor(renderer, config = {}) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    const environment = new RoomEnvironment();
    const pmremGenerator = new PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envMap = pmremGenerator.fromScene(environment).texture;
    const geometry = new SphereGeometry();
    const material = new ExtendedMaterial({ envMap, ...finalConfig.materialParams });
    if (material.envMapRotation) {
      material.envMapRotation.x = -Math.PI / 2;
    }
    super(geometry, material, finalConfig.count);
    this.config = finalConfig;
    this.physics = new PhysicsEngine(finalConfig);
    this.#initLighting();
    this.setColors(finalConfig.colors);
    // Cleanup PMREM
    environment.dispose();
  }
  #initLighting() {
    this.ambientLight = new AmbientLight(this.config.ambientColor, this.config.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new PointLight(this.config.colors[0], this.config.lightIntensity);
    this.add(this.light);
  }
  setColors(colors) {
    if (Array.isArray(colors) && colors.length > 0) {
      const gradient = (function (colors) {
        let palette = [];
        colors.forEach(col => {
          palette.push(new Color(col));
        });
        return {
          getColorAt: function (ratio, out = new Color()) {
            const scaled = Math.max(0, Math.min(1, ratio)) * (palette.length - 1);
            const idx = Math.floor(scaled);
            const start = palette[idx];
            if (idx >= palette.length - 1) return start.clone();
            const alpha = scaled - idx;
            const end = palette[idx + 1];
            out.r = start.r + alpha * (end.r - start.r);
            out.g = start.g + alpha * (end.g - start.g);
            out.b = start.b + alpha * (end.b - start.b);
            return out;
          }
        };
      })(colors);
      for (let idx = 0; idx < this.count; idx++) {
        const color = new Color();
        gradient.getColorAt(idx / this.count, color);
        this.setColorAt(idx, color);
        if (idx === 0) {
          this.light.color.copy(color);
        }
      }
      this.instanceColor.needsUpdate = true;
    }
  }
  update(time) {
    this.physics.update(time);
    for (let idx = 0; idx < this.count; idx++) {
      dummyObject.position.fromArray(this.physics.positionData, 3 * idx);
      if (idx === 0 && this.config.followCursor === false) {
        dummyObject.scale.setScalar(0);
      } else {
        dummyObject.scale.setScalar(this.physics.sizeData[idx]);
      }
      dummyObject.updateMatrix();
      this.setMatrixAt(idx, dummyObject.matrix);
      if (idx === 0) this.light.position.copy(dummyObject.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

function createBallpit(canvas, config = {}) {
  const manager = new RenderManager({
    canvas: canvas,
    size: 'parent',
    rendererOptions: { antialias: true, alpha: true }
  });
  let spheres;
  manager.renderer.toneMapping = ACESFilmicToneMapping;
  manager.camera.position.set(0, 0, 20);
  manager.camera.lookAt(0, 0, 0);
  manager.cameraMaxAspect = 1.5;
  manager.resize();
  
  initialize(config);
  
  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  const intersectPoint = new Vector3();
  let isPaused = false;

  canvas.style.touchAction = 'none';
  canvas.style.userSelect = 'none';
  canvas.style.webkitUserSelect = 'none';

  const interaction = createInteraction({
    domElement: canvas,
    onMove(handler) {
      if (!handler || !handler.nPosition) return;
      raycaster.setFromCamera(handler.nPosition, manager.camera);
      manager.camera.getWorldDirection(plane.normal);
      const intersection = raycaster.ray.intersectPlane(plane, intersectPoint);
      if (intersection) {
        spheres.physics.center.copy(intersectPoint);
        spheres.config.controlSphere0 = true;
      }
    },
    onLeave() {
      spheres.config.controlSphere0 = false;
    }
  });
  
  function initialize(cfg) {
    if (spheres) {
      manager.clear();
      manager.scene.remove(spheres);
    }
    spheres = new SpheresInstance(manager.renderer, cfg);
    manager.scene.add(spheres);
  }
  
  manager.onBeforeRender = (time) => {
    if (!isPaused) spheres.update(time);
  };
  
  manager.onAfterResize = (size) => {
    spheres.config.maxX = size.wWidth / 2;
    spheres.config.maxY = size.wHeight / 2;
  };
  
  return {
    three: manager,
    get spheres() {
      return spheres;
    },
    setCount(count) {
      initialize({ ...spheres.config, count: count });
    },
    togglePause() {
      isPaused = !isPaused;
    },
    dispose() {
      interaction.dispose();
      manager.dispose();
    }
  };
}

const Ballpit = ({ className = '', followCursor = true, ...props }) => {
  const canvasRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    instanceRef.current = createBallpit(canvas, { followCursor, ...props });

    return () => {
      if (instanceRef.current) {
        instanceRef.current.dispose();
      }
    };
  }, [followCursor]); // Re-create if followCursor changes, simpler than updating config dynamically for this demo

  return <canvas className={className} ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default Ballpit;