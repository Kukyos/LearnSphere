import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface PixelBlastProps {
  variant?: 'square' | 'circle';
  pixelSize?: number;
  color?: string;
  patternScale?: number;
  patternDensity?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleSpeed?: number;
  rippleThickness?: number;
  rippleIntensityScale?: number;
  liquid?: boolean;
  liquidStrength?: number;
  liquidRadius?: number;
  liquidWobbleSpeed?: number;
  speed?: number;
  edgeFade?: number;
  transparent?: boolean;
}

const PixelBlast: React.FC<PixelBlastProps> = ({
  color = "#B7E4C7", // Default to brand-200 equivalent
  speed = 0.5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup Scene
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 20;
    camera.position.y = -5;
    camera.rotation.x = 0.2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Particles (Grid of squares)
    const gridSize = 60;
    const spacing = 1.2;
    const count = gridSize * gridSize;
    
    const geometry = new THREE.PlaneGeometry(0.8, 0.8);
    const material = new THREE.MeshBasicMaterial({ 
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    
    // Initialize positions
    const dummy = new THREE.Object3D();
    const initialY = new Float32Array(count);

    let i = 0;
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        dummy.position.set(
          (x - gridSize / 2) * spacing,
          0,
          (z - gridSize / 2) * spacing
        );
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        initialY[i] = 0;
        i++;
      }
    }
    
    scene.add(mesh);

    // Mouse interaction
    const mouse = new THREE.Vector2(-1000, -1000);
    const targetMouse = new THREE.Vector2(-1000, -1000);

    const onMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        // Normalize mouse to -1 to 1 based on center of container
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Project ray to ground plane y=0
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const target = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, target);
        
        if (target) {
            targetMouse.set(target.x, target.z);
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    // Resize handler
    const onResize = () => {
        if (!containerRef.current) return;
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let time = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      time += delta * speed;

      // Smooth mouse movement
      mouse.lerp(targetMouse, 0.1);

      let i = 0;
      for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
          
          const xPos = (x - gridSize / 2) * spacing;
          const zPos = (z - gridSize / 2) * spacing;

          // Wave Calculation
          const dist = Math.sqrt((xPos - mouse.x) ** 2 + (zPos - mouse.y) ** 2);
          
          // Ambient wave
          let y = Math.sin(xPos * 0.2 + time) * Math.cos(zPos * 0.2 + time) * 0.5;
          
          // Ripple effect from mouse
          if (dist < 15) {
             const ripple = Math.sin(dist * 0.8 - time * 5) * (1 - dist / 15);
             y += ripple * 2;
          }

          dummy.position.set(xPos, y, zPos);
          
          // Scale effect based on wave height
          const scale = 1 + y * 0.3;
          dummy.scale.set(scale, scale, scale);
          
          // Rotation effect
          dummy.rotation.x = y * 0.2;
          dummy.rotation.z = y * 0.2;

          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
          i++;
        }
      }
      
      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [color, speed]);

  return <div ref={containerRef} className="w-full h-full absolute inset-0 z-0" />;
};

export default PixelBlast;