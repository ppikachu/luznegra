<script setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
//import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
//import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
//import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
//import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import chroma from 'chroma-js'
import gsap from "gsap"
import { Pane } from 'tweakpane'

const route = useRoute()

const params = {
  mouseFollow: true,
  dayOrNight: "night",
  dayNightSpeed: 0.25,
  dayNightDelay: 0.5,
  exposure: 1,
  emissiveIntensity: 0.5,
  bloomStrength: 0.5,
  bloomThreshold: 0.9,
  bloomRadius: 0.1,

  daySkyColor: 0xaaeeff,
  nightSkyColor: 0x010924,
  fogDensityDay: 0.1,
  fogDensityNight: 0.1,

  showLightsHelpers: true,
  lightPlaneSize: 2,
  lightPlaneOffset: 4,
  lightSunColor: 0xffebdb,
  lightSunIntensity: 1,
  lightSunPosition: new THREE.Vector3(1.4, 4, 6),
  lightMoonColor: 0x660103,
  lightMoonIntensity: 1,
  lightMoonPosition: new THREE.Vector3(-3, 4, 2),
  ambientLightSunIntensity: 0.1,
  ambientLightMoonIntensity: 0.1,

  screenIntensity: 0.8,
  groundColor: 0xffffff
}

const vertexShaderCode = `
varying vec2 vUv;
void main()
{
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
}
`
const fragmentShaderCode = `
varying vec2 vUv;
uniform vec2 iResolution;
uniform float iTime;
uniform vec4 skyColor;

// 3D Gradient noise from: https://www.shadertoy.com/view/Xsl3Dl
vec3 hash( vec3 p ) // replace this by something better
{
	p = vec3(dot(p,vec3(127.1,311.7, 74.7)),
			dot(p,vec3(269.5,183.3,246.1)),
			dot(p,vec3(113.5,271.9,124.6)));

	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}
float noise( in vec3 p )
{
  vec3 i = floor( p );
  vec3 f = fract( p );
	vec3 u = f*f*(3.0-2.0*f);

    return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                          dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                     mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                          dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
                mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                          dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                     mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                          dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  // Normalized pixel coordinates (from 0 to 1)
  vec2 uv = fract(fragCoord * vec2(5.0,5.0));
  
  // Stars computation:
  vec3 stars_direction = normalize(vec3(uv * 2.0f - 1.0f, 1.0f)); // could be view vector for example
	float stars_threshold = 8.0f; // modifies the number of stars that are visible
	float stars_exposure = 100.0f; // modifies the overall strength of the stars
	float stars = pow(clamp(noise(stars_direction * 200.0f), 0.0f, 1.0f), stars_threshold) * stars_exposure;
	stars *= mix(0.4, 1.4, noise(stars_direction * 100.0f + vec3(iTime))); // time based flickering
	
  // Output to screen
  vec3 blue = vec3(skyColor.r, skyColor.g, skyColor.b);
  fragColor = vec4(vec3(stars)+blue,1.0);
}

void main() {
  mainImage(gl_FragColor, vUv * iResolution.xy);
}
`
const mixMethod = 'rgb' //opciones: rgb, hsl, lab, lch, lrgb

const uniforms = {
  iTime: { value: 0 },
  iResolution:  { value: new THREE.Vector3(1, 1, 1) },
  skyColor: { value: params.nightSkyColor },
}

const GROUND_SIZE = 100
const SHADOW_SIZE = 2048

const hdrimgUrl = '/images/Studio_80s.hdr'
const clock = new THREE.Clock()
const loader = new GLTFLoader()
let mouseX = 0
let mouseY = 0
const initialSceneRotation = -Math.PI*0.2
const turntableLimit = 1
const turntableLimitX = -0.11
const turntableSpeed = 0.002
const turntableSpeedB = 0.005
const cameraPerspPos = {
  x: 0,
  y: 0.6,
  z: 5
}
const debug = {
  showGround: true,
  showGLTFs: true,
  showPantalla: true,
  showAmbientLight: true,
  showLights: true,
}
let windowHalfX, windowHalfY, container,
scene, camera, renderer, composer,
lightSun, lightShadow, ambientLight, rectLight, lightHelperSun, lightHelperShadow,
pane, dayFolder, nightFolder, preset = { debug: '' }, presetDebug,
groundGeometry, ground,
modelPanchera, modelPantalla, starrySky,
groundMaterial, telonMaterial, daySkyMaterial, nightSkyMaterial,
driverLuzPantalla = { intensity: params.dayOrNight === 'night' ? params.screenIntensity : 0 }

