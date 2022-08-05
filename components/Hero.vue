<script setup>
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

//import { EquirectangularReflectionMapping } from 'three/constants.js'

onMounted(() => {
  let mixer
  const clock = new THREE.Clock()
  const container = document.getElementById( 'container' )

  const renderer = new THREE.WebGLRenderer( { antialias: true } )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( container.clientWidth, container.clientHeight )
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true
  container.appendChild( renderer.domElement )

  const scene = new THREE.Scene()
  //scene.background = new THREE.Color( 0xbfe3dd )
  //const pmremGenerator = new THREE.PMREMGenerator( renderer )
  //scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture

  const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 )
  camera.near = 0.1
  camera.position.set( 0.5, 0.2, 2 )
  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()

  const controls = new OrbitControls( camera, renderer.domElement )
  controls.target.set( -0.1, 0.25, 0 )
  controls.minAzimuthAngle = Math.PI*2
  controls.maxAzimuthAngle = Math.PI*0.25
  controls.minPolarAngle = Math.PI*0.25
  controls.maxPolarAngle = Math.PI*0.55
  controls.update()
  controls.enablePan = false
  controls.enableDamping = true

  // Add Sky
  //let sky = new Sky()
  //sky.scale.setScalar( 450000 )
  //scene.add( sky )

  const light = new THREE.PointLight( 0xffffff, 1 )
  light.position.set( -1, 1, 1 )
  light.castShadow = true
  scene.add( light )
  console.log(light)

  const pointLightHelper = new THREE.PointLightHelper( light, 0.1 );
  scene.add( pointLightHelper )

  //modelos
  const loader = new GLTFLoader()

  // GROUND
  loader.load( '/gltf/piso.gltf', function ( gltf ) {
    const modelPiso = gltf.scene.children[1]
    modelPiso.scale.set( 10, 10, 10)
    modelPiso.receiveShadow = true
    scene.add( modelPiso )
    console.log(modelPiso)
  }, undefined, function ( e ) { console.error( e ) })

/*  const groundGeo = new THREE.PlaneGeometry( 10000, 10000 )
  const groundMat = new THREE.MeshLambertMaterial( { color: 0xffffff } )
  groundMat.color.setHSL( 0.095, 1, 0.75 )

  const ground = new THREE.Mesh( groundGeo, groundMat )
  ground.rotation.x = - Math.PI / 2
  ground.receiveShadow = true
  scene.add( ground )*/

  loader.load( '/gltf/pantalla.gltf', function ( gltf ) {
    const modelPantalla = gltf.scene.children[0].children[0].children[0]
    //model.position.set( 1, 1, 0 )
    modelPantalla.scale.set( 10, 10, 10)
    modelPantalla.receiveShadow = true
    modelPantalla.castShadow = true
    //modelPantalla.material.envMap = envMap
    modelPantalla.material.needsUpdate = true
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
  //scene.fog = new Fog( 0xddeeee, 0.45, 0.8 )
  const loadedTexture = new RGBELoader().load(hdrimgUrl, () => {
    const envMap = loadedTexture
    //scene.environment = envMap
    //scene.environment.mapping = THREE.EquirectangularReflectionMapping
    //scene.environment.needsUpdate = true
  })

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
    controls.update()
    renderer.render( scene, camera )
  }
})
</script>

<template>
  <div id="container" class="h-96 block overflow-hidden"></div>
</template>