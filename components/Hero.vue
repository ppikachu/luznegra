<script setup>
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
//import { Sky } from 'three/examples/jsm/objects/Sky.js'
//import { EquirectangularReflectionMapping } from 'three/constants.js'
import chroma from "chroma-js"

const day = 0xffffff
const duskdawn = 0xff1F57
const night = 0x0000ff
const mixMethod = 'rgb' //opciones: rgb, hsl, lab, lch, lrgb
const GROUND_SIZE = 100
const SHADOW_SIZE = 2048
const DAYNIGHT_CYCLE_SPEED = 16
const WAKE_UP_TIME = 0
const lightPower = 5
const hdrimgUrl = '/images/Studio_80s.hdr'
const clock = new THREE.Clock()
const loader = new GLTFLoader()
let sceneBg = ref()
let mixer, time = 0, container,
scene, camera, renderer, controls,
lightSun, lightMoon, ambientLight, lightHelperSun, lightHelperMoon, lightGroup,
groundGeometry, groundMaterial, ground,
telonMaterial

onMounted(() => {
  const startButton = document.getElementById( 'startButton' )
  startButton.addEventListener( 'click', function () { initProjector() })

  function initProjector() {
    const overlay = document.getElementById( 'overlay' );
		overlay.remove()
    const video = document.getElementById( 'video' )
    video.play()

    const telonGeometry = new THREE.PlaneGeometry( 2, 1.1 )
    const telonTexture = new THREE.VideoTexture( video )
    telonTexture.encoding = THREE.sRGBEncoding
    telonTexture.needsUpdate = true

    telonMaterial = new THREE.MeshLambertMaterial(
      {
        color: 0x000000,
        emissive: 0xffffff,
        emissiveMap: telonTexture,
        //alphaMap: telonTexture,
      }
    )

    const telon = new THREE.Mesh( telonGeometry, telonMaterial )
    telon.position.set( 0, 0.9, 0.02 )
    scene.add( telon )
  }
  //#region sceneSetup
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

  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 )
  //camera = new THREE.OrthographicCamera( window.innerWidth/ -10, window.innerWidth/10, window.innerHeight /10, window.innerHeight / -10, 1, 1000 )
  camera.aspect = container.clientWidth / container.clientHeight
  camera.position.set( 1.8, 0.5, 2.2 )
  //camera.position.set( 1, 1, 1 )
  camera.updateProjectionMatrix()
  controls = new OrbitControls( camera, renderer.domElement )
  controls.target.set( -0.5, 0.5, 0 )
  //controls.minAzimuthAngle = Math.PI*2
  //controls.maxAzimuthAngle = Math.PI*0.25
  //controls.minPolarAngle = Math.PI*0.25
  //controls.maxPolarAngle = Math.PI*0.55
  controls.enablePan = false
  controls.enableDamping = true
  //#endregion sceneSetup
  //#region environment
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
  //#endregion environment
  //#region Lights
  ambientLight = new THREE.AmbientLight(0x404040)
  scene.add( ambientLight )

  lightSun = new THREE.DirectionalLight( 0xffaaaa, lightPower, 100 )
  lightSun.position.set( 0, 5, 2 )
  lightSun.distance = 10
  lightSun.angle = 0.3
  lightSun.castShadow = true
  //lightSun.shadow.bias = -0.0001
  lightSun.shadow.mapSize.width = lightSun.shadow.mapSize.height = SHADOW_SIZE
  lightHelperSun = new THREE.DirectionalLightHelper( lightSun )
  lightHelperSun.color = 0xff0000

  lightMoon = new THREE.DirectionalLight( 0x0011ff, lightPower, 100 )
  lightMoon.position.set( 0, -5, -2 )
  lightMoon.distance = 10
  lightMoon.angle = 0.3
  lightMoon.castShadow = true
  //lightMoon.shadow.bias = -0.0001
  lightMoon.shadow.mapSize.width = lightMoon.shadow.mapSize.height = SHADOW_SIZE
  lightHelperMoon = new THREE.DirectionalLightHelper( lightMoon )
  //scene.add( lightHelperSun, lightHelperMoon )

  lightGroup = new THREE.Group()
  lightGroup.rotation.x = .1
  lightGroup.add( lightSun, lightMoon )
  //lightGroup.add( lightSun )
  scene.add( lightGroup )
  //#endregion Lights
  //#region GROUND
  groundGeometry = new THREE.PlaneGeometry( GROUND_SIZE, GROUND_SIZE )
  groundMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide } )
  ground = new THREE.Mesh( groundGeometry, groundMaterial )
  ground.receiveShadow = true
  //ground.castShadow = true
  ground.rotation.x = -Math.PI / 2
  scene.add( ground )

  loader.load( '/gltf/pantalla.gltf', function ( gltf ) {
    const modelPantalla = gltf.scene.children[0].children[0].children[0]
    //model.position.set( 1, 1, 0 )
    modelPantalla.scale.set( 15, 15, 15)
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
    modelPanchera.position.set( 0, 0, 1.7 )
    modelPanchera.scale.set( 10, 10, 10)
    modelPanchera.castShadow = true
    //modelPanchera.material.envMap = envMap
    //modelPanchera.material.needsUpdate = true
    scene.add( modelPanchera )
    //console.log(modelPanchera)
  }, undefined, function ( e ) { console.error( e ) })
  //#endregion GROUND
  
  animate()

  function animate() {
    requestAnimationFrame( animate )
    time = clock.getElapsedTime() / DAYNIGHT_CYCLE_SPEED + WAKE_UP_TIME
    const fullTimeArc  = (Math.sin((time+Math.PI/4)*2)+1)/2
    const midArc = Math.cos(time)

    if (midArc > 0)
    sceneBg.value = chroma.mix( duskdawn, day, fullTimeArc, mixMethod ).gl()
    else
    //sceneBg.value = chroma.mix( duskdawn, day, fullTimeArc, mixMethod ).gl()
    sceneBg.value = chroma.mix( duskdawn, night, fullTimeArc, mixMethod ).gl()
    const color = new THREE.Color( sceneBg.value[0], sceneBg.value[1], sceneBg.value[2])
    
    scene.fog = new THREE.FogExp2( color, 0.2 )
    scene.background = color
    ambientLight.color = color
    ambientLight.intensity = Math.cos(time*2)*0.25+0.5
    lightSun.intensity = smoothstep( 0, 0.5, Math.cos(time) )
    lightMoon.intensity = smoothstep( 0, 0.5, Math.cos(time+Math.PI) )
    //lightSun.intensity = 0
    //lightMoon.intensity = 0

    lightGroup.rotation.z = time
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
  <div id="container" class="h-96 block overflow-hidden">
    <video id="video"
      loop
      crossOrigin="anonymous"
      playsinline
      style="display:none"
    >
      <source src="/planetario_old_film.mp4" type="video/mp4">
    </video>

    <div id="overlay" class="absolute p-8"><button id="startButton" class="btn">Play</button></div>
  </div>
</template>