onMounted(() => {
  //#region sceneSetup
  windowHalfX = window.innerWidth / 2
  windowHalfY = window.innerHeight / 2
  container = document.getElementById( 'container' )
  scene = new THREE.Scene()

  renderer = new THREE.WebGLRenderer( { antialias: true } )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( container.clientWidth, container.clientHeight )
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  //THREE.ColorManagement.legacyMode = false
  //renderer.toneMapping =THREE. ACESFilmicToneMapping
  //renderer.toneMappingExposure = 1
  // turn on the physically correct lighting model
  //renderer.physicallyCorrectLights = true
  //scene.background = color
  container.appendChild( renderer.domElement )

  //perspectiveCamera( fov, aspect, near, far )
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 )
  camera.aspect = container.clientWidth / container.clientHeight
  camera.position.set( cameraPerspPos.x, cameraPerspPos.y, cameraPerspPos.z )
  camera.lookAt( 0, 0.5, 0 )
  camera.updateProjectionMatrix()
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
  //const renderScene = new RenderPass( scene, camera )
  //const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1, 0.4, 0.85 )
  //bloomPass.threshold = params.bloomThreshold;
  //bloomPass.strength = params.bloomStrength;
  //bloomPass.radius = params.bloomRadius;

  //composer = new EffectComposer( renderer )
  //composer.addPass( renderScene )
  //composer.addPass( bloomPass )
  //#endregion postprocessing
  
  document.addEventListener( 'mousemove', onDocumentMouseMove )
  window.addEventListener( 'resize', onWindowResize )
  props()
  animate()
  if(route.name == 'onoff') makeTweak()
})

