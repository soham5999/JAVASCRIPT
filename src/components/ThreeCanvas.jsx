import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Detect mobile device
    const isMobile = window.innerWidth < 768;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05050a, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // 2. Starfield & Zero-G Particles
    const particleCount = isMobile ? 350 : 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x06b6d4); // cyan
    const color2 = new THREE.Color(0x6366f1); // indigo
    const color3 = new THREE.Color(0xa855f7); // violet

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 220;
      positions[i3 + 1] = (Math.random() - 0.5) * 160;
      positions[i3 + 2] = (Math.random() - 0.5) * 180;

      const mixed = Math.random();
      const c = mixed < 0.4 ? color1 : mixed < 0.8 ? color2 : color3;
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.5, 'rgba(99,102,241,0.6)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: isMobile ? 2.2 : 2.8,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Floating Zero-G Geometric Crystal Objects
    const floatingObjects = [];
    const objectGeometries = [
      new THREE.IcosahedronGeometry(3.5, 0),
      new THREE.OctahedronGeometry(3.0, 0),
      new THREE.TetrahedronGeometry(3.2, 0),
      new THREE.TorusGeometry(3.2, 0.8, 12, 24),
      new THREE.DodecahedronGeometry(3.0, 0)
    ];

    const countObjects = isMobile ? 4 : 9;

    for (let i = 0; i < countObjects; i++) {
      const geom = objectGeometries[i % objectGeometries.length];
      
      // Wireframe exterior
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x06b6d4 : 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });
      const wireMesh = new THREE.Mesh(geom, wireframeMat);

      // Glassy interior
      const innerMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x3b82f6 : 0x6366f1,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending
      });
      const innerMesh = new THREE.Mesh(geom, innerMat);
      innerMesh.scale.set(0.92, 0.92, 0.92);

      const group = new THREE.Group();
      group.add(wireMesh);
      group.add(innerMesh);

      // Random scattered positions
      const angle = (i / countObjects) * Math.PI * 2;
      const radius = 32 + Math.random() * 30;
      group.position.x = Math.cos(angle) * radius + (Math.random() - 0.5) * 15;
      group.position.y = Math.sin(angle) * radius * 0.7 + (Math.random() - 0.5) * 15;
      group.position.z = (Math.random() - 0.5) * 45;

      // Rotation and float velocities
      const driftData = {
        group,
        baseY: group.position.y,
        baseX: group.position.x,
        floatSpeed: 0.0008 + Math.random() * 0.0012,
        floatAmplitude: 4 + Math.random() * 4,
        rotSpeedX: (Math.random() - 0.5) * 0.008,
        rotSpeedY: (Math.random() - 0.5) * 0.012,
        rotSpeedZ: (Math.random() - 0.5) * 0.006,
        timeOffset: Math.random() * Math.PI * 2
      };

      floatingObjects.push(driftData);
      scene.add(group);
    }

    // 4. Subtle Ambient & Point Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 2, 100);
    pointLight.position.set(20, 20, 40);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 2, 100);
    pointLight2.position.set(-20, -20, 30);
    scene.add(pointLight2);

    // 5. Interactive Mouse Damping
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Slight camera parallax responsive to mouse
      if (!prefersReducedMotion) {
        camera.position.x = mouse.x * 12;
        camera.position.y = mouse.y * 8;
        camera.lookAt(scene.position);

        // Rotate entire particle cloud very slowly
        particles.rotation.y = elapsedTime * 0.02 + mouse.x * 0.2;
        particles.rotation.x = mouse.y * 0.15;

        // Floating objects zero-gravity physics
        floatingObjects.forEach((item) => {
          item.group.rotation.x += item.rotSpeedX;
          item.group.rotation.y += item.rotSpeedY;
          item.group.rotation.z += item.rotSpeedZ;

          // Zero-G drift up and down
          item.group.position.y = item.baseY + Math.sin(elapsedTime * 0.8 + item.timeOffset) * item.floatAmplitude;
          item.group.position.x = item.baseX + Math.cos(elapsedTime * 0.6 + item.timeOffset) * (item.floatAmplitude * 0.5);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      objectGeometries.forEach((g) => g.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-85"
      aria-hidden="true"
    />
  );
}
