<script setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js'
import { ShadowMapViewer } from 'three/examples/jsm/utils/ShadowMapViewer.js'
//import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import chroma from 'chroma-js'
import gsap from 'gsap'
import isMobile from 'ismobilejs'
import { Pane } from 'tweakpane'

const params = {
  mouseFollow: true,
  spring: 0.03,
  friction: 0.97,
  mass: 0.05,
  dayOrNight: "night",
  dayNightSpeed: 0.25,
  dayNightDelay: 1,

  fx: false,
  bloomOn: false,
  bloomStrength: 0.6,
  bloomThreshold: 0.25,
  bloomRadius: 0.1,
  saoOn: false,

  groundColor: 'rgb(63, 86, 40)',
  daySkyColor: 'rgb(170, 238, 255)',
  nightSkyColor: 'rgb(1, 9, 36)',
  fogDensityDay: 0.05,
  fogDensityNight: 0.08,
  shadowPlaneSize: 6,
  pantallaEmissive: 2,
  screenLightColor: 'rgb(17, 17, 51)',
  screenIntensity: 3,

  showLightsHelpers: false,
  lightSunColor: 'rgb(157, 170, 175)',
  lightSunIntensity: 0.9,
  lightSunPosition: new THREE.Vector3( -1.4, 5, 6 ),
  lightMoonColor: 'rgb(152, 1, 4)',
  lightMoonIntensity: 0.5,
  lightMoonPosition: new THREE.Vector3( -5, 5, -1 ),
}

const debug = {
  showGround: true,
  showGLTFs: true,
  showPantalla: true,
  showAmbientLight: true,
  showLights: true,
  animate: true
}

const route = useRoute()
const initialSceneRotation = { x: Math.PI*0.1, y: Math.PI*0.2 }
const cameraOrthoPos = {
  x: 0,
  y: 0.5,
  z: 10
}
const frustumDesktopSize = 4
const frustumMobileSize = 7

//const mixMethod = 'rgb' //opciones: rgb, hsl, lab, lch, lrgb
//const turntableLimitY = Math.PI*0.1

const heroBgColor = ref()
const loadedModels = ref(false)
const dayNight = ref(params.dayOrNight)

let container,scene, camera, renderer, composer, bloomPass, saoPass,
lightSun, lightMoon, ambientLight, lightAreaMoon, rectLight, rectLightB,
rectLightHelper, rectLightHelperB, lightHelperSun, lightHelperMoon, dirLightShadowMapViewer, spotLightShadowMapViewer,
groundGeometry, ground, modelPanchera, modelPantalla,
groundMaterial, telonMaterial, driverLuzPantalla = { intensity: params.dayOrNight === 'night' ? 2 : 0 },
shadowSize, groundSize = 30, frustumSize,
pane, dayFolder, nightFolder, preset = { debug: '' }, presetDebug,
amIMobile, windowHalfX, previousX, deltaY = 0, vx = 0, mouseX = 0, timer,
gamma = 0, previousGamma = 0, deltaGamma, finalRotation

onMounted(() => {
  //Setup
  init()

  //Models, lights, fog, etc
  props()

  //Listeners
  document.addEventListener( 'mousemove', onDocumentMouseMove )
  window.addEventListener( 'resize', onWindowResize )
  onWindowResize()

  document.addEventListener( 'scroll', handleScroll )
  window.addEventListener( 'deviceorientation', handleOrientation )

  //Tweakpane
  if(route.name == 'onoff' || route.name == 'test') makeTweak()
})

function swapHeroBgColor() {
  heroBgColor.value = params.dayOrNight === 'day'?
  //HACK: hardcoded hero colors:
  chroma(params.groundColor).brighten(1.9) :
  chroma(params.lightMoonColor).darken(2)
}