function props() {
  //#region environment
  const uniformedColor = new chroma(params.nightSkyColor).gl()
  const finalUniformedColor = [uniformedColor[0], uniformedColor[1], uniformedColor[2], 1]
  uniforms[ 'skyColor' ].value = finalUniformedColor
  nightSkyMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: uniforms,
    vertexShader: vertexShaderCode,
    fragmentShader: fragmentShaderCode
  })

  daySkyMaterial = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    color: params.daySkyColor,
    transparent: true
  })
  //SphereGeometry(radius:Float, widthSegments:Integer, heightSegments:Integer, phiStart:Float, phiLength:Float, thetaStart Float, thetaLength:Float)
  const skyGeometry = new THREE.SphereGeometry( 40, 32, 16, 0, Math.PI*2, 0, Math.PI*2 )
  starrySky = params.dayOrNight === 'day' ? new THREE.Mesh(skyGeometry, daySkyMaterial) : new THREE.Mesh( skyGeometry, nightSkyMaterial )
  starrySky.name = 'starrySky'
  scene.add( starrySky )
  //#endregion environment

  //#region Lights
  ambientLight = new THREE.AmbientLight()
  ambientLight.intensity = params.dayOrNight === 'day' ? params.ambientLightSunIntensity : params.ambientLightMoonIntensity
  ambientLight.color = params.dayOrNight === 'day' ? new THREE.Color(params.lightSunColor) : new THREE.Color(params.lightMoonColor)
  ambientLight.visible = debug.showAmbientLight
  scene.add( ambientLight )

  lightSun = new THREE.RectAreaLight()
  lightSun.color.set( params.dayOrNight === 'day' ? params.lightSunColor : params.lightMoonColor )
  lightSun.intensity = params.dayOrNight === 'day' ? params.lightSunIntensity : params.lightMoonIntensity
  lightSun.width = lightSun.height = params.lightPlaneSize
  lightSun.position.set( 0, params.dayOrNight === 'day' ? params.lightSunPosition.y : params.lightMoonPosition.y, 0 )
  lightSun.lookAt( 0, 0, 0 )
  scene.add( lightSun )

  lightHelperSun = new RectAreaLightHelper( lightSun )
  lightHelperSun.visible = params.showLightsHelpers
  lightSun.add( lightHelperSun )

  lightShadow = new THREE.DirectionalLight()
  lightShadow.color.set( params.dayOrNight === 'day' ? params.lightSunColor : params.lightMoonColor )
  lightShadow.intensity = params.dayOrNight === 'day' ? params.lightSunIntensity : params.lightMoonIntensity
  lightShadow.position.set( params.dayOrNight === 'day' ? params.lightSunPosition.x : params.lightMoonPosition.x, params.dayOrNight === 'day' ? params.lightSunPosition.y : params.lightMoonPosition.y, params.dayOrNight === 'day' ? params.lightSunPosition.z : params.lightMoonPosition.z )
  lightShadow.lookAt( 0, 0, 0 )
  lightShadow.castShadow = true
  lightShadow.shadow.mapSize.width = SHADOW_SIZE
  lightShadow.shadow.mapSize.height = SHADOW_SIZE
  lightShadow.shadow.camera.near = 0.5
  lightShadow.shadow.camera.far = 30
  lightShadow.shadow.camera.left = -params.lightPlaneSize
  lightShadow.shadow.camera.right = params.lightPlaneSize
  lightShadow.shadow.camera.top = params.lightPlaneSize
  lightShadow.shadow.camera.bottom = -params.lightPlaneSize
  scene.add( lightShadow )
  //lightHelperShadow = new THREE.DirectionalLightHelper( lightShadow )
  //lightHelperShadow.visible = params.showLightsHelpers
  //scene.add( lightHelperShadow )
  //#endregion Lights
  
  //#region GROUND

  if (debug.showGround) {
    groundGeometry = new THREE.PlaneGeometry( GROUND_SIZE, GROUND_SIZE )
    groundMaterial = new THREE.MeshStandardMaterial( { color: params.groundColor } )
    ground = new THREE.Mesh( groundGeometry, groundMaterial )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    //ground.castShadow = true
    scene.add( ground )
  }
  if (debug.showGLTFs) {
    loader.load( '/gltf/pantalla.gltf', function ( gltf ) {
      modelPantalla = gltf.scene.children[0].children[0].children[0]
      modelPantalla.scale.set( 15, 15, 15)
      modelPantalla.material.emissiveIntensity = params.dayOrNight === 'day' ? 0 : params.emissiveIntensity
      //modelPantalla.receiveShadow = true
      modelPantalla.castShadow = true
      //modelPantalla.material.envMap = envMap
      scene.add( modelPantalla )
    }, undefined, function ( e ) { console.error( e ) })

    loader.load( '/gltf/panchera.gltf', function ( gltf ) {
      modelPanchera = gltf.scene.children[0].children[0].children[0]
      modelPanchera.position.set( 0, 0, 1.7 )
      modelPanchera.scale.set( 10, 10, 10)
      modelPanchera.material.emissiveIntensity = params.dayOrNight === 'day' ? 0 : params.emissiveIntensity
      modelPanchera.castShadow = true
      //modelPanchera.material.envMap = envMap
      scene.add( modelPanchera )
    }, undefined, function ( e ) { console.error( e ) })
  }
  scene.fog = params.dayOrNight === 'day' ? new THREE.FogExp2(params.daySkyColor, params.fogDensityDay ) : new THREE.FogExp2(params.nightSkyColor, params.fogDensityNight )
  //#endregion GROUND

  //Gira la escena para que se vea con el angulo elegido
  scene.rotation.y = initialSceneRotation
  //Inicia proyector
  if(debug.showPantalla) initProjector()
  //console.log(scene)
}

