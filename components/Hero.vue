<script setup>
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

onMounted(() => {
  let mixer
  const clock = new THREE.Clock()
  const container = document.getElementById( 'container' )

  const renderer = new THREE.WebGLRenderer( { antialias: true } )
  //renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( container.clientWidth, container.clientHeight )
  renderer.outputEncoding = THREE.sRGBEncoding
  container.appendChild( renderer.domElement )
  
  const pmremGenerator = new THREE.PMREMGenerator( renderer )

  const scene = new THREE.Scene()
  //scene.background = new THREE.Color( 0xbfe3dd )
  scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture

  const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 )
  camera.near = 0.01
  camera.position.set( 0.5, 0.2, 1 )
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

  const loader = new GLTFLoader()
  loader.load( '/gltf/web.glb', function ( gltf ) {

    const model = gltf.scene
    //model.position.set( 1, 1, 0 )
    model.scale.set( 5, 5, 5)
    scene.add( model )

    //mixer = new THREE.AnimationMixer( model )
    //mixer.clipAction( gltf.animations[ 0 ] ).play()

    animate()

  }, undefined, function ( e ) {
    console.error( e );
  })

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