<script setup>
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
//import { Sky } from 'three/examples/jsm/objects/Sky.js'
//import { EquirectangularReflectionMapping } from 'three/constants.js'

import chroma from "chroma-js"

const day = 0xB8F4FF
const duskdawn = 0x001F57
const GROUND_SIZE = 100
const SHADOW_SIZE = 2048
const DAYNIGHT_CYCLE_SPEED = 16
const WAKE_UP_TIME = 5
const lightPower = 5
const hdrimgUrl = '/images/Studio_80s.hdr'
const clock = new THREE.Clock()
const loader = new GLTFLoader()
let sceneBg = ref()
let mixer, time = 0, container,
scene, camera, renderer, controls,
lightSun, lightMoon, ambientLight, lightHelperSun, lightHelperMoon, lightGroup,
groundGeometry, groundMaterial, ground

onBeforeMount(() => {
  
})

onMounted(() => {
  container = document.getElementById( 'container' )
  scene = new THREE.Scene()
  //scene.background = new THREE.Color( 0x00ffff )

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
  camera.position.set( 2, 0.5, 2.5 )
  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()

  controls = new OrbitControls( camera, renderer.domElement )
  controls.target.set( -1, 0.5, 0 )
  //controls.minAzimuthAngle = Math.PI*2
  //controls.maxAzimuthAngle = Math.PI*0.25
  //controls.minPolarAngle = Math.PI*0.25
  //controls.maxPolarAngle = Math.PI*0.55
  //controls.update()
  controls.enablePan = false
  controls.enableDamping = true

  // environment
  //const pmremGenerator = new THREE.PMREMGenerator( renderer )
  //scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture

  /*const loadedTexture = new RGBELoader().load(hdrimgUrl, () => {
    const envMap = loadedTexture
    scene.environment = envMap
    scene.environment.mapping = THREE.EquirectangularReflectionMapping
    scene.environment.needsUpdate = true
  })*/

  // Add Sky
  //let sky = new Sky()
  //sky.scale.setScalar( 450000 )
  //scene.add( sky )
  ambientLight = new THREE.AmbientLight(0x404040)
  scene.add( ambientLight )

  lightSun = new THREE.DirectionalLight( 0xffaaaa, lightPower, 100 )
  lightSun.position.set( 0, 5, 2 )
  lightSun.distance = 10
  lightSun.angle = 0.3
  lightSun.castShadow = true
  //lightSun.shadow.bias = 0.0001
  lightSun.shadow.mapSize.width = lightSun.shadow.mapSize.height = SHADOW_SIZE
  lightHelperSun = new THREE.DirectionalLightHelper( lightSun )
  lightHelperSun.color = 0xff0000

  lightMoon = new THREE.DirectionalLight( 0x0011ff, lightPower, 100 )
  lightMoon.position.set( 0, -5, -2 )
  lightMoon.distance = 10
  lightMoon.angle = 0.3
  lightMoon.castShadow = true
  //lightMoon.shadow.bias = 0.0001
  lightMoon.shadow.mapSize.width = lightMoon.shadow.mapSize.height = SHADOW_SIZE
  lightHelperMoon = new THREE.DirectionalLightHelper( lightMoon )
  //scene.add( lightHelperSun, lightHelperMoon )

  lightGroup = new THREE.Group()
  lightGroup.rotation.x = .1
  lightGroup.add( lightSun, lightMoon )
  scene.add( lightGroup )

  // GROUND
  groundGeometry = new THREE.PlaneGeometry( GROUND_SIZE, GROUND_SIZE )
  groundMaterial = new THREE.MeshStandardMaterial( { color: 0x888888, side: THREE.DoubleSide } )
  ground = new THREE.Mesh( groundGeometry, groundMaterial )
  ground.receiveShadow = true
  //ground.castShadow = true
  ground.rotation.x = -Math.PI / 2
  scene.add( ground )

  loader.load( '/gltf/pantalla.gltf', function ( gltf ) {
    const modelPantalla = gltf.scene.children[0].children[0].children[0]
    //model.position.set( 1, 1, 0 )
    modelPantalla.scale.set( 10, 10, 10)
    //modelPantalla.receiveShadow = true
    modelPantalla.castShadow = true
    //modelPantalla.material.envMap = envMap
    //modelPantalla.material.needsUpdate = true
    scene.add( modelPantalla )
    //mixer = new THREE.AnimationMixer( model )
    //mixer.clipAction( gltf.animations[ 0 ] ).play()
  }, undefined, function ( e ) { console.error( e ) })

  loader.load( '/gltf/panchera.gltf', function ( gltf ) {
    const modelPanchera = gltf.scene.children[0].children[0].children[0]
    modelPanchera.position.set( 0, 0, 1 )
    modelPanchera.scale.set( 10, 10, 10)
    modelPanchera.castShadow = true
    //modelPanchera.material.envMap = envMap
    //modelPanchera.material.needsUpdate = true
    scene.add( modelPanchera )
    //console.log(modelPanchera)
  }, undefined, function ( e ) { console.error( e ) })

  animate()

  function animate() {
    requestAnimationFrame( animate )
    time = clock.getElapsedTime() / DAYNIGHT_CYCLE_SPEED + WAKE_UP_TIME
    // opciones: rgb, hsl, lab, lch, lrgb
    sceneBg.value = chroma.mix( day, duskdawn, ((Math.sin(time)+1)/2), 'hsl' ).gl()
    const color = new THREE.Color( sceneBg.value[0], sceneBg.value[1], sceneBg.value[2])
    
    scene.fog = new THREE.FogExp2( color, 0.2 )
    scene.background = color
    ambientLight.color = color
    ambientLight.intensity = smoothstep(0,2,Math.sin(time+Math.PI))
    lightSun.intensity = smoothstep(0,0.9,Math.sin(time+Math.PI))
    lightMoon.intensity = smoothstep(0,1.5,Math.sin(time))

    lightGroup.rotation.z = time+Math.PI/2
    controls.update()
    //mixer.update( delta )
    renderer.render( scene, camera )
  }

  function smoothstep (min, max, value) {
    var x = Math.max(0, Math.min(1, (value-min)/(max-min)))
    return x*x*(3 - 2*x)
  }

  window.onresize = function () {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight )
  }
})

onUnmounted(() => {
  //clock.dispose()
  //scene.dispose()
  renderer.dispose()
  //camera.dispose()
  controls.dispose()
  //sceneBg.dispose()
  ambientLight.dispose()
  lightSun.dispose()
  lightMoon.dispose()
  lightHelperSun.dispose()
  lightHelperMoon.dispose()
  //lightGroup.dispose()
})
</script>

<template>
  <div id="container" class="h-96 block overflow-hidden"></div>
</template>