function handleScroll() {
    if(timer) window.clearTimeout(timer)

    timer = window.setTimeout(() => {
      const lastKnownScrollPosition = window.scrollY
      //disable animation in scene past scrolling
      debug.animate = lastKnownScrollPosition > container.clientHeight ? false : true
    }, 100)
}

function handleOrientation(event) {
  //const absolute = event.absolute
  gamma    = event.gamma
}

function init() {
  amIMobile = isMobile().any
  frustumSize = amIMobile ? frustumMobileSize : frustumDesktopSize
  shadowSize = amIMobile ? 512 : 2048
  swapHeroBgColor()
  //#region sceneSetup
  container = document.getElementById( 'container' )
  windowHalfX = container.clientWidth / 2
  scene = new THREE.Scene()

  renderer = new THREE.WebGLRenderer({
    antialias: amIMobile ? false : true,
  })
  //renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( container.clientWidth, container.clientHeight )
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true
  //renderer.shadowMap.type = THREE.PCFShadowMap
  THREE.ColorManagement.legacyMode = true
  //renderer.toneMapping = THREE.ReinhardToneMapping
  //renderer.toneMappingExposure = 1
  // turn on the physically correct lighting model
  //renderer.physicallyCorrectLights = true
  //scene.background = color
  container.appendChild( renderer.domElement )

  //CAMERA
  const aspect = container.clientWidth / container.clientHeight
  camera = new THREE.OrthographicCamera(
    frustumSize / 2 * -aspect , frustumSize / 2 * aspect,
    frustumSize / 2, frustumSize / -2,
    0, 50
  )
  camera.position.set(cameraOrthoPos.x, cameraOrthoPos.y, cameraOrthoPos.z)
  //lighthelper layer
  camera.layers.enable(1)

  //#region Lights
  lightSun = new THREE.DirectionalLight()
  lightSun.color.set( params.lightSunColor )
  lightSun.intensity = params.dayOrNight === 'day' ? params.lightSunIntensity : 0
  lightSun.position.set( params.lightSunPosition.x, params.lightSunPosition.y, params.lightSunPosition.z )
  lightSun.lookAt( 0, 0, 0 )
  lightSun.castShadow = true
  lightSun.shadow.mapSize.width = shadowSize
  lightSun.shadow.mapSize.height = shadowSize
  lightSun.shadow.camera.near = 1
  lightSun.shadow.camera.far = 50
  lightSun.shadow.camera.left = -params.shadowPlaneSize
  lightSun.shadow.camera.right = params.shadowPlaneSize
  lightSun.shadow.camera.top = params.shadowPlaneSize
  lightSun.shadow.camera.bottom = -params.shadowPlaneSize

  lightMoon = new THREE.DirectionalLight()
  lightMoon.color.set( params.lightMoonColor )
  lightMoon.intensity = params.dayOrNight === 'day' ? 0 : params.lightMoonIntensity
  lightMoon.position.set( params.lightMoonPosition.x, params.lightMoonPosition.y, params.lightMoonPosition.z )
  lightMoon.lookAt( 0, 0, 0 )
  lightMoon.castShadow = true
  lightMoon.shadow.mapSize.width = shadowSize
  lightMoon.shadow.mapSize.height = shadowSize
  lightMoon.shadow.camera.near = 1
  lightMoon.shadow.camera.far = 50
  lightMoon.shadow.camera.left = -params.shadowPlaneSize
  lightMoon.shadow.camera.right = params.shadowPlaneSize
  lightMoon.shadow.camera.top = params.shadowPlaneSize
  lightMoon.shadow.camera.bottom = -params.shadowPlaneSize
  
  //ambient
  ambientLight = new THREE.AmbientLight()
  ambientLight.color.set( params.dayOrNight === 'day' ? params.lightSunColor : params.lightMoonColor )
  //lighthelpers
  lightHelperSun  = new THREE.CameraHelper( lightSun.shadow.camera )
  lightHelperMoon = new THREE.CameraHelper( lightMoon.shadow.camera )
  //lighthelper layers
  lightHelperSun.layers.set( 1 )
  lightHelperMoon.layers.set( 1 )
  scene.add( lightSun, lightMoon, ambientLight, lightHelperSun, lightHelperMoon )
  //#endregion Lights
  
  //Mueve la escena para que se vea con el angulo elegido
  //scene.position.set(0, 0, -7)
  scene.rotation.x = initialSceneRotation.x
  scene.rotation.y = initialSceneRotation.y
  //#endregion sceneSetup
  
  //#region environmentSetup
  //const pmremGenerator = new THREE.PMREMGenerator( renderer )
  //scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture

  /*const loadedTexture = new RGBELoader().load(hdrimgUrl, () => {
    const envMap = loadedTexture
    scene.environment = envMap
    scene.environment.mapping = THREE.EquirectangularReflectionMapping
    scene.environment.needsUpdate = true
  })*/
  //#endregion environmentSetup

  //#region postprocessing
  /*if (!amIMobile) {
    const renderScene = new RenderPass( scene, camera )
    composer = new EffectComposer( renderer )
    composer.addPass( renderScene )

    if (params.bloomOn) {
      bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1, 0.4, 0.85 )
      bloomPass.threshold = params.bloomThreshold
      bloomPass.strength = params.bloomStrength
      bloomPass.radius = params.bloomRadius
      composer.addPass( bloomPass )
    }
    if (params.saoOn) { 
      saoPass = new SAOPass( scene, camera, false, true )
      saoPass.saoMinResolution = 0
      saoPass.saoKernelRadius = 50
      saoPass.saoIntensity = 0.01
      composer.addPass( saoPass )
    }
  }*/
  //#endregion postprocessing
}

