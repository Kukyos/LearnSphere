import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const WorldGlobe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    let earthGeometry: THREE.SphereGeometry | undefined;
    let earthMaterial: THREE.MeshPhongMaterial | THREE.MeshStandardMaterial | undefined;
    let atmosphereGeometry: THREE.SphereGeometry | undefined;
    let atmosphereMaterial: THREE.ShaderMaterial | undefined;
    let atmosphereInnerGeometry: THREE.SphereGeometry | undefined;
    let atmosphereInnerMaterial: THREE.ShaderMaterial | undefined;
    let starsGeometry: THREE.BufferGeometry | undefined;
    let starsMaterial: THREE.PointsMaterial | undefined;
    let animationId: number;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let isDisposed = false;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    
    // Camera - zoomed out for smaller globe
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // --- Globe Setup ---
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Fallback globe
    const createFallbackGlobe = () => {
      if (isDisposed) return;
      
      earthGeometry = new THREE.SphereGeometry(1, 64, 64);
      earthMaterial = new THREE.MeshStandardMaterial({
        color: 0x6b7f5a,
        roughness: 0.8,
        metalness: 0.1,
        emissive: 0x242d1f,
        emissiveIntensity: 0.1
      });
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      sphereGroup.add(earth);
      addAtmosphere();
      setIsLoading(false);
    };

    // Atmosphere effects
    const addAtmosphere = () => {
      const vertexShader = `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;
      const fragmentShader = `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
          gl_FragColor = vec4(0.42, 0.5, 0.35, 0.5) * intensity;
        }
      `;
      atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
      });
      atmosphereGeometry = new THREE.SphereGeometry(1.2, 64, 64);
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      sphereGroup.add(atmosphere);
      
      const fragmentShaderInner = `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 6.0);
          gl_FragColor = vec4(0.6, 0.66, 0.54, 0.4) * intensity;
        }
      `;
      atmosphereInnerMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: fragmentShaderInner,
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide,
        transparent: true
      });
      atmosphereInnerGeometry = new THREE.SphereGeometry(1.0, 64, 64);
      const atmosphereInner = new THREE.Mesh(atmosphereInnerGeometry, atmosphereInnerMaterial);
      atmosphereInner.scale.set(1.02, 1.02, 1.02); 
      sphereGroup.add(atmosphereInner);
    };

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';
    
    const textureTimeout = setTimeout(() => {
      if (isLoading && !isDisposed) {
        createFallbackGlobe();
      }
    }, 5000);

    Promise.all([
      textureLoader.loadAsync('https://unpkg.com/three-globe@2.31.1/example/img/earth-day.jpg'),
      textureLoader.loadAsync('https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png')
    ]).then(([map, bump]) => {
      clearTimeout(textureTimeout);
      if (isDisposed) return;
      
      setIsLoading(false);

      earthGeometry = new THREE.SphereGeometry(1, 64, 64);
      earthMaterial = new THREE.MeshPhongMaterial({
        map: map,
        bumpMap: bump,
        bumpScale: 0.05,
        shininess: 5,
        color: 0xeef0e8,
        specular: 0x3d4a33,
        emissive: 0x151a12,
        emissiveIntensity: 0.2
      });
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      sphereGroup.add(earth);
      addAtmosphere();
    }).catch(() => {
      clearTimeout(textureTimeout);
      if (!isDisposed) createFallbackGlobe();
    });

    // Starfield
    starsGeometry = new THREE.BufferGeometry();
    const starsCount = 800;
    const posArray = new Float32Array(starsCount * 3);
    for(let i = 0; i < starsCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 12; 
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    starsMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: 0x6b7f5a,
      transparent: true,
      opacity: 0.35
    });
    const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starsMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);
    
    const backLight = new THREE.PointLight(0x9aa88a, 1, 10);
    backLight.position.set(-2, 1, -2);
    scene.add(backLight);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; 
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Animation Loop
    const animate = () => {
      if (isDisposed) return;
      animationId = requestAnimationFrame(animate);
      starsMesh.rotation.y -= 0.0001;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || isDisposed) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      earthGeometry?.dispose();
      earthMaterial?.dispose();
      atmosphereGeometry?.dispose();
      atmosphereMaterial?.dispose();
      atmosphereInnerGeometry?.dispose();
      atmosphereInnerMaterial?.dispose();
      starsGeometry?.dispose();
      starsMaterial?.dispose();
      
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-brand-400">
          <div className="animate-spin w-8 h-8 border-2 border-current border-t-transparent rounded-full"></div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-12 left-0 right-0 text-center pointer-events-none opacity-40">
        <p className="text-[10px] uppercase tracking-[0.2em] text-brand-700">
          Interactive Model
        </p>
      </div>
    </div>
  );
};