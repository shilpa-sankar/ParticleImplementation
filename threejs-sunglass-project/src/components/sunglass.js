// src/threejs/threeCube.js
import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls'; // Make sure you include DragControls
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createThreeJSCube(container) {
  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x615b5c);  // Example: light blue = 0xa0d3de;

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Light setup
  const light = new THREE.AmbientLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  scene.add(light);

  const group  = new THREE.Group();

  // const orbitControls = new OrbitControls(camera,renderer.domElement);
  // orbitControls.enableDamping = true;
  // orbitControls.dampingFactor = 0.25;

  // Create a particle system for a cloud-like fog around the object 
  const particleCount =10000;
  const petalObjects = []; 
  const positions = [];
  const initialPositions = []; 
  const sizes = [];

  function randomInSphere(radius) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * Math.cbrt(Math.random());

    const x = r * (Math.random() * Math.sin(phi) * Math.cos(theta));
    const y = r * (Math.random() * Math.sin(phi) * Math.sin(theta));
    const z = r * (Math.random() * Math.cos(phi));

    return { x, y, z };
  }

  // Create particles in a cloud-like distribution
  for (let i = 0; i < particleCount; i++) {
    const { x, y, z } = randomInSphere(13); // Randomize particles within a sphere

    // Push positions and sizes (larger particles near center)
    positions.push(x, y, z);
    initialPositions.push(x, y, z);  // Store the initial position to apply bouncing effect later
    sizes.push(0.1); // Random sizes for particles
  }

  // Set up clock for time-based animation
  const clock = new THREE.Clock();

  // GLTFLoader to load the model
  const loader = new GLTFLoader();
  // Load the GLTF model (sunglass)
  loader.load(
    'http://localhost:5174/vibrant.glb',  // Path to the GLTF file
  
    // Called when the model is loaded
    function (gltf) {
      const loadedModel = gltf.scene;
      console.log('Loaded GLTF scene:', loadedModel);
  
      // Adjust the model's scale and position if necessary
      loadedModel.scale.set(2, 2, 1);  // Modify the scale if needed
      loadedModel.position.set(0, 0, 0);  // Center the model

      // Add the loaded model to the group
      group.add(loadedModel);
      scene.add(group);

      // Log to confirm the model is added
      console.log('Model added to the scene: ', scene);
    },
  
    // Called during the loading process
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
  
    // Called when an error occurs
    function (error) {
      console.error('An error occurred while loading the GLTF model:', error);
    }
  );

  // loader for petal texture
  loader.load('http://localhost:5174/cherry_blossom_petal.glb', (gltf) => {
    const petalModel = gltf.scene;

    // Adjust the scale of the petal
    petalModel.scale.set(0.1, 0.1, 0.1);

    // Create multiple petals and position them randomly
    for (let i = 0; i < particleCount; i++) {
      const petalClone = petalModel.clone();
      const { x, y, z } = randomInSphere(13);  // Random position in a sphere
      petalClone.position.set(x, y, z);

      // Random rotation for each petal
      petalClone.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

      group.add(petalClone);
      petalObjects.push(petalClone);  // Store each petal for animation
    }

    scene.add(group);
  });

 
  const dragControls = new DragControls([group], camera, renderer.domElement);
  dragControls.transformGroup = true;

  // dragControls.addEventListener('dragstart', function () {
  //   // orbitControls.enabled = false;  // Disable OrbitControls during drag
  // });

  // dragControls.addEventListener('dragend', function () {
  //   // orbitControls.enabled = true;   // Enable OrbitControls after drag ends
  // });
 
  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
     // Rotate each petal independently
     petalObjects.forEach((petal, index) => {
      petal.rotation.y += 0.01;  // Slow constant rotation around the Y axis
      petal.rotation.x += Math.sin(elapsedTime + index) * 0.005;  // Small oscillating motion on the X axis
    });

    group.rotation.y += 0.005;
    renderer.render(scene, camera);

  };

  animate();
}