async function props() {
  //#region GROUND
  if (debug.showGround) {
    groundGeometry = new THREE.PlaneBufferGeometry( groundSize, groundSize )
    groundMaterial = new THREE.MeshStandardMaterial( { color: params.groundColor } )
    ground = new THREE.Mesh( groundGeometry, groundMaterial )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    //ground.castShadow = true
    scene.add( ground )
  }

  if (debug.showGLTFs) {
    const models = await loadModels()
    scene.add( models.modelPanchera, models.modelPantalla )
    console.log(scene);
  }

  scene.fog = params.dayOrNight === 'day' ? new THREE.FogExp2(params.daySkyColor, params.fogDensityDay ) : new THREE.FogExp2(params.nightSkyColor, params.fogDensityNight )
  //#endregion GROUND
  
  //Inicia proyector
  if(debug.showPantalla) initProjector()
  if (!params.showLightsHelpers) camera.layers.disable( 1 )
  //Animation
  animate()
}

async function loadModels() {
  const loader = new GLTFLoader()

  const [pancheraData, pantallaData] = await Promise.all([
    loader.loadAsync('/gltf/panchera_v1/panchera.gltf'),
    loader.loadAsync('/gltf/pantalla_v1/pantalla.gltf'),
  ])

  modelPanchera = setupModel(pancheraData)
  modelPanchera.scale.set( 15, 15, 15)
  modelPanchera.position.set( 0, 0, 1.7 )
  modelPanchera.material.emissiveIntensity = 1
  modelPanchera.updateMatrix()

  modelPantalla = setupModel(pantallaData)
  modelPantalla.scale.set( 15, 15, 15)
  modelPantalla.material.side = THREE.DoubleSide
  modelPantalla.updateMatrix()

  loadedModels.value = true
  return { modelPanchera, modelPantalla }
}

function setupModel(modelData) {
  const model = modelData.scene.children[0].children[0].children[0]
  model.material.emissiveIntensity = params.dayOrNight === 'day' ? 0 : params.emissiveIntensity
  model.castShadow = true
  model.matrixAutoUpdate = false
  return model
}

