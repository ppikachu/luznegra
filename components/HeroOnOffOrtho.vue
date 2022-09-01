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
  showLightHelpers: false,
  showGround: true,
  showGLTFs: true,
  showPantalla: true,
  showAmbientLight: true,
  showLights: true,
  animate: true
}

const cameraOrthoPos = {
  x: 0,
  y: 0.5,
  z: 10
}
const modelScale = 15
const frustumDesktopSize = 4
const frustumMobileSize = 7
const telonWidth = .145
const telonSize = { x: telonWidth, y: telonWidth / (16/9) }
const telonPosition = { x: 0, y: 0.06, z: -0.001 }
const telonGeometry = new THREE.PlaneGeometry( telonSize.x, telonSize.y )
const groundSize = 30
const initialSceneRotation = { x: Math.PI*0.1, y: Math.PI*0.2 }
const sound = useSound('/audio/Click02.mp3',{ volume: 0.25 })

const route = useRoute()
const heroBgColor = ref()
const loadedModels = ref(false)
const dayNight = ref(params.dayOrNight)

const
groundMaterial = new THREE.MeshStandardMaterial( { color: params.groundColor } ),
ambientLight = new THREE.AmbientLight(),
lightSun = new THREE.DirectionalLight(),
lightMoon = new THREE.DirectionalLight(),
rectLight = new THREE.RectAreaLight( params.screenLightColor, params.screenIntensity, telonSize.x*modelScale, telonSize.y*modelScale ),
rectLightB = new THREE.RectAreaLight( params.screenLightColor, params.screenIntensity, telonSize.x*modelScale, telonSize.y*modelScale ),
scene = new THREE.Scene(),
groundGeometry = new THREE.PlaneBufferGeometry( groundSize, groundSize ),
ground = new THREE.Mesh( groundGeometry, groundMaterial ),
//ground.castShadow = true,
pantallaGroup = new THREE.Group()

let
driverLuzPantalla = { intensity: params.dayOrNight === 'night' ? 2 : 0 },
modelPanchera, modelPantalla,
container: HTMLElement, camera, renderer,
rectLightHelper, rectLightHelperB, lightHelperSun, lightHelperMoon, dirLightShadowMapViewer, dirLightShadowMapViewerB,
telonMaterial, telon, telonTexture,
shadowSize: number, frustumSize: number,
pane, dayFolder, nightFolder, motionFolder, preset = { debug: '' }, presetDebug: { hidden: boolean },
mouseX = 0, deltaY = 0, vx = 0,
amIMobile: boolean, windowHalfX: number, previousX: number, timer: number,
gamma = 0, previousGamma = 0,
deltaGamma: number, finalRotation: number

swapHeroBgColor()

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
  if( route.name == 'test') makeTweak()
})

//#region FUNCTIONS
function fadeScene(time:number) {
  gsap.to( document.getElementById('fader'), { opacity: 0, duration: time, onComplete: ()=> { loadedModels.value = true} })
}

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

function doDayNightCycle () {
  sound.play()
  swapDayNight()
}

async function loadModels() {
  const loader = new GLTFLoader()
  const [pancheraData, pantallaData] = await Promise.all([
    //loader.loadAsync('/gltf/panchera_v1/panchera.gltf'),
    //loader.loadAsync('/gltf/panchos2_v1/panchos2.gltf'),
    loader.loadAsync('/gltf/autoB/autocine_v02.gltf'),
    loader.loadAsync('/gltf/pantalla_v1/pantalla.gltf'),
  ])

  modelPanchera = setupModelB(pancheraData)
  modelPantalla = setupModel(pantallaData)

  return { modelPanchera, modelPantalla }
}

