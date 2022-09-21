<script setup lang="ts">
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
//import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
//import { ShadowMapViewer } from 'three/examples/jsm/utils/ShadowMapViewer.js'

import { useSound } from '@vueuse/sound'
import chroma from 'chroma-js'
import gsap from 'gsap'
import isMobile from 'ismobilejs'
import { Pane } from 'tweakpane'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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
  fogLinearNearDay: 15,
  fogLinearFarDay: 30,
  fogLinearNearNight: 15,
  fogLinearFarNight: 30,
  fogDensityDay: 0.05,
  fogDensityNight: 0.05,
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
  cameraOrthoPos: { x: 0, y: 0, z: 20 },
  initialSceneRotation: { x: Math.PI/2.6, y: Math.PI*0.15 },
}

const debug = {
  showLightHelpers: false,
  showGround: true,
  showGLTFs: true,
  showPantalla: true,
  showAmbientLight: true,
  showLights: true,
  animate: true
}

const modelScale = 15
const frustumDesktopSize = 4, frustumMobileSize = 7
const telonWidth = .145
const telonSize = { x: telonWidth, y: telonWidth / (16/9) }
const telonPosition = { x: 0, y: 0.06, z: -0.001 }
const telonGeometry = new THREE.PlaneGeometry( telonSize.x, telonSize.y )
const sound = useSound('/audio/Click02.mp3',{ volume: 0.25 })

const route = useRoute()
const heroBgColor = ref()
const loadedModels = ref(false)
const dayNight = ref(params.dayOrNight)
const target = ref(null)

const
groundSize = 30,
groundMaterial = new THREE.MeshStandardMaterial( { color: params.groundColor } ),
groundGeometry = new THREE.PlaneGeometry( groundSize, groundSize ),
ground = new THREE.Mesh( groundGeometry, groundMaterial )

const
ambientLight = new THREE.AmbientLight(),
lightSun = new THREE.DirectionalLight(),
lightMoon = new THREE.DirectionalLight(),
rectLight = new THREE.RectAreaLight( params.screenLightColor, params.screenIntensity, telonSize.x*modelScale, telonSize.y*modelScale ),
rectLightB = new THREE.RectAreaLight( params.screenLightColor, params.screenIntensity, telonSize.x*modelScale, telonSize.y*modelScale )

const scene = new THREE.Scene(),
pantallaGroup = new THREE.Group()

let
driverLuzPantalla = { intensity: params.dayOrNight === 'night' ? 2 : 0 },
modelPanchera, modelPantalla,
container: HTMLElement, camera, renderer,
rectLightHelper, rectLightHelperB, lightHelperSun, lightHelperMoon, telonMaterial, telon, telonTexture,
shadowSize: number, frustumSize: number,
pane, dayFolder, nightFolder, extraFolder, cameraFolder, preset = { debug: '' }, presetDebug: { hidden: boolean },
amIMobile: boolean, timer: number, controls

swapHeroBgColor()

onMounted(() => {
  //Setup
  init()

  //Models, lights, fog, etc
  props()

  //Listeners
  window.addEventListener( 'resize', onWindowResize )
  onWindowResize()

  document.addEventListener( 'scroll', handleScroll )

  //Tweakpane
  if( route.name == 'test') makeTweak()
})

//#region FUNCTIONS
function fadeScene(time:number) {
  gsap.to( document.getElementById('fader'), { opacity: 0, duration: time, onComplete: ()=> { loadedModels.value = true} })
}

function swapHeroBgColor() {
  heroBgColor.value = params.dayOrNight === 'day'?
  //HACK: hardcoded hero colors:
  chroma(params.groundColor).brighten(1.8) :
  chroma(params.lightMoonColor).darken(1.3)
}

function setFog( cycle:string ) {
  return new THREE.Fog(
    cycle === 'day' ? params.daySkyColor : params.nightSkyColor,
    cycle === 'day' ? params.fogLinearNearDay : params.fogLinearNearNight,
    cycle === 'day' ? params.fogLinearFarDay : params.fogLinearFarNight
  )
}

function handleScroll() {
    if(timer) window.clearTimeout(timer)

    timer = window.setTimeout(() => {
      const lastKnownScrollPosition = window.scrollY
      //disable animation in scene past scrolling
      debug.animate = lastKnownScrollPosition > container.clientHeight ? false : true
    }, 100)
}

