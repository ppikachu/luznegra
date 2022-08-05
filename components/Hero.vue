<script setup>
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
//import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
//import { Sky } from 'three/examples/jsm/objects/Sky.js'

//import { EquirectangularReflectionMapping } from 'three/constants.js'

onMounted(() => {
  let mixer
  const SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024
  const clock = new THREE.Clock()
  const container = document.getElementById( 'container' )
  const scene = new THREE.Scene()

  const renderer = new THREE.WebGLRenderer( { antialias: true } )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( container.clientWidth, container.clientHeight )
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping =THREE. ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  // turn on the physically correct lighting model
  renderer.physicallyCorrectLights = true
  renderer.shadowMap.enabled = true
  container.appendChild( renderer.domElement )

  const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 )
  camera.near = 0.1
  camera.position.set( 0.5, 0.2, 2 )
  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()

  const controls = new OrbitControls( camera, renderer.domElement )
  controls.target.set( -0.1, 0.25, 0 )
  //controls.minAzimuthAngle = Math.PI*2
  //controls.maxAzimuthAngle = Math.PI*0.25
  //controls.minPolarAngle = Math.PI*0.25
  //controls.maxPolarAngle = Math.PI*0.55
  //controls.update()
  controls.enablePan = false
  controls.enableDamping = true

  // Add Sky
  //let sky = new Sky()
  //sky.scale.setScalar( 450000 )
  //scene.add( sky )
  const ambientlight = new THREE.AmbientLight(0x404040)
  //scene.add( ambientlight )

  const lightSun = new THREE.PointLight( 0xffffff, 5, 100 )
  lightSun.position.set( 1, 2, 1 )
  lightSun.castShadow = true
  lightSun.shadow.bias = 0.0001
  lightSun.shadow.mapSize.width = SHADOW_MAP_WIDTH;
  const lightMoon = new THREE.PointLight( 0x0011ff, 2, 100 )
  lightMoon.position.set( -1, -2, 1 )
  lightMoon.castShadow = true
  lightMoon.shadow.bias = 0.0001
  lightMoon.shadow.mapSize.height = SHADOW_MAP_HEIGHT

  const pointLightHelperSun = new THREE.PointLightHelper( lightSun, 0.1 );
  const pointLightHelperMoon = new THREE.PointLightHelper( lightMoon, 0.1 );
  scene.add( pointLightHelperSun, pointLightHelperMoon )

  const lightGroup = new THREE.Group()
  lightGroup.add( lightSun, lightMoon )
  scene.add( lightGroup )
  //modelos
  const loader = new GLTFLoader()

  // GROUND
  //loader.load( '/gltf/piso.gltf', function ( gltf ) {
  //  const modelPiso = gltf.scene.children[1]
  //  modelPiso.scale.set( 10, 10, 10)
  //  modelPiso.receiveShadow = true
  //  modelPiso.castShadow = true
  //  scene.add( modelPiso )
  //}, undefined, function ( e ) { console.error( e ) })

  const groundGeo = new THREE.PlaneGeometry( 10000, 10000 )
  const groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff } )
  const ground = new THREE.Mesh( groundGeo, groundMat )
  ground.rotation.x = - Math.PI / 2
  ground.receiveShadow = true
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

  // environment
  const hdrimgUrl = '/images/Studio_80s.hdr'
  const sceneBg = new THREE.Color( 0xffffff )
  scene.background = sceneBg
  //const pmremGenerator = new THREE.PMREMGenerator( renderer )
  //scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture
  scene.fog = new THREE.FogExp2( sceneBg, 0.25 )
  //const loadedTexture = new RGBELoader().load(hdrimgUrl, () => {
    //const envMap = loadedTexture
    //scene.environment = envMap
    //scene.environment.mapping = THREE.EquirectangularReflectionMapping
    //scene.environment.needsUpdate = true
  //})

  animate()

  window.onresize = function () {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight )
  }

  function animate() {
    requestAnimationFrame( animate )
    const delta = clock.getDelta()
    //mixer.update( delta )
    lightGroup.rotation.z += 0.001
    controls.update()
    renderer.render( scene, camera )
  }
})
</script>

<template>
  <div id="container" class="h-96 block overflow-hidden"></div>
</template>