function initProjector() {
  RectAreaLightUniformsLib.init()
  const video = document.getElementById( 'video' )
  video.play()
  const telonSize = new THREE.Vector2( 2.15, 1.25 )
  const telonGeometry = new THREE.PlaneGeometry( telonSize.x, telonSize.y )
  const telonTexture = new THREE.VideoTexture( video )
  telonTexture.encoding = THREE.sRGBEncoding
  telonTexture.needsUpdate = true

  telonMaterial = new THREE.MeshLambertMaterial(
    {
      color: 0x000000,
      emissive: 0xffffff,
      //transparent: true,
      emissiveMap: telonTexture,
      alphaMap: telonTexture,
    }
  )
  //telonMaterial.needsUpdate = true
  const telonPosition = new THREE.Vector3(0, 0.9, -0.001 )
  const telon = new THREE.Mesh( telonGeometry, telonMaterial )
  telon.position.set(telonPosition.x, telonPosition.y, telonPosition.z)
  scene.add( telon )

  //proyector light
  rectLight = new THREE.RectAreaLight( 0xffffff, params.screenIntensity, telonSize.x/2, telonSize.y/2 )
  rectLight.position.set( telonPosition.x, telonPosition.y, telonPosition.z - 0.1 )
  rectLight.lookAt( telonPosition.x, telonPosition.y, telonPosition.z+1 )
  scene.add( rectLight )

  const rectLightHelper = new RectAreaLightHelper( rectLight )
  rectLight.add( rectLightHelper )
}

function swapDayNight() {
  if (params.dayOrNight === 'night') {
    params.dayOrNight = 'day'
    //move lightShadow position
    gsap.to(lightShadow.position, { x: params.lightSunPosition.x, y: params.lightSunPosition.y, z: params.lightSunPosition.z, duration: params.dayNightSpeed })
    //turn off modelPanchera inner emissive
    if (modelPanchera) gsap.to(modelPanchera.material, { emissiveIntensity: 0, duration: 0.3 })
    gsap.to([driverLuzPantalla, ambientLight, lightSun, lightShadow], { intensity: 0, duration: params.dayNightSpeed, onComplete: () => {
      //stepped:
      starrySky.material = daySkyMaterial
      scene.fog = new THREE.FogExp2( params.daySkyColor, params.fogDensityDay )
      ambientLight.color.set( params.lightSunColor )
      lightSun.position.y = params.lightSunPosition.y
      lightSun.color.set( params.lightSunColor )
      lightShadow.color.set( params.lightSunColor )
      //fade in:
      gsap.to([ ambientLight ], { intensity: params.ambientLightSunIntensity, duration: params.dayNightSpeed })
      gsap.to([ lightSun, lightShadow], { intensity: params.lightSunIntensity, duration: params.dayNightSpeed })
    }})
  } else {
    //NIGHT:
    params.dayOrNight = 'night'
    //move lightShadow position
    gsap.to(lightShadow.position, { x: params.lightMoonPosition.x, y: params.lightMoonPosition.y, z: params.lightMoonPosition.z, duration: params.dayNightSpeed })
    //turn on modelPanchera inner emissive
    if (modelPanchera) gsap.to(modelPanchera.material, { emissiveIntensity: 1, duration: params.dayNightSpeed, delay: 1, ease: "back.out(4)" })
    gsap.to([ ambientLight, lightSun, lightShadow], { intensity: 0, duration: params.dayNightSpeed, delay: 0, onComplete: () => {
      //stepped:
      starrySky.material = nightSkyMaterial
      //starry sky color
      const uniformedColor = new chroma(params.nightSkyColor).gl()
      const finalUniformedColor = [uniformedColor[0], uniformedColor[1], uniformedColor[2], 1]
      uniforms[ 'skyColor' ].value = finalUniformedColor
      scene.fog = new THREE.FogExp2( params.nightSkyColor, params.fogDensityNight )
      ambientLight.color.set( params.lightMoonColor )
      lightSun.position.y = params.lightMoonPosition.y
      lightSun.color.set( params.lightMoonColor )
      lightShadow.color.set( params.lightMoonColor )
      //fade in:
      gsap.to([ ambientLight ], { intensity: params.ambientLightMoonIntensity, duration: params.dayNightSpeed, delay: 0 })
      gsap.to([ lightSun, lightShadow], { intensity: params.lightMoonIntensity, duration: params.dayNightSpeed, delay: 0 })
      gsap.to([ driverLuzPantalla], { intensity: params.screenIntensity, duration: params.dayNightSpeed, delay: 1 })
    }})
  }

  //hide tweakpane sections
  if (pane) {
    dayFolder.hidden = params.dayOrNight === 'day' ? false : true
    nightFolder.hidden = params.dayOrNight === 'night' ? false : true
  }
}