function initProjector() {
  //RectAreaLightUniformsLib.init()
  const video = document.getElementById( 'video' )
  telonTexture = new THREE.VideoTexture( video )
  telonTexture.encoding = THREE.sRGBEncoding
  //telonTexture.minFilter = THREE.LinearFilter
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

function setupModel(modelData) {
  const model = modelData.scene.children[0].children[0].children[0]
  model.material.side = THREE.DoubleSide
  model.castShadow = true
  model.matrixAutoUpdate = false
  return model
}

function setupModelB(modelData) {
  const model = modelData.scene.children[0]
  model.material.side = THREE.DoubleSide
  model.material.emissiveIntensity = 1
  model.rotation.z = -Math.PI/2
  model.scale.set( 1.5, 1.5, 1.5)
  model.position.set( 0, 0.08, 1.7 )
  model.castShadow = true
  model.updateMatrix()
  model.matrixAutoUpdate = false
  return model
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

function onDocumentMouseMove(event: { clientX: number; }) {
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

function smoothstep (min:number, max:number, value:number) {
  var x = Math.max(0, Math.min(1, (value-min)/(max-min)))
  return x*x*(3 - 2*x)
}
//#endregion

function init() {
  amIMobile = isMobile().any
  frustumSize = amIMobile ? frustumMobileSize : frustumDesktopSize
  shadowSize = amIMobile ? 512 : 2048
  //#region sceneSetup
  container = document.getElementById( 'container' )
  windowHalfX = container.clientWidth / 2

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
}

async function props() {
  //#region GROUND
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  if (debug.showGround) scene.add( ground )

  if (debug.showGLTFs) {
    const models = await loadModels()
    //TODO: reordenar
    pantallaGroup.position.set( 0, -0.005, 0 )
    pantallaGroup.scale.set( modelScale, modelScale, modelScale )
    pantallaGroup.add( models.modelPantalla )
    scene.add( models.modelPanchera, pantallaGroup )

    //Inicia proyector
    if(debug.showPantalla) initProjector()

    fadeScene(1)

  }

  scene.fog = params.dayOrNight === 'day' ? new THREE.FogExp2(params.daySkyColor, params.fogDensityDay ) : new THREE.FogExp2(params.nightSkyColor, params.fogDensityNight )
  //#endregion GROUND
  
  if (!params.showLightsHelpers) camera.layers.disable( 1 )
  //Animation
  animate()
}

function updateScene() {
  //lighthelpers
  if (params.showLightsHelpers) camera.layers.enable( 1 )
  else camera.layers.disable( 1 )

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
    if (Math.abs(deltaY) > 0.001) scene.rotation.y = deltaY + initialSceneRotation.y //rotación (encuadre) inicial
  } else {
    deltaGamma = (gamma - previousGamma)
    ax = deltaGamma * params.spring*2
    vx += ax
    vx *= params.friction
    finalRotation = (vx - previousGamma) * params.mass
    if (Math.abs(finalRotation) > 0.001) scene.rotation.y = finalRotation + initialSceneRotation.y //rotación (encuadre) inicial
    previousGamma = vx
  }
  //limit camera rotation:
  //if (scene.rotation.y < turntableLimitY) scene.rotation.y = turntableLimitY 
  renderer.render( scene, camera )
}

function makeTweak() {
  pane = new Pane({ container: document.getElementById('parameters') })
  pane.on('change', () => {
    updateScene()
    presetDebug.hidden = true
  })
  //MOVEMENT
  motionFolder = pane.addFolder({ title: 'MOVIMIENTO', expanded: false })
  motionFolder.addInput(params, 'mouseFollow', { label: 'seguir cursor' })
  motionFolder.addInput(params, 'spring', { type: 'number', min: 0, max: 0.5, step: 0.01, label: 'spring' })
  motionFolder.addInput(params, 'friction', { type: 'number', min: 0.9, max: 1, step: 0.01, label: 'friction' })
  motionFolder.addInput(params, 'mass', { type: 'number', min: 0, max: 0.1, step: 0.01, label: 'mass' })
  //DAY
  dayFolder = pane.addFolder({ title: 'DIA', expanded: true, hidden: params.dayOrNight === 'day' ? false : true })
  dayFolder.addInput(params, 'fogDensityDay', { type: 'number', min: 0, max: 0.2, step: 0.001, label: 'niebla dia' })
  dayFolder.addInput(params, 'daySkyColor', { label: 'cielo dia' })
  dayFolder.addInput(params, 'lightSunColor', { label: 'color sol' })
  dayFolder.addInput(params, 'lightSunIntensity', { type: 'number', min: 0, max: 3, step: 0.01, label: 'power sol' })
  dayFolder.addInput(params, 'lightSunPosition', { label: 'posicion sol', x: { min: -10, max: 10, step: 0.1 }, y: { min: 5, max: 10, step: 0.1 }, z: { min: -10, max: 10, step: 0.1 } })
  //NIGHT
  nightFolder = pane.addFolder({ title: 'NOCHE', expanded: true, hidden: params.dayOrNight === 'night' ? false : true })
  nightFolder.addInput(params, 'fogDensityNight', { type: 'number', min: 0, max: 0.2, step: 0.001, label: 'niebla noche' })
  nightFolder.addInput(params, 'nightSkyColor', { label: 'cielo noche' })
  nightFolder.addInput(params, 'lightMoonColor', {  label: 'color luna' })
  nightFolder.addInput(params, 'lightMoonIntensity', { type: 'number', min: 0, max: 3, step: 0.01, label: 'power luna' })
  nightFolder.addInput(params, 'lightMoonPosition', { label: 'posición luna', x: { min: -10, max: 10, step: 0.1 }, y: { min: 5, max: 10, step: 0.1 }, z: { min: -10, max: 10, step: 0.1 } })
  //PARAMETROS
  pane.addInput(params, 'groundColor', { view:'color', label: 'color piso' })
  if(!amIMobile) pane.addInput(params, 'screenIntensity', { label: 'proyección', min: 0.1, max: 5, step: 0.1 })
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
  document.removeEventListener('mousemove', onDocumentMouseMove)
  window.removeEventListener('resize', onWindowResize)
  document.removeEventListener('scroll', handleScroll)
  window.removeEventListener('deviceorientation', handleOrientation)

})
</script>

<template>
  <div class="relative">
    <div id="container" class="relative overflow-hidden pb-16">
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
        <div class="form-control" @click="">
          <label class="label cursor-pointer space-x-2">
            <svg :class="{'opacity-25': dayNight === 'day'}" class="swap-off fill-slate-100 w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
            <input type="checkbox" @click="doDayNightCycle" class="toggle toggle-lg " />
            <svg :class="{'opacity-25': dayNight === 'night'}" class="swap-on fill-slate-100 w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
          </label>
        </div>
      </div>
      <!--Tweakpane-->
      <div v-if="route.name == 'test'" class="absolute flex justify-center w-full p-4">
        <div id="parameters" class="w-80 md:w-96"></div>
      </div>
    </div>
    <AboutUs :class="{'text-base-100' : dayNight === 'day'}" :style="`background-color: ${heroBgColor}`" />
    <!--fadeScene-->
    <div id="fader" v-if="!loadedModels" class="absolute top-0 w-full h-screen flex justify-center items-center" :style="`background-color: ${heroBgColor}`">
      <img src="/images/tubos_loop_ani.png" alt="loading..." class="w-32">
    </div>
  </div>
</template>

<style scoped>
#container {
  height: 95vh;
}
</style>