<script setup>
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
//import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader.js'
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader.js'
//import { EquirectangularReflectionMapping } from 'three/constants.js'

onMounted(() => {
  let mixer
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
  scene.add( ambientlight )

  const lightSun = new THREE.PointLight( 0xffffff, 5, 100 )
  lightSun.position.set( 1, 2, 1 )
  lightSun.castShadow = true
  lightSun.shadow.bias = 0.0001
  const lightMoon = new THREE.PointLight( 0x0011ff, 2, 100 )
  lightMoon.position.set( -1, -2, 1 )
  lightMoon.shadow.bias = 0.0001
  lightMoon.castShadow = true

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
  const PLANE_WIDTH = 5;
  const PLANE_HEIGHT = 5;
  const CAMERA_HEIGHT = 0.3
  const state = {
    shadow: {
      blur: 0.5,
      darkness: 1,
      opacity: 1,
    },
    plane: {
      color: '#ffffff',
      opacity: 1,
    },
    showWireframe: false,
  }
  // the container, if you need to move the plane just move this
  const shadowGroup = new THREE.Group()
  shadowGroup.position.y = 0
  scene.add( shadowGroup )
  // the render target that will show the shadows in the plane texture
  const renderTarget = new THREE.WebGLRenderTarget( 512, 512 )
  renderTarget.texture.generateMipmaps = false
  // the render target that we will use to blur the first render target
  const renderTargetBlur = new THREE.WebGLRenderTarget( 512, 512 )
  renderTargetBlur.texture.generateMipmaps = false

  const planeGeometry = new THREE.PlaneGeometry( PLANE_WIDTH, PLANE_HEIGHT ).rotateX( Math.PI / 2 )
  //const groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff } )
  const planeMaterial = new THREE.MeshBasicMaterial( {
    map: renderTarget.texture,
    opacity: state.shadow.opacity,
    transparent: true,
    depthWrite: false,
  } )

  const plane = new THREE.Mesh( planeGeometry, planeMaterial )
  plane.renderOrder = 1
	shadowGroup.add( plane )
  // the y from the texture is flipped!
	plane.scale.y = - 1

  // the plane onto which to blur the texture
  const blurPlane = new THREE.Mesh( planeGeometry )
  blurPlane.visible = false;
  shadowGroup.add( blurPlane );

  // the plane with the color of the ground
  const fillPlaneMaterial = new THREE.MeshBasicMaterial( {
    color: state.plane.color,
    opacity: state.plane.opacity,
    transparent: true,
    depthWrite: false,
  } )
  const fillPlane = new THREE.Mesh( planeGeometry, fillPlaneMaterial )
  fillPlane.rotateX( Math.PI )
  shadowGroup.add( fillPlane )

  // the camera to render the depth material from
  const shadowCamera = new THREE.OrthographicCamera( - PLANE_WIDTH / 2, PLANE_WIDTH / 2, PLANE_HEIGHT / 2, - PLANE_HEIGHT / 2, 0, CAMERA_HEIGHT );
  shadowCamera.rotation.x = Math.PI / 2; // get the camera to look up
  shadowGroup.add( shadowCamera )

  const cameraHelper = new THREE.CameraHelper( shadowCamera )
  //shadowGroup.add( cameraHelper )

  // like MeshDepthMaterial, but goes from black to transparent
  const depthMaterial = new THREE.MeshDepthMaterial();
  depthMaterial.userData.darkness = { value: state.shadow.darkness };
  depthMaterial.onBeforeCompile = function ( shader ) {

    shader.uniforms.darkness = depthMaterial.userData.darkness;
    shader.fragmentShader = /* glsl */`
      uniform float darkness;
      ${shader.fragmentShader.replace(
    'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
    'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );'
  )}
    `;

  };

  depthMaterial.depthTest = false;
  depthMaterial.depthWrite = false;

  const horizontalBlurMaterial = new THREE.ShaderMaterial( HorizontalBlurShader );
  horizontalBlurMaterial.depthTest = false;

  const verticalBlurMaterial = new THREE.ShaderMaterial( VerticalBlurShader );
  verticalBlurMaterial.depthTest = false

  //ground.rotation.x = - Math.PI / 2
  //ground.receiveShadow = true
  //scene.add( ground )

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
  //scene.fog = new THREE.FogExp2( sceneBg, 0.2 )
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

  function blurShadow( amount ) {

    blurPlane.visible = true;

    // blur horizontally and draw in the renderTargetBlur
    blurPlane.material = horizontalBlurMaterial;
    blurPlane.material.uniforms.tDiffuse.value = renderTarget.texture;
    horizontalBlurMaterial.uniforms.h.value = amount * 1 / 256;

    renderer.setRenderTarget( renderTargetBlur );
    renderer.render( blurPlane, shadowCamera );

    // blur vertically and draw in the main renderTarget
    blurPlane.material = verticalBlurMaterial;
    blurPlane.material.uniforms.tDiffuse.value = renderTargetBlur.texture;
    verticalBlurMaterial.uniforms.v.value = amount * 1 / 256;

    renderer.setRenderTarget( renderTarget );
    renderer.render( blurPlane, shadowCamera );
    blurPlane.visible = false
  }

  function animate() {
    requestAnimationFrame( animate )
    const delta = clock.getDelta()
    //mixer.update( delta )
    // remove the background
    const initialBackground = scene.background;
    scene.background = null;

    // force the depthMaterial to everything
    cameraHelper.visible = false;
    scene.overrideMaterial = depthMaterial;

    // set renderer clear alpha
    const initialClearAlpha = renderer.getClearAlpha();
    renderer.setClearAlpha( 0 );

    // render to the render target to get the depths
    renderer.setRenderTarget( renderTarget );
    renderer.render( scene, shadowCamera );

    // and reset the override material
    scene.overrideMaterial = null;
    cameraHelper.visible = true;

    blurShadow( state.shadow.blur );

    // a second pass to reduce the artifacts
    // (0.4 is the minimum blur amout so that the artifacts are gone)
    blurShadow( state.shadow.blur * 0.4 );

    // reset and render the normal scene
    renderer.setRenderTarget( null );
    renderer.setClearAlpha( initialClearAlpha );
    scene.background = initialBackground

    lightGroup.rotation.z += 0.001
    //shadowCamera.rotation.x += 0.001
    controls.update()
    renderer.render( scene, camera )
  }
})
</script>

<template>
  <div id="container" class="h-96 block overflow-hidden"></div>
</template>