function initProjector() {
  //RectAreaLightUniformsLib.init()
  const video = document.getElementById( 'video' )
  const telonSize = new THREE.Vector2( 2.12, 1.25 )
  const telonGeometry = new THREE.PlaneGeometry( telonSize.x, telonSize.y )
  const telonTexture = new THREE.VideoTexture( video )
  telonTexture.encoding = THREE.sRGBEncoding
  //telonTexture.minFilter = THREE.LinearFilter
  telonMaterial = new THREE.MeshBasicMaterial({ map: telonTexture })
  const telon = new THREE.Mesh( telonGeometry, telonMaterial )
  const telonPosition = new THREE.Vector3(0, 0.9, -0.001 )
  telon.position.set(telonPosition.x, telonPosition.y, telonPosition.z)
  scene.add( telon )
  video.play()

  //proyector light to front
  rectLight = new THREE.RectAreaLight( params.screenLightColor, params.screenIntensity, telonSize.x, telonSize.y )
  rectLight.position.set( telonPosition.x, telonPosition.y, telonPosition.z - 0.01 )
  rectLight.lookAt( telonPosition.x, telonPosition.y, telonPosition.z+1 )
  //proyector light to self
  rectLightB = new THREE.RectAreaLight( params.screenLightColor, params.screenIntensity, telonSize.x, telonSize.y )
  rectLightB.position.set( telonPosition.x, telonPosition.y, telonPosition.z + 0.2 )
  rectLightB.lookAt( telonPosition.x, telonPosition.y, telonPosition.z-1 )

  scene.add( rectLight, rectLightB )

  rectLightHelper = new RectAreaLightHelper( rectLight )
  rectLightHelperB = new RectAreaLightHelper( rectLightB )
  rectLightHelper.layers.set( 1 )
  rectLightHelperB.layers.set( 1 )
  scene.add( rectLightHelper, rectLightHelperB )
}

function swapDayNight() {
  const previousSunPosition = params.lightSunPosition
  const previousMoonPosition = params.lightMoonPosition
  if (params.dayOrNight === 'night') {
    //DAY:
    params.dayOrNight = dayNight.value = 'day'
    var tlday = gsap.timeline()
    //move lightShadows position
    tlday.to(lightMoon.position, { x: previousSunPosition.x, y: previousSunPosition.y, z: previousSunPosition.z, duration: params.dayNightSpeed })
    tlday.to(lightSun.position, { x: previousSunPosition.x, y: previousSunPosition.y, z: previousSunPosition.z, duration: params.dayNightSpeed }, '<')
    tlday.to([ lightMoon, lightAreaMoon ], { intensity: 0, duration: params.dayNightSpeed, onComplete: function () {
      //STEPPED:
      ambientLight.color.set( params.lightSunColor )
      //swap bg color de seccion nosotros
      swapHeroBgColor()
      scene.fog = new THREE.FogExp2( params.daySkyColor, params.fogDensityDay )
    } }, '<')
    //fade in:
    tlday.to([ lightSun, ambientLight], { intensity: params.lightSunIntensity, duration: params.dayNightSpeed }, '<')
    //turn off modelPanchera inner emissive
    tlday.to(modelPanchera.material, { emissiveIntensity: 0, duration: params.dayNightSpeed, delay: params.dayNightDelay })
    driverLuzPantalla.intensity = 0
    tlday.play()
  } else {
    //NIGHT:
    params.dayOrNight = dayNight.value = 'night'
    var tlnight = gsap.timeline()
    //move lightShadow position
    tlnight.to(lightSun.position, { x: previousMoonPosition.x, y: previousMoonPosition.y, z: previousMoonPosition.z, duration: params.dayNightSpeed })
    tlnight.to(lightMoon.position, { x: previousMoonPosition.x, y: previousMoonPosition.y, z: previousMoonPosition.z, duration: params.dayNightSpeed }, '<')
    tlnight.to([ lightSun, ambientLight], { intensity: 0, duration: params.dayNightSpeed, onComplete: function () {
      //STEPPED:
      ambientLight.color.set( params.lightMoonColor )
      //swap bg color de seccion nosotros
      swapHeroBgColor()
      scene.fog = new THREE.FogExp2( params.nightSkyColor, params.fogDensityNight )
    } }, '<')
    tlnight.to([ lightMoon, ambientLight], { intensity: params.lightMoonIntensity, duration: params.dayNightSpeed }, '<')
    //turn on modelPanchera inner emissive
    tlnight.to(modelPanchera.material, { emissiveIntensity: 1, duration: params.dayNightSpeed, ease: "back.out(4)", delay: params.dayNightDelay })
    tlnight.to([ driverLuzPantalla], { intensity: params.pantallaEmissive, duration: params.dayNightSpeed*3 })
    tlnight.play()
  }

  //hide tweakpane sections
  if (pane) {
    dayFolder.hidden = params.dayOrNight === 'day' ? false : true
    nightFolder.hidden = params.dayOrNight === 'night' ? false : true
  }
}

