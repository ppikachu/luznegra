<script setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js'
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
  exposure: 1,
  emissiveIntensity: 0.5,
  bloomOn: false,
  bloomStrength: 0.6,
  bloomThreshold: 0.25,
  bloomRadius: 0.1,
  saoOn: true,

  daySkyColor: 0xaaeeff,
  nightSkyColor: 0x010924,
  fogDensityDay: 0.1,
  fogDensityNight: 0.1,

  showLightsHelpers: false,
  lightPlaneSize: 6,
  lightPlaneOffset: 4,
  lightSunColor: 0xffebdb,
  lightSunIntensity: 1.0,
  lightSunPosition: new THREE.Vector3(-1.4, 5, 6),
  lightMoonColor: 0x660103,
  //lightMoonColor: 'rgb(102, 1, 3)',
  lightMoonIntensity: 1.0,
  lightMoonPosition: new THREE.Vector3(-10, 5, -1),

  screenIntensity: 3,
  screenLightColor: 0x111133,
  groundColor: 0x3f5628,
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
const clock = new THREE.Clock()
const initialSceneRotation = { x: Math.PI*0.1, y: Math.PI*0.2 }
const cameraOrthoPos = {
  x: 0,
  y: 0.5,
  z: 3
}
const frustumDesktopSize = 4
const frustumMobileSize = 6

//const mixMethod = 'rgb' //opciones: rgb, hsl, lab, lch, lrgb
//const turntableLimitY = Math.PI*0.1

//HACK: hardcoded
const heroColor = {
  day: chroma(params.groundColor).brighten(1.9),
  night: chroma(params.lightMoonColor).darken(0.8)
}

const loadedModels = ref(false)
const dayNight = ref(params.dayOrNight)
const heroBgColor = ref( params.dayOrNight === 'day' ? heroColor.day : heroColor.night )

let container,scene, camera, SHADOW_SIZE, GROUND_SIZE = 30, frustumSize, renderer, composer, bloomPass, saoPass,
lightSun, lightMoon, lightAreaSun, lightAreaMoon, rectLight, rectLightB,
rectLightHelper, rectLightHelperB, lightHelperSun, lightHelperMoon,
groundGeometry, ground, modelPanchera, modelPantalla, groundMaterial, telonMaterial,
driverLuzPantalla = { intensity: params.dayOrNight === 'night' ? 2 : 0 },
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
  heroBgColor.value = params.dayOrNight === 'day' ? heroColor.day : heroColor.night
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
  SHADOW_SIZE = amIMobile ? 512 : 2048
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

  //Mueve la escena para que se vea con el angulo elegido
  scene.position.set(0, 0, -5)
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
  if (!amIMobile) {
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
      //saoPass.output = THREE.SAOPass.OUTPUT.Beauty
      saoPass.saoMinResolution = 0
      saoPass.saoKernelRadius = 50
      saoPass.saoIntensity = 0.01
      composer.addPass( saoPass )
    }
  }
  //#endregion postprocessing
}

