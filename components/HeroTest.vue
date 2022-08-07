<script setup>
import * as THREE from 'three';
import chroma from "chroma-js"

const day = new THREE.Color(0xB8F4FF)
const duskdawn = new THREE.Color(0xFF571F)
const GROUND_SIZE = 100
const SHADOW_SIZE = 2048
const lightPower = 5
const clock = new THREE.Clock()
let color = ref()
let sceneBg = ref()
let time = ref(0)
let container,
scene, camera, renderer, controls,
lightSun, lightMoon, ambientLight, lightGroup,
groundGeometry, groundMaterial, ground

onUnmounted(() => {
  renderer.dispose()
  controls.dispose()
  ambientLight.dispose()
  lightSun.dispose()
  lightMoon.dispose()
  lightHelperSun.dispose()
  lightHelperMoon.dispose()
})

onMounted(() => {
  container = document.getElementById( 'container' )
  scene = new THREE.Scene()

  renderer = new THREE.WebGLRenderer( { antialias: true } )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( container.clientWidth, container.clientHeight )
  renderer.outputEncoding = THREE.sRGBEncoding
  //renderer.toneMapping =THREE. ACESFilmicToneMapping
  //renderer.toneMappingExposure = 1
  // turn on the physically correct lighting model
  //renderer.physicallyCorrectLights = true
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  container.appendChild( renderer.domElement )

  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 )
  camera.near = 0.1
  camera.position.set( 0.5, 0.2, 2 )
  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()

  // environment
  //scene.background = sceneBg
  //scene.fog = new THREE.FogExp2( sceneBg, 0.25 )

  ambientLight = new THREE.AmbientLight(0x404040)
  //scene.add( ambientLight )

  lightSun = new THREE.DirectionalLight( 0xffaaaa, lightPower, 100 )
  lightSun.position.set( 0, 5, 2 )
  const lightHelperSun = new THREE.DirectionalLightHelper( lightSun )
  lightHelperSun.color = 0xff0000

  lightMoon = new THREE.DirectionalLight( 0x0011ff, lightPower, 100 )
  lightMoon.position.set( 0, -5, -2 )
  const lightHelperMoon = new THREE.DirectionalLightHelper( lightMoon )
  scene.add( lightHelperSun, lightHelperMoon )

  lightGroup = new THREE.Group()
  lightGroup.rotation.x = .1
  lightGroup.add( lightSun, lightMoon )
  scene.add( lightGroup )

  //LA ESCENA
  // GROUND
  groundGeometry = new THREE.PlaneGeometry( GROUND_SIZE, GROUND_SIZE )
  groundMaterial = new THREE.MeshStandardMaterial( { color: 0x005533, side: THREE.DoubleSide } )
  ground = new THREE.Mesh( groundGeometry, groundMaterial )
  ground.receiveShadow = true
  //ground.castShadow = true
  ground.rotation.x = -Math.PI / 2
  //scene.add( ground )

  animate()

  window.onresize = function () {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight )
  }

  function animate() {
    requestAnimationFrame( animate )
    time.value = clock.getElapsedTime()/2
    // opciones: rgb, hsl, lab, lch, lrgb
    sceneBg.value = chroma.mix('red', 'blue', rgb.value).gl() //#TODO
    color = new THREE.Color( sceneBg.value[0], sceneBg.value[1], sceneBg.value[2])
    
    //scene.fog = new THREE.FogExp2( color, 0.01 )
    scene.background = color
    //ambientLight.color = color

    lightGroup.rotation.z = time
    lightSun.intensity = ( Math.cos(time)+1 )/2
    renderer.render( scene, camera )
  }
})

const rgb = computed(() => {
 return ((Math.cos(time.value)+1)/2).toFixed(2)
})

</script>

<template>
  <div id="container" class="h-96 overflow-hidden flex items-center justify-center">
    <div :style="`background-color: ${sceneBg}`" class="absolute btn">{{ rgb}}</div>
  </div>
</template>