function doDayNightCycle () {
  sound.play()
  swapDayNight()
}
//pantalla:
function setupModel(modelData) {
  const model = modelData.scene.children[0].children[0].children[0]
  model.material.side = THREE.DoubleSide
  model.material.emissiveMap.minFilter = THREE.LinearFilter
  model.material.map.minFilter = THREE.LinearFilter

  console.log(model.material)
  
  model.castShadow = true
  model.matrixAutoUpdate = false
  return model
}
//auto:
function setupModelB(modelData) {
  const model = modelData.scene.children[0].children[0].children[0]
  model.material.side = THREE.DoubleSide
  model.material.emissiveMap.minFilter = THREE.LinearFilter
  model.material.map.minFilter = THREE.LinearFilter
  model.material.emissiveIntensity = 1
  model.scale.set( 1.5, 1.5, 1.5)
  model.position.set( 0, 0, 2 )
  model.castShadow = true
  model.updateMatrix()
  model.matrixAutoUpdate = false
  return model
}

function initProjector() {
  //RectAreaLightUniformsLib.init()
  const video = document.getElementById( 'video' )
  telonTexture = new THREE.VideoTexture( video )
  telonTexture.encoding = THREE.sRGBEncoding
  telonTexture.minFilter = THREE.LinearFilter
  telonMaterial = new THREE.MeshBasicMaterial({ map: telonTexture })

  telon = new THREE.Mesh( telonGeometry, telonMaterial )

  telon.position.set(telonPosition.x, telonPosition.y, telonPosition.z)
  pantallaGroup.add( telon )
  // @ts-ignore
  video.play()

  //proyector light to front
  rectLight.position.set( telonPosition.x, telonPosition.y, telonPosition.z - 0.01 )
  rectLight.lookAt( telonPosition.x, telonPosition.y, telonPosition.z+1 )
  //proyector light to self
  rectLightB.position.set( telonPosition.x, telonPosition.y, telonPosition.z + 0.015 )
  rectLightB.lookAt( telonPosition.x, telonPosition.y, telonPosition.z-1 )

  pantallaGroup.add( rectLight, rectLightB )

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
    tlday.to([ lightMoon ], { intensity: 0, duration: params.dayNightSpeed, onComplete: function () {
      //STEPPED:
      ambientLight.color.set( params.lightSunColor )
      //swap bg color de seccion nosotros
      swapHeroBgColor()
      scene.fog = setFog(params.dayOrNight)
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
      scene.fog = setFog(params.dayOrNight)
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
//#endregion

function init() {
  //#region sceneSetup
  amIMobile = isMobile().any
  frustumSize = amIMobile ? frustumMobileSize : frustumDesktopSize
  shadowSize = amIMobile ? 512 : 2048
  container = document.getElementById( 'container' )

  renderer = new THREE.WebGLRenderer({
    //antialias: amIMobile ? false : true,
    antialias: true,
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
  //CAMERA controls
  controls = new OrbitControls( camera, renderer.domElement )
  controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05
  controls.minPolarAngle = params.initialSceneRotation.x
  controls.maxPolarAngle = params.initialSceneRotation.x
  controls.minAzimuthAngle = -Math.PI/3
  controls.maxAzimuthAngle = Math.PI/3
  controls.screenSpacePanning = false
  controls.enableZoom = false
  controls.target.y = amIMobile ? 0 : 0.5
  controls.minZoom = 0.85
  controls.maxZoom = 2
  
  camera.position.set(params.cameraOrthoPos.x, params.cameraOrthoPos.y, params.cameraOrthoPos.z)
  controls.update()
  //lighthelper layer
  camera.layers.enable(1)

  //#region Lights
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
  ambientLight.color.set( params.dayOrNight === 'day' ? params.lightSunColor : params.lightMoonColor )
  //lighthelpers
  lightHelperSun  = new THREE.CameraHelper( lightSun.shadow.camera )
  lightHelperMoon = new THREE.CameraHelper( lightMoon.shadow.camera )
  //lighthelper layers
  lightHelperSun.layers.set( 1 )
  lightHelperMoon.layers.set( 1 )
  scene.add( lightSun, lightMoon, ambientLight, lightHelperSun, lightHelperMoon )
  //#endregion Lights
  //#endregion sceneSetup
  
  //#region environmentSetup
  scene.fog = setFog(params.dayOrNight)
  //? new THREE.FogExp2(
  //  params.daySkyColor,
  //  params.fogDensityDay
  //)
  //: new THREE.FogExp2(
  //    params.nightSkyColor,
  //    params.fogDensityNight
  //)

  //const pmremGenerator = new THREE.PMREMGenerator( renderer )
  //scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture

  /*const loadedTexture = new RGBELoader().load(hdrimgUrl, () => {
    const envMap = loadedTexture
    scene.environment = envMap
    scene.environment.mapping = THREE.EquirectangularReflectionMapping
    scene.environment.needsUpdate = true
  })*/
  //#endregion environmentSetup
}

async function props() {
  //#region GROUND
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  if (debug.showGround) scene.add( ground )

  if (debug.showGLTFs) {
    const loader = new GLTFLoader()
    const [pancheraData, pantallaData] = await Promise.all([
      loader.loadAsync('/gltf/autoIneMiUV/auto_ine_miuv.gltf'),
      loader.loadAsync('/gltf/pantalla_v2/pantalla.gltf'),
    ])
    modelPanchera = setupModelB(pancheraData)
    modelPantalla = setupModel(pantallaData)

    pantallaGroup.position.set( 0, -0.005, 0 )
    pantallaGroup.scale.set( modelScale, modelScale, modelScale )
    pantallaGroup.add( modelPantalla )

    scene.add( modelPanchera, pantallaGroup )
    //Inicia proyector
    if(debug.showPantalla) initProjector()
    //Welcome!
    fadeScene(1)
  }
  scene.rotation.y = params.initialSceneRotation.y
  //#endregion GROUND
  
  if (!params.showLightsHelpers) camera.layers.disable( 1 )
  //Animation
  animateMobile()
}

function updateScene() {
  //lighthelpers
  if (params.showLightsHelpers) camera.layers.enable( 1 )
  else camera.layers.disable( 1 )
  camera.position.set(params.cameraOrthoPos.x, params.cameraOrthoPos.y, params.cameraOrthoPos.z)
  
  if (params.dayOrNight === 'day') {
    //Actualiza el ambiente
    ambientLight.color.set( lightSun.color )
    ambientLight.intensity = lightSun.intensity
    //luz y sombra
    lightSun.position.set( params.lightSunPosition.x, params.lightSunPosition.y, params.lightSunPosition.z )
    lightSun.intensity = params.lightSunIntensity
    lightSun.color.set( params.lightSunColor )
    //fog
    scene.fog = setFog(params.dayOrNight)
  } else {
    //Actualiza el ambiente
    ambientLight.color.set( lightMoon.color )
    ambientLight.intensity = lightMoon.intensity = params.lightMoonIntensity
    //luz y sombra
    lightMoon.position.set( params.lightMoonPosition.x, params.lightMoonPosition.y, params.lightMoonPosition.z )
    lightMoon.intensity = params.lightMoonIntensity
    lightMoon.color.set( params.lightMoonColor )
    //fog
    scene.fog = setFog(params.dayOrNight)
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

function animateMobile() {
  requestAnimationFrame(animateMobile)
  if (!params.mouseFollow || !debug.animate) return
  const clock = Math.round(performance.now()*0.021)
  const flick = clock % 2 == 0 ? 0.6 : 1
  const flickB = clock % 4 == 0 ? 0.7 : 1
  
  //projector flickering
  rectLight.intensity = params.screenIntensity - flick
  rectLightB.intensity = params.screenIntensity - flickB
  
  //luz negra screen flickering / 0.3 de dia
  modelPantalla.material.emissiveIntensity = (params.dayOrNight == 'night') ? driverLuzPantalla.intensity * flick : 0.3
  
  controls.update()
  renderer.render( scene, camera )
}

function makeTweak() {
  pane = new Pane({ container: document.getElementById('parameters') })
  pane.on('change', () => {
    updateScene()
    presetDebug.hidden = true
  })
  //CAMERA
  cameraFolder = pane.addFolder({ title: 'CAMARA', expanded: false })
  cameraFolder.addInput(params, 'cameraOrthoPos', { step: 0.01, label: 'pos cam' })
  cameraFolder.addInput(params, 'initialSceneRotation', { x: {min: -3.1416, max: 3.1416}, y: {min: 0, max: 3.1416/2}, label: 'giro inicial' })
  cameraFolder.addSeparator()
  cameraFolder.addInput(params, 'mouseFollow', { label: 'seguir cursor' })
  cameraFolder.addInput(params, 'spring', { type: 'number', min: 0, max: 0.5, step: 0.01, label: 'spring' })
  cameraFolder.addInput(params, 'friction', { type: 'number', min: 0.9, max: 1, step: 0.01, label: 'friction' })
  cameraFolder.addInput(params, 'mass', { type: 'number', min: 0, max: 0.1, step: 0.01, label: 'mass' })
  //DAY
  dayFolder = pane.addFolder({ title: 'DIA', expanded: false, hidden: params.dayOrNight === 'day' ? false : true })
  dayFolder.addInput(params, 'fogDensityDay', { type: 'number', min: 0, max: 0.2, step: 0.001, label: 'niebla dia' })
  dayFolder.addInput(params, 'daySkyColor', { label: 'cielo dia' })
  dayFolder.addInput(params, 'lightSunColor', { label: 'color sol' })
  dayFolder.addInput(params, 'lightSunIntensity', { type: 'number', min: 0, max: 3, step: 0.01, label: 'power sol' })
  dayFolder.addInput(params, 'lightSunPosition', { label: 'posicion sol', x: { min: -10, max: 10, step: 0.1 }, y: { min: 5, max: 10, step: 0.1 }, z: { min: -10, max: 10, step: 0.1 } })
  //NIGHT
  nightFolder = pane.addFolder({ title: 'NOCHE', expanded: false, hidden: params.dayOrNight === 'night' ? false : true })
  nightFolder.addInput(params, 'fogDensityNight', { type: 'number', min: 0, max: 0.2, step: 0.001, label: 'niebla noche' })
  nightFolder.addInput(params, 'nightSkyColor', { label: 'cielo noche' })
  nightFolder.addInput(params, 'lightMoonColor', {  label: 'color luna' })
  nightFolder.addInput(params, 'lightMoonIntensity', { type: 'number', min: 0, max: 3, step: 0.01, label: 'power luna' })
  nightFolder.addInput(params, 'lightMoonPosition', { label: 'posición luna', x: { min: -10, max: 10, step: 0.1 }, y: { min: 5, max: 10, step: 0.1 }, z: { min: -10, max: 10, step: 0.1 } })
  //PARAMETROS
  extraFolder = pane.addFolder({ title: 'EXTRA', expanded: false })
  extraFolder.addInput(params, 'groundColor', { view:'color', label: 'color piso' })
  if(!amIMobile) extraFolder.addInput(params, 'screenIntensity', { label: 'proyección', min: 0.1, max: 5, step: 0.1 })
  //DEBUG
  const debugFolder = pane.addFolder({ title: 'DEBUG', expanded: false })
  debugFolder.addInput(params, 'showLightsHelpers', { label: 'ayuda luz' })
  debugFolder.addInput(params, 'shadowPlaneSize', { min: 0.1, max: 10, step: 0.01 })
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

  function exportPreset() {
    preset.debug = JSON.stringify(pane.exportPreset(), null, 1)
    presetDebug.hidden = false
  }

}

onUnmounted(() => {
  renderer.dispose()
  camera.removeFromParent()
  groundGeometry.dispose()
  ground.removeFromParent()
  modelPanchera.removeFromParent()
  pantallaGroup.removeFromParent()
  telonMaterial.dispose()
  telonTexture.dispose()

  if (debug.showLights) {
    lightSun.dispose()
    lightMoon.dispose()
  }
  if (debug.showLightHelpers) {
    lightHelperSun.dispose()
    lightHelperMoon.dispose()
    rectLightHelper.dispose()
    rectLightHelperB.dispose()
  }
  //get rid of makeTweak
  if (pane) pane.dispose()
  //get rid of listeners
  window.removeEventListener('resize', onWindowResize)
  document.removeEventListener('scroll', handleScroll)
  //window.removeEventListener('deviceorientation', handleOrientation)

})
</script>

<template>
  <div class="relative z-30">
    <div id="container" ref="target" class="relative overflow-hidden">
      <!--<dialog class="badge absolute top-2/3">{{ parallax.tilt }}</dialog>-->
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
      >
      </div>
      <!--SWITCH-->
      <div class="absolute bottom-8 md:bottom-0 text-xl flex flex-col items-center space-y-8 w-full">
        <div class="form-control">
          <label class="label cursor-pointer space-x-4">
            <svg :class="{'opacity-25': dayNight === 'day'}" class="swap-off fill-slate-100 w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
            </svg>
            <input type="checkbox" @click="doDayNightCycle" class="toggle toggle-lg" />
            <svg :class="{'opacity-25': dayNight === 'night'}" class="swap-on fill-slate-100 w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
            </svg>
          </label>
        </div>
        <!--SCROLL-->
        <Icon name="ic:sharp-keyboard-double-arrow-up" class="h-10 w-10 animate-bounce" />
      </div>
      <!--Tweakpane-->
      <div v-if="route.name == 'test'" class="absolute flex justify-center w-full p-4">
        <div id="parameters" class="w-80 md:w-96"></div>
      </div>
    </div>
    <AboutUs :ciclo="dayNight" :class="{'text-base-100' : dayNight === 'day'}" :style="`background-color: ${heroBgColor}`" />
    <!--fadeScene-->
    <div id="fader" v-if="!loadedModels" class="absolute top-0 w-full h-screen flex flex-col justify-center items-center" :style="`background-color: ${heroBgColor}`">
      <img src="/images/tubos_loop_ani.png" alt="loading..." class="w-32" width="256" height="256">
      <p v-if="!amIMobile" class="text-xs">arrastra el dedo sobre el autocine!</p>
    </div>
  </div>
</template>

<style scoped>
#container {
  height: 95vh;
}
.toggle {
  background-color: white;
}
</style>