async function props() {
  //#region Lights
  lightSun = new THREE.DirectionalLight()
  lightSun.color.set( params.lightSunColor )
  lightSun.intensity = params.dayOrNight === 'day' ? params.lightSunIntensity : 0
  lightSun.position.set( params.lightSunPosition.x, params.lightSunPosition.y, params.lightSunPosition.z )
  lightSun.lookAt( 0, 0, 0 )
  lightSun.castShadow = true
  lightSun.shadow.mapSize.width = SHADOW_SIZE
  lightSun.shadow.mapSize.height = SHADOW_SIZE
  lightSun.shadow.camera.near = 2
  lightSun.shadow.camera.far = 50
  lightSun.shadow.camera.left = -params.lightPlaneSize
  lightSun.shadow.camera.right = params.lightPlaneSize
  lightSun.shadow.camera.top = params.lightPlaneSize
  lightSun.shadow.camera.bottom = -params.lightPlaneSize

  lightMoon = new THREE.DirectionalLight()
  lightMoon.color.set( params.lightMoonColor )
  lightMoon.intensity = params.dayOrNight === 'day' ? 0 : params.lightMoonIntensity
  lightMoon.position.set( params.lightMoonPosition.x, params.lightMoonPosition.y, params.lightMoonPosition.z )
  lightMoon.lookAt( 0, 0, 0 )
  lightMoon.castShadow = true
  lightMoon.shadow.mapSize.width = SHADOW_SIZE
  lightMoon.shadow.mapSize.height = SHADOW_SIZE
  lightMoon.shadow.camera.near = 2
  lightMoon.shadow.camera.far = 50
  lightMoon.shadow.camera.left = -params.lightPlaneSize
  lightMoon.shadow.camera.right = params.lightPlaneSize
  lightMoon.shadow.camera.top = params.lightPlaneSize
  lightMoon.shadow.camera.bottom = -params.lightPlaneSize
  
  //ambient
  lightAreaSun = new THREE.AmbientLight()
  lightAreaSun.color.set( params.lightSunColor )
  lightAreaSun.intensity = params.dayOrNight === 'day' ? params.lightSunIntensity : 0

  //lighthelpers
  lightHelperSun = new THREE.DirectionalLightHelper( lightSun )
  lightHelperMoon = new THREE.DirectionalLightHelper( lightMoon )
  //lighthelper layers
  lightHelperSun.layers.set( 1 )
  lightHelperMoon.layers.set( 1 )
  scene.add( lightSun, lightMoon, lightAreaSun )
  //#endregion Lights
  
  //#region GROUND
  if (debug.showGround) {
    groundGeometry = new THREE.PlaneBufferGeometry( GROUND_SIZE, GROUND_SIZE )
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
    loader.loadAsync('/gltf/panchera.gltf'),
    loader.loadAsync('/gltf/pantalla.gltf'),
  ])

  modelPanchera = setupModel(pancheraData)
  modelPanchera.scale.set( 15, 15, 15)
  modelPanchera.position.set( 0, 0, 1.7 )
  modelPanchera.updateMatrix()

  modelPantalla = setupModel(pantallaData)
  modelPantalla.scale.set( 15, 15, 15)
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
  //scene.add( rectLight )

  rectLightHelper = new RectAreaLightHelper( rectLight )
  rectLightHelperB = new RectAreaLightHelper( rectLightB )
  rectLightHelper.layers.set( 1 )
  rectLightHelperB.layers.set( 1 )
  scene.add( rectLightHelper, rectLightHelperB )
  //scene.add( rectLightHelperB )
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
      //stepped:
      scene.fog = new THREE.FogExp2( params.daySkyColor, params.fogDensityDay )
      if (pane) pane.refresh()
    } }, '<')
    //fade in:
    tlday.to([ lightSun, lightAreaSun], { intensity: params.lightSunIntensity, duration: params.dayNightSpeed }, '<')
    //turn off modelPanchera inner emissive
    tlday.to(modelPanchera.material, { emissiveIntensity: 0, duration: params.dayNightSpeed, delay: params.dayNightDelay })
    driverLuzPantalla.intensity = 2
    tlday.play()
  } else {
    //NIGHT:
    params.dayOrNight = dayNight.value = 'night'
    var tlnight = gsap.timeline()
    //move lightShadow position
    tlnight.to(lightSun.position, { x: previousMoonPosition.x, y: previousMoonPosition.y, z: previousMoonPosition.z, duration: params.dayNightSpeed })
    tlnight.to(lightMoon.position, { x: previousMoonPosition.x, y: previousMoonPosition.y, z: previousMoonPosition.z, duration: params.dayNightSpeed }, '<')
    tlnight.to([ lightSun, lightAreaSun], { intensity: 0, duration: params.dayNightSpeed, onComplete: function () {
      //stepped:
      scene.fog = new THREE.FogExp2( params.nightSkyColor, params.fogDensityNight )
      if (pane) pane.refresh()
    } }, '<')
    tlnight.to([ lightMoon, lightAreaMoon], { intensity: params.lightMoonIntensity, duration: params.dayNightSpeed }, '<')
    //turn on modelPanchera inner emissive
    tlnight.to(modelPanchera.material, { emissiveIntensity: 1, duration: params.dayNightSpeed, ease: "back.out(4)", delay: params.dayNightDelay })
    tlnight.to([ driverLuzPantalla], { intensity: 2, duration: params.dayNightSpeed*3 })
    tlnight.play()
  }

  //hide tweakpane sections
  if (pane) {
    dayFolder.hidden = params.dayOrNight === 'day' ? false : true
    nightFolder.hidden = params.dayOrNight === 'night' ? false : true
  }
  //swap bg color de seccion nosotros
  swapHeroBgColor()
}

