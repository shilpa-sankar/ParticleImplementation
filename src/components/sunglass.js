import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useUserStore } from './userStore';

export function createThreeJSObject(container) {
  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7a202d);  // Example: light blue = 0xa0d3de;

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 4;
  camera.position.y = 2;

  // Renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Light setup
  const light = new THREE.AmbientLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  scene.add(light);
  
  // creating group for model 
  const group  = new THREE.Group();

  // creating group for petals
  const petalsGroup = new THREE.Group();

  // Create a particle system for a cloud-like fog around the object 
  const particleCount =10000;
  const petalObjects = []; 
  const positions = [];
  const initialPositions = []; 
  const sizes = [];

  /**
   * 
   * @param {radius of sphere} radius 
   * @returns {coordinates} x,y,z
   */
  function randomInSphere(radius) {
    // u & v are random values within 0 to 1
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
    'https://particle-implementation.vercel.app/nyra_woman_warrior.glb',  // Path to the GLTF file
  
    // Called when the model is loaded
    function (gltf) {
      const loadedModel = gltf.scene;
  
      // Adjust the model's scale and position if necessary
      loadedModel.scale.set(0.1, 0.1, 0.1);  // Modify the scale if needed
      loadedModel.position.set(0, 0, 0);  // Center the model

      // Add the loaded model to the group
      group.add(loadedModel);
      scene.add(group);

    },
  
      // Called when an error occurs
    function (error) {
      console.error('An error occurred while loading the GLTF model:', error);
    }
  );

  // loader for petal texture
  loader.load('https://particle-implementation.vercel.app/cherry_blossom_petal.glb', (gltf) => {
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

      petalsGroup.add(petalClone);
      petalObjects.push(petalClone);  // Store each petal for animation
    }

    scene.add(petalsGroup);
  });

  // create an AudioListener and add it to the camera
  const listener = new THREE.AudioListener();
  camera.add(listener);

  // create a global audio source
  const sound = new THREE.Audio(listener);

  // load a sound and set it as the Audio object's buffer
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load('https://particle-implementation.vercel.app/audio1.mp3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
  });

  // drag controls
  const dragControls = new DragControls([group], camera, renderer.domElement);
  dragControls.transformGroup = true;

  // access the store 
  const userStore = useUserStore();

  // access the play button from vue file (html) through its id 
  const playButton = document.getElementById("playbutton");

  // adding conditions for button to do play & pause
  playButton.addEventListener('click', () => {
    if (userStore.isPlaying) {
      sound.pause();
      userStore.togglePlayPause(false);
    } else {
      console.log("play")
      sound.play();
      userStore.togglePlayPause(true)
    }
  });

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
     // Rotate each petal independently
     petalObjects.forEach((petal, index) => {
      petal.rotation.y += 0.01;  // Slow constant rotation around the Y axis
      petal.rotation.x += Math.sin(elapsedTime + index) * 0.005;  // Small oscillating motion on the X axis
    });

    //rotating the petals group in y direction
    petalsGroup.rotation.y += 0.005;
    renderer.render(scene, camera);

  };

  animate();
}
