<template>
  <div ref="cubeContainer" class="cube-container"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { createThreeJSCube } from '../components/sunglass'; // Adjust the path if necessary

const cubeContainer = ref(null);

onMounted(() => {
  // Call the function and pass the DOM element where the Three.js scene should be rendered
  createThreeJSCube(cubeContainer.value);
});
</script>

<style>
 html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  }
      
   #cubeContainer {
    width: 100vw;
    height: 100vh;
    }
</style>