function updateScene() {
  //lighthelpers
  if (params.showLightsHelpers) camera.layers.enable( 1 )
  else camera.layers.disable( 1 )
  //FX
  if (params.bloomOn) {
    bloomPass.threshold = params.bloomThreshold
    bloomPass.strength = params.bloomStrength
    bloomPass.radius = params.bloomRadius
  }
  if (params.dayOrNight === 'day') {
    //Actualiza el ambiente
    ambientLight.color.set( lightSun.color )
    ambientLight.intensity = lightSun.intensity
    //luz y sombra
    lightSun.position.set( params.lightSunPosition.x, params.lightSunPosition.y, params.lightSunPosition.z )
    lightSun.intensity = params.lightSunIntensity
    lightSun.color.set( params.lightSunColor )
    //fog
    scene.fog = new THREE.FogExp2( params.daySkyColor, params.fogDensityDay )
  } else {
    //Actualiza el ambiente
    ambientLight.color.set( lightMoon.color )
    ambientLight.intensity = lightMoon.intensity = params.lightMoonIntensity
    //luz y sombra
    lightMoon.position.set( params.lightMoonPosition.x, params.lightMoonPosition.y, params.lightMoonPosition.z )
    lightMoon.intensity = params.lightMoonIntensity
    lightMoon.color.set( params.lightMoonColor )
    //fog
    scene.fog = new THREE.FogExp2( params.nightSkyColor, params.fogDensityNight )
  }
  groundMaterial.color.set(params.groundColor)
  swapHeroBgColor()
  //shadowmaps:
  lightSun.shadow.camera.left     = -params.shadowPlaneSize
  lightSun.shadow.camera.right    =  params.shadowPlaneSize
  lightSun.shadow.camera.top      =  params.shadowPlaneSize
  lightSun.shadow.camera.bottom   = -params.shadowPlaneSize

  lightMoon.shadow.camera.left    = -params.shadowPlaneSize
  lightMoon.shadow.camera.right   =  params.shadowPlaneSize
  lightMoon.shadow.camera.top     =  params.shadowPlaneSize
  lightMoon.shadow.camera.bottom  = -params.shadowPlaneSize
}

