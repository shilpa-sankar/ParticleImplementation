<template>
  <div ref="cubeContainer" class="cube-container"></div>
  <div id="info">
    <button type="button" class="button" id="playbutton" > {{ userStore.isPlaying ? 'Pause' : 'Play' }}</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { createThreeJSObject } from '../components/sunglass'; // Adjust the path if necessary
import { useUserStore } from '../components/userStore';

const cubeContainer = ref(null);
const userStore = useUserStore();

onMounted(() => {
  // Call the function and pass the DOM element where the Three.js scene should be rendered
  createThreeJSObject(cubeContainer.value);

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
    height: 80vh;
  }

  #info {
	position: absolute;
	top: 10px;
	width: 100%;
	text-align: center;
	z-index: 100;
	display:block;
  }

  .button {
  background-color: #04AA6D;
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  margin: 4px 2px;
  cursor: pointer;
  width: 4vw;
  height: 3vh;
  }
</style>