function updateScene() {
  lightSun.width = lightSun.height = params.lightPlaneSize
  lightHelperSun.visible = params.showLightsHelpers
  groundMaterial.color.set(params.groundColor)
  //Actualiza el ambiente
  if (params.dayOrNight === 'day') {
    starrySky.material = daySkyMaterial
    lightSun.color.set( params.lightSunColor )
    lightSun.intensity = params.lightSunIntensity
    lightSun.position.y = params.lightSunPosition.y
    lightShadow.color.set( params.lightSunColor )
    lightShadow.intensity = params.lightSunIntensity
    lightShadow.position.set( params.lightSunPosition.x, params.lightSunPosition.y, params.lightSunPosition.z )
    ambientLight.color.set( params.lightSunColor )
    ambientLight.intensity = params.ambientLightSunIntensity
    scene.fog = new THREE.FogExp2( params.daySkyColor, params.fogDensityDay )
    if (modelPanchera) gsap.to(modelPanchera.material, { emissiveIntensity: 0, duration: 0.3 })
  } else {
    starrySky.material = nightSkyMaterial
    lightSun.color.set( params.lightMoonColor )
    lightSun.intensity = params.lightMoonIntensity
    lightSun.position.y = params.lightMoonPosition.y
    lightShadow.color.set( params.lightMoonColor )
    lightShadow.intensity = params.lightMoonIntensity
    lightShadow.position.set( params.lightMoonPosition.x, params.lightMoonPosition.y, params.lightMoonPosition.z )
    ambientLight.color.set( params.lightMoonColor )
    ambientLight.intensity = params.ambientLightMoonIntensity
    scene.fog = new THREE.FogExp2( params.nightSkyColor, params.fogDensityNight )
    const uniformedColor = new chroma(params.nightSkyColor).gl()
    const finalUniformedColor = [uniformedColor[0], uniformedColor[1], uniformedColor[2], 1]
    uniforms[ 'skyColor' ].value = finalUniformedColor
  }
}

function animate() {
  requestAnimationFrame(animate)
  rectLight.intensity = params.screenIntensity * Math.random()*0.3
  if (modelPantalla) modelPantalla.material.emissiveIntensity = driverLuzPantalla.intensity * (Math.sin(performance.now() / 20)*0.1  + 0.9)
  //mouse follow?
  if (params.mouseFollow) {
    const targetX = mouseX/turntableLimit * turntableSpeed + initialSceneRotation //rotación (encuadre) inicial
    const targetY = mouseY/turntableLimit * turntableSpeed
    scene.rotation.y += turntableSpeedB * ( targetX - scene.rotation.y )
    scene.rotation.x += turntableSpeedB * ( targetY - scene.rotation.x )
    //limit camera rotation:
    if (scene.rotation.x < turntableLimitX) scene.rotation.x = turntableLimitX 
  }

  //time = doCycle ? clock.getElapsedTime() / DAYNIGHT_CYCLE_SPEED + WAKE_UP_TIME : WAKE_UP_TIME
  uniforms[ 'iTime' ].value = performance.now() / 1000

  renderer.render( scene, camera )
  //composer.render()
}

