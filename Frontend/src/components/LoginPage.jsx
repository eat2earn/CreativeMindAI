import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const mountRef = useRef(null);
  const parentRef = useRef(null);
  const lengthRef = useRef(7);

  useEffect(() => {
    // Initialize Three.js scene
    const canvas = mountRef.current;
    const scene = new THREE.Scene();
    
    // Camera
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(0, 0, 1);
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true
    });
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Parent group for model
    const parent = new THREE.Group();
    scene.add(parent);
    parentRef.current = parent;

    // Load GLTF model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/static/scene3.glb',
      (gltf) => {
        if (gltf.scene && gltf.scene.children[0]) {
          gltf.scene.children[0].scale.set(0.25, 0.25, 0.25);
          gltf.scene.children[0].rotation.set(Math.PI * 1.7, 0, 0);
          gltf.scene.children[0].position.set(0, 0.35, 0);
          parent.add(gltf.scene.children[0]);
        } else {
          console.error('GLTF model is empty or has no children');
        }
      },
      undefined,
      (error) => {
        console.error('Error loading GLTF model:', error);
      }
    );

    // Mouse movement
    const mouse = new THREE.Vector2();
    const handleMouseMove = (event) => {
      mouse.x = event.clientX / sizes.width * 2 - 1;
      mouse.y = -(event.clientY / sizes.height) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const clock = new THREE.Clock();
    let previousTime = 0;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;

      // Update camera position based on mouse
      camera.position.x = -Math.sin(mouse.x / 3);
      camera.position.y = -Math.sin(mouse.y / 5);

      // Update model rotation based on input length
      const length = lengthRef.current;
      if (length !== 0 && length !== 7.5 && length !== 7.6) {
        parent.rotation.y = (length / 10) - 0.75;
      }

      if (length === 7.5 && parent.rotation.y < Math.PI) {
        parent.rotation.y += 0.1;
      }

      if (length === 7.6 && parent.rotation.y > 0) {
        parent.rotation.y -= 0.1;
      }

      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };
    tick();

    // Handle window resize
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  const handleUsernameChange = (e) => {
    lengthRef.current = e.target.value.length;
  };

  const handlePasswordFocus = () => {
    lengthRef.current = 7.5;
  };

  const handlePasswordBlur = () => {
    lengthRef.current = 7.6;
  };

  return (
    <div className={styles.container}>
      <canvas className={styles.webgl} ref={mountRef} />
      <div className={styles.card}>
        <form id="survey-form">
          <label htmlFor="username" className={styles.label}>Username</label><br />
          <input
            type="text"
            id="username"
            className={styles.input}
            placeholder="Enter your name"
            maxLength="20"
            required
            onChange={handleUsernameChange}
          />
          <br /><br />
          <label htmlFor="password" className={styles.label}>Password</label><br />
          <input
            type="password"
            id="password"
            className={styles.input}
            placeholder="Enter your password"
            required
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
          />
        </form>
      </div>
    </div>
  );
}