function updateScene() {
  //lighthelpers
  if (params.showLightsHelpers) camera.layers.enable( 1 )
  else camera.layers.disable( 1 )

  if (params.bloomOn) {
    bloomPass.threshold = params.bloomThreshold
    bloomPass.strength = params.bloomStrength
    bloomPass.radius = params.bloomRadius
  }
  //Actualiza el ambiente
  if (params.dayOrNight === 'day') {
    lightAreaSun.color.set( lightSun.color )
    lightAreaSun.intensity = lightSun.intensity
    scene.fog = new THREE.FogExp2( params.daySkyColor, params.fogDensityDay )
    if (modelPanchera) gsap.to(modelPanchera.material, { emissiveIntensity: 0, duration: 0.3 })
  } else {
    lightAreaSun.color.set( lightMoon.color )
    lightAreaSun.intensity = lightMoon.intensity
    scene.fog = new THREE.FogExp2( params.nightSkyColor, params.fogDensityNight )
  }
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
    console.log(flick)
  }
  //luz negra screen flickering
  if (params.dayOrNight == 'night' && modelPantalla) modelPantalla.material.emissiveIntensity = driverLuzPantalla.intensity * flick
  
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
  pane.addInput(groundMaterial, 'color', { color: { type: 'float' }, label: 'color piso' })
  pane.addInput(params, 'screenIntensity', { label: 'proyección', min: 0.1, max: 5, step: 0.1 })
  pane.addSeparator()
  pane.addInput(params, 'lightPlaneSize', {label: 'tamaño luz', min: 0.1, max: 10, step: 0.01})
  //MOVEMENT
  const motionFolder = pane.addFolder({ title: 'MOVIMIENTO', expanded: false })
  motionFolder.addInput(params, 'mouseFollow', { label: 'seguir cursor' })
  motionFolder.addInput(params, 'spring', { type: 'number', min: 0, max: 0.5, step: 0.01, label: 'spring' })
  motionFolder.addInput(params, 'friction', { type: 'number', min: 0.9, max: 1, step: 0.01, label: 'friction' })
  motionFolder.addInput(params, 'mass', { type: 'number', min: 0, max: 0.1, step: 0.01, label: 'mass' })
  //DAY
  dayFolder = pane.addFolder({ title: 'DIA', expanded: true, hidden: params.dayOrNight === 'day' ? false : true })
  dayFolder.addInput(lightSun, 'color', { color: { type: 'float' }, label: 'color sol' })
  dayFolder.addInput(lightSun, 'intensity', { type: 'number', min: 0, max: 5, step: 0.1, label: 'power sol' })
  dayFolder.addInput(lightSun, 'position', { label: 'posicion sol', x: { min: -10, max: 10, step: 0.1 }, y: { min: 4, max: 10, step: 0.1 }, z: { min: -10, max: 10, step: 0.1 } })
  dayFolder.addSeparator()
  dayFolder.addInput(params, 'daySkyColor', { color: { type: 'float' }, label: 'cielo dia' })
  dayFolder.addInput(params, 'fogDensityDay', { type: 'number', min: 0, max: 0.5, step: 0.01, label: 'niebla dia' })
  //NIGHT
  nightFolder = pane.addFolder({ title: 'NOCHE', expanded: true, hidden: params.dayOrNight === 'night' ? false : true })
  nightFolder.addInput(lightMoon, 'color', { color: { type: 'float' }, label: 'color luna' })
  nightFolder.addInput(lightMoon, 'intensity', { type: 'number', min: 0, max: 5, step: 0.1, label: 'power luna' })
  nightFolder.addInput(lightMoon, 'position', { label: 'posición luna', x: { min: -10, max: 10, step: 0.1 }, y: { min: 4, max: 10, step: 0.1 }, z: { min: -10, max: 10, step: 0.1 } })
  nightFolder.addSeparator()
  nightFolder.addInput(params, 'nightSkyColor', { color: { type: 'float' }, label: 'cielo noche' })
  nightFolder.addInput(params, 'fogDensityNight', { type: 'number', min: 0, max: 0.5, step: 0.01, label: 'niebla noche' })
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
  if (!amIMobile) composer.setSize( container.clientWidth, container.clientHeight )
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
    <div id="container" class="hero relative">
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
      <div class="absolute bottom-16 md:bottom-0 text-xl cursor-pointer flex justify-center w-full">
        <!--<label class="animate-bounce swap swap-rotate">
          <input @click="swapDayNight" type="checkbox" />
          <svg class="swap-on fill-slate-100 w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
          <svg class="swap-off fill-slate-100 w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
        </label>-->
        <div class="form-control">
          <label class="label cursor-pointer space-x-2">
            <svg :class="{'opacity-25': dayNight === 'day'}" class="swap-off fill-slate-100 w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
            <input type="checkbox" @click="swapDayNight" class="toggle toggle-lg " />
            <svg :class="{'opacity-25': dayNight === 'night'}" class="swap-on fill-slate-100 w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
          </label>
        </div>
      </div>
      <div id="debugger" class="absolute w-80 right-0 p-4 grid gap-4">
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