function makeTweak() {
  pane = new Pane({ container: document.getElementById('parameters') })
  pane.on('change', (ev) => {
    updateScene()
    presetDebug.hidden = true
  })
    
  pane.addInput(params, 'groundColor', { view: 'color', label: 'color piso' })
  pane.addInput(params, 'screenIntensity', { label: 'proyección', min: 0.1, max: 3, step: 0.1 })
  pane.addSeparator()
  //PARAMETROS
  pane.addInput(params, 'lightPlaneSize', {label: 'tamaño luz', min: 0.1, max: 10, step: 0.01})
  dayFolder = pane.addFolder({ title: 'DIA', expanded: true, hidden: params.dayOrNight === 'day' ? false : true })
  dayFolder.addInput(params, 'lightSunColor', { view: 'color', label: 'color sol' })
  dayFolder.addInput(params, 'lightSunIntensity', { type: 'number', min: 0, max: 5, step: 0.1, label: 'power sol' })
  dayFolder.addInput(params, 'lightSunPosition', { label: 'posicion sol', min: -10, max: 10, step: 0.1 })
  dayFolder.addSeparator()
  dayFolder.addInput(params, 'daySkyColor', { view: 'color', label: 'cielo dia' })
  dayFolder.addInput(params, 'fogDensityDay', { type: 'number', min: 0, max: 0.5, step: 0.01, label: 'niebla dia' })
  
  nightFolder = pane.addFolder({ title: 'NOCHE', expanded: true, hidden: params.dayOrNight === 'night' ? false : true })
  nightFolder.addInput(params, 'lightMoonColor', { view: 'color', label: 'color luna' })
  nightFolder.addInput(params, 'lightMoonIntensity', { type: 'number', min: 0, max: 5, step: 0.1, label: 'power luna' })
  nightFolder.addInput(params, 'lightMoonPosition', { label: 'posición luna', min: -10, max: 10, step: 0.1 })
  nightFolder.addSeparator()
  nightFolder.addInput(params, 'nightSkyColor', { view: 'color', label: 'cielo noche' })
  nightFolder.addInput(params, 'fogDensityNight', { type: 'number', min: 0, max: 0.5, step: 0.01, label: 'niebla noche' })
  
  const debugFolder = pane.addFolder({ title: 'DEBUG', expanded: false })

  //DEBUG
  debugFolder.addInput(params, 'mouseFollow', { label: 'seguir cursor' })
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
  mouseY = ( event.clientY - windowHalfY )
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2
  windowHalfY = window.innerHeight / 2
  //persp
  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()
  //uniforms.iResolution.value = [ container.clientWidth, container.clientHeight ]
  renderer.setSize(container.clientWidth, container.clientHeight )
}

function smoothstep (min, max, value) {
  var x = Math.max(0, Math.min(1, (value-min)/(max-min)))
  return x*x*(3 - 2*x)
}

onUnmounted(() => {
  renderer.dispose()
  if (debug.showLights) {
    ambientLight.dispose()
    lightSun.dispose()
  }
  if (debug.showLightsHelpers) {
    lightHelperSun.dispose()
  }
  //get rid of makeTweak
  if (pane) pane.dispose()
})
</script>

<template>
  <div id="container" class="hero block relative overflow-hidden">
    <video id="video"
      loop
      muted
      crossOrigin="anonymous"
      playsinline
      style="display:none"
    >
      <source src="/experimental.mp4" type="video/mp4">
    </video>
    <div class="absolute top-8 text-xl cursor-pointer flex justify-center w-full">
      <label class="swap swap-rotate">
        <!-- this hidden checkbox controls the state -->
        <input @click="swapDayNight" type="checkbox" />
        <!-- sun icon -->
        <svg class="swap-on fill-secondary w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
        <!-- moon icon -->
        <svg class="swap-off fill-secondary w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
      </label>
    </div>
    <div id="debugger" class="absolute w-80 right-0 p-4 grid gap-4">
      <div id="parameters"></div>
    </div>
  </div>
</template>

<style scoped>
  .hero {
    height: 66vh;
  }
</style>