function animate() {
  requestAnimationFrame(animate)
  if (!debug.animate) return
  const clock = Math.round(performance.now()*0.021)
  const flick = clock % 2 == 0 ? 0.6 : 1
  const flickB = clock % 4 == 0 ? 0.7 : 1

  //projector flickering
  if (debug.showPantalla && !amIMobile) {
    rectLight.intensity = params.screenIntensity - flick
    rectLightB.intensity = params.screenIntensity - flickB
  }

  //luz negra screen flickering / 0.3 de dia
  modelPantalla.material.emissiveIntensity = (params.dayOrNight == 'night' && modelPantalla) ? driverLuzPantalla.intensity * flick : 0.3

  //mouse follow?
  if (params.mouseFollow && !amIMobile) {
    var dx = mouseX - scene.rotation.x,
    ax = dx * params.spring
    vx += ax
    vx *= params.friction
    deltaY = (vx - previousX)*params.mass
    previousX = vx
    scene.rotation.y = deltaY + initialSceneRotation.y //rotación (encuadre) inicial
  } else {
    deltaGamma = (gamma - previousGamma)
    ax = deltaGamma * params.spring
    vx += ax
    vx *= params.friction
    finalRotation = (vx - previousGamma) * params.mass
    if (Math.abs(finalRotation)>0.001) scene.rotation.y = finalRotation + initialSceneRotation.y //rotación (encuadre) inicial
    previousGamma = vx
  }
  //limit camera rotation:
  //if (scene.rotation.y < turntableLimitY) scene.rotation.y = turntableLimitY 
  renderer.render( scene, camera )
}

function makeTweak() {
  pane = new Pane({ container: document.getElementById('parameters') })
  pane.on('change', (ev) => {
    updateScene()
    presetDebug.hidden = true
  })
  //PARAMETROS
  pane.addInput(params, 'groundColor', { view:'color', label: 'color piso' })
  pane.addInput(params, 'screenIntensity', { label: 'proyección', min: 0.1, max: 5, step: 0.1 })
  pane.addSeparator()
  pane.addInput(params, 'shadowPlaneSize', {label: 'tamaño luz', min: 0.1, max: 10, step: 0.01})
  //MOVEMENT
  const motionFolder = pane.addFolder({ title: 'MOVIMIENTO', expanded: false })
  motionFolder.addInput(params, 'mouseFollow', { label: 'seguir cursor' })
  motionFolder.addInput(params, 'spring', { type: 'number', min: 0, max: 0.5, step: 0.01, label: 'spring' })
  motionFolder.addInput(params, 'friction', { type: 'number', min: 0.9, max: 1, step: 0.01, label: 'friction' })
  motionFolder.addInput(params, 'mass', { type: 'number', min: 0, max: 0.1, step: 0.01, label: 'mass' })
  //DAY
  dayFolder = pane.addFolder({ title: 'DIA', expanded: true, hidden: params.dayOrNight === 'day' ? false : true })
  dayFolder.addInput(params, 'lightSunColor', { label: 'color sol' })
  dayFolder.addInput(params, 'lightSunIntensity', { type: 'number', min: 0, max: 3, step: 0.01, label: 'power sol' })
  dayFolder.addInput(params, 'lightSunPosition', { label: 'posicion sol', x: { min: -10, max: 10, step: 0.1 }, y: { min: 5, max: 10, step: 0.1 }, z: { min: -10, max: 10, step: 0.1 } })
  dayFolder.addSeparator()
  dayFolder.addInput(params, 'daySkyColor', { label: 'cielo dia' })
  dayFolder.addInput(params, 'fogDensityDay', { type: 'number', min: 0, max: 0.2, step: 0.001, label: 'niebla dia' })
  //NIGHT
  nightFolder = pane.addFolder({ title: 'NOCHE', expanded: true, hidden: params.dayOrNight === 'night' ? false : true })
  nightFolder.addInput(params, 'lightMoonColor', {  label: 'color luna' })
  nightFolder.addInput(params, 'lightMoonIntensity', { type: 'number', min: 0, max: 3, step: 0.01, label: 'power luna' })
  nightFolder.addInput(params, 'lightMoonPosition', { label: 'posición luna', x: { min: -10, max: 10, step: 0.1 }, y: { min: 5, max: 10, step: 0.1 }, z: { min: -10, max: 10, step: 0.1 } })
  nightFolder.addSeparator()
  nightFolder.addInput(params, 'nightSkyColor', { label: 'cielo noche' })
  nightFolder.addInput(params, 'fogDensityNight', { type: 'number', min: 0, max: 0.2, step: 0.001, label: 'niebla noche' })
  //DEBUG
  const debugFolder = pane.addFolder({ title: 'DEBUG', expanded: false })
  debugFolder.addInput(params, 'showLightsHelpers', { label: 'ayuda luz' })
  const btn = debugFolder.addButton({
    title: 'export',
  })
  btn.on('click', () => {
   exportPreset()
  })
  presetDebug = debugFolder.addMonitor(preset, 'debug', {
    label: 'preset',
    multiline: true,
    lineCount: 10,
    hidden: true,
  })
}

function exportPreset() {
  preset.debug = JSON.stringify(pane.exportPreset(), null, 1)
  presetDebug.hidden = false
}

function onDocumentMouseMove(event) {
  mouseX = ( event.clientX - windowHalfX )
}

function onWindowResize() {
  const aspect = container.clientWidth / container.clientHeight
  camera.left = - 0.5 * frustumSize * aspect
  camera.right = 0.5 * frustumSize * aspect
  camera.top = frustumSize / 2;
  camera.bottom = - frustumSize / 2;
  camera.updateProjectionMatrix()
  renderer.setSize( container.clientWidth, container.clientHeight )
  //if (!amIMobile) composer.setSize( container.clientWidth, container.clientHeight )
}

function smoothstep (min, max, value) {
  var x = Math.max(0, Math.min(1, (value-min)/(max-min)))
  return x*x*(3 - 2*x)
}

onUnmounted(() => {
  renderer.dispose()
  if (debug.showLights) {
    //ambientLightSun.dispose()
    //ambientLightMoon.dispose()
    lightSun.dispose()
    lightMoon.dispose()
  }
  if (debug.showLightsHelpers) {
    lightHelperSun.dispose()
    lightHelperMoon.dispose()
    rectLightHelper.dispose()
    rectLightHelperB.dispose()
  }
  //get rid of makeTweak
  if (pane) pane.dispose()
  //get rid of listeners
  document.removeEventListener('mousemove', onDocumentMouseMove)
  window.removeEventListener('resize', onWindowResize)
  document.removeEventListener('scroll', handleScroll)
  window.removeEventListener('deviceorientation', handleOrientation)

})
</script>

<template>
  <div class="relative">
    <div id="container" class="hero relative overflow-hidden pb-16">
      <!--video for threejs-->
      <video v-if="debug.showPantalla" id="video"
        loop
        muted
        crossOrigin="anonymous"
        playsinline
        style="display:none"
      >
        <source src="/images/pantalla.mp4" type="video/mp4">
      </video>
      <!--bottom linear-gradient-->
      <div
        class =  "absolute bottom-0 h-1/6 w-full"
        :style = "`background: linear-gradient(0deg, ${heroBgColor} 0%, transparent 100%);`"
      ></div>
      <!--SWITCH-->
      <div class="absolute bottom-16 md:bottom-0 text-xl flex justify-center w-full">
        <div class="form-control">
          <label class="label cursor-pointer space-x-2">
            <svg :class="{'opacity-25': dayNight === 'day'}" class="swap-off fill-slate-100 w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
            <input type="checkbox" @click="swapDayNight" class="toggle toggle-lg " />
            <svg :class="{'opacity-25': dayNight === 'night'}" class="swap-on fill-slate-100 w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
          </label>
        </div>
      </div>
      <div v-if="route.name == 'onoff' || route.name == 'test'" id="debugger" class="absolute w-80 right-0 top-0 p-4">
        <div id="parameters"></div>
      </div>
    </div>
    <AboutUs :class="{'text-base-100' : dayNight === 'day'}" :style="`background-color: ${heroBgColor}`" />
    <div v-if="!loadedModels" class="absolute top-0 w-full h-screen flex justify-center items-center" :style="`background-color: ${heroBgColor}`">
      <img src="/images/tubos_loop_ani.png" alt="loading..." class="w-32">
    </div>
  </div>
</template>
<style scoped>
#container {
  height: 95vh;
}
</style>