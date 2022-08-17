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

const params = {
  exposure: 1,
  bloomStrength: 0.5,
  bloomThreshold: 0.9,
  bloomRadius: 0.1
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
const day = 0xffffff
const daySkyColor = 0xaaeeff
const duskdawn = 0xC87335
const night = 0x660103

const nightFogColor = 0x010924
const duskdawnFogColor = night
const dayFogColor = daySkyColor
const fogDensity = 0.1

const lightSunColor = 0xffaaaa
const lightMoonColor = 0x660103
const lightPower = 5

const ambientLightColor = 0x404040
const ambientLightIntensity = 0.1

const groundColor = 0xffffff

const uniforms = {
  iTime: { value: 0 },
  iResolution:  { value: new THREE.Vector3(1, 1, 1) },
  skyColor: { value: nightFogColor },
}

const GROUND_SIZE = 100
const SHADOW_SIZE = 2048
const DAYNIGHT_CYCLE_SPEED = 16
const WAKE_UP_TIME = 0
const doCycle = true
const hdrimgUrl = '/images/Studio_80s.hdr'
const clock = new THREE.Clock()
const loader = new GLTFLoader()
let sceneBg = ref()
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
  showLights: true,
  showLightsHelpers: true,
}
let mixer, windowHalfX, windowHalfY, time = 0, container,
scene, camera, renderer, composer,
lightSun, lightMoon, ambientLight, rectLight, lightGroup,
lightHelperSun, lightHelperMoon,
groundGeometry, ground,
modelPanchera, modelPantalla,
groundMaterial, telonMaterial, daySkyMaterial, nightSkyMaterial, glFog,
lucesOn = false, driverLuzPantalla = { intensity: 0 }

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
})

function props() {
  //#region environment
  nightSkyMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
    repeat: new THREE.Vector2( 8, 8 ),
    uniforms: uniforms,
    vertexShader: vertexShaderCode,
    fragmentShader: fragmentShaderCode
  })
  
  //SphereGeometry(radius:Float, widthSegments:Integer, heightSegments:Integer, phiStart:Float, phiLength:Float, thetaStart Float, thetaLength:Float)
  const skyGeometry = new THREE.SphereGeometry( 40, 32, 16, 0, Math.PI*2, 0, Math.PI*2 )
  //CylinderGeometry(radiusTop:Float, radiusBottom:Float, height:Float, radialSegments:Integer, heightSegments:Integer, openEnded:Bool, thetaStart:Float, thetaLength:Float)
  //const skyGeometry = new THREE.CylinderGeometry( 40, 40, 60, 32, 1, true, 0, Math.PI * 2 )
  const sky = new THREE.Mesh( skyGeometry, nightSkyMaterial )
  
  daySkyMaterial = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    color: daySkyColor,
    transparent: true
  })
  const daySkyGeometry = new THREE.CylinderGeometry( 29, 29, 60, 32, 1, true, 0, Math.PI * 2 )
  const daySky = new THREE.Mesh( daySkyGeometry, daySkyMaterial )
  //daySky.scale.set( .999, .999, .999 )
  scene.add( daySky, sky )
  //#endregion environment

  //#region Lights
  ambientLight = new THREE.AmbientLight(ambientLightColor)

  lightSun = new THREE.DirectionalLight( lightSunColor, lightPower, 100 )
  lightSun.position.set( 0, 40, -20 )
  lightSun.distance = 10
  lightSun.angle = 0.3
  lightSun.castShadow = true
  lightSun.shadow.camera.near = 1
  lightSun.shadow.camera.far = 50
  lightSun.shadow.camera.right =2
  lightSun.shadow.camera.left = -2
  lightSun.shadow.camera.top	= 2
  lightSun.shadow.camera.bottom = -2
  lightSun.shadow.radius = 8
  //lightSun.shadow.bias = -0.0001
  lightSun.shadow.mapSize.width = lightSun.shadow.mapSize.height = SHADOW_SIZE

  lightMoon = new THREE.DirectionalLight( lightMoonColor, lightPower, 100 )
  lightMoon.position.set( 0, -40, 5 )
  lightMoon.distance = 10
  lightMoon.angle = 0.3
  lightMoon.castShadow = true
  lightMoon.shadow.camera.near = 1
  lightMoon.shadow.camera.far = 50
  lightMoon.shadow.camera.right =2
  lightMoon.shadow.camera.left = -2
  lightMoon.shadow.camera.top	= 2
  lightMoon.shadow.camera.bottom = -2
  lightMoon.shadow.radius = 8
  //lightMoon.shadow.bias = -0.0001
  lightMoon.shadow.mapSize.width = lightMoon.shadow.mapSize.height = SHADOW_SIZE

  lightGroup = new THREE.Group()
  lightGroup.add( lightSun, lightMoon )

  scene.add( ambientLight )
  scene.add( lightGroup )
  if (debug.showLightsHelpers) {
    lightHelperSun = new THREE.DirectionalLightHelper( lightSun, 1, 0xffff00 )
    lightHelperMoon = new THREE.DirectionalLightHelper( lightMoon, 1, 0x0000ff )
    lightSun.add( lightHelperSun )
    lightMoon.add( lightHelperMoon )
  }

  //#endregion Lights
  
  //#region GROUND
  if (debug.showGround) {
    groundGeometry = new THREE.PlaneGeometry( GROUND_SIZE, GROUND_SIZE )
    groundMaterial = new THREE.MeshStandardMaterial( { color: groundColor } )
    ground = new THREE.Mesh( groundGeometry, groundMaterial )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    //ground.castShadow = true
    scene.add( ground )
  }
  if (debug.showGLTFs) {
    loader.load( '/gltf/pantalla.gltf', function ( gltf ) {
      modelPantalla = gltf.scene.children[0].children[0].children[0]
      //model.position.set( 1, 1, 0 )
      modelPantalla.scale.set( 15, 15, 15)
      modelPantalla.material.emissiveIntensity = 0
      //modelPantalla.receiveShadow = true
      modelPantalla.castShadow = true
      //modelPantalla.material.envMap = envMap
      //modelPantalla.material.needsUpdate = true
      scene.add( modelPantalla )
      //mixer = new THREE.AnimationMixer( model )
      //mixer.clipAction( gltf.animations[ 0 ] ).play()
    }, undefined, function ( e ) { console.error( e ) })

    loader.load( '/gltf/panchera.gltf', function ( gltf ) {
      modelPanchera = gltf.scene.children[0].children[0].children[0]
      modelPanchera.position.set( 0, 0, 1.7 )
      modelPanchera.scale.set( 10, 10, 10)
      modelPanchera.material.emissiveIntensity = 0
      modelPanchera.castShadow = true
      //modelPanchera.material.envMap = envMap
      //modelPanchera.material.needsUpdate = true
      scene.add( modelPanchera )
    }, undefined, function ( e ) { console.error( e ) })
  }
  //#endregion GROUND

  //Gira la escena para que se vea con el angulo elegido
  scene.rotation.y = initialSceneRotation
  //Inicia proyector
  initProjector()
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
  const intensity = 1
  rectLight = new THREE.RectAreaLight( 0xffffff, intensity, telonSize.x/2, telonSize.y/2 )
  rectLight.position.set( telonPosition.x, telonPosition.y, telonPosition.z - 0.1 )
  rectLight.lookAt( telonPosition.x, telonPosition.y, telonPosition.z+1 )
  scene.add( rectLight )

  const rectLightHelper = new RectAreaLightHelper( rectLight )
  rectLight.add( rectLightHelper )
}

function animate() {
  requestAnimationFrame(animate)
  //mouse follow
  const targetX = mouseX/turntableLimit * turntableSpeed + initialSceneRotation //rotación (encuadre) inicial
  const targetY = mouseY/turntableLimit * turntableSpeed
  scene.rotation.y += turntableSpeedB * ( targetX - scene.rotation.y )
  scene.rotation.x += turntableSpeedB * ( targetY - scene.rotation.x )
  if (scene.rotation.x < turntableLimitX) scene.rotation.x = turntableLimitX 

  time = doCycle ? clock.getElapsedTime() / DAYNIGHT_CYCLE_SPEED + WAKE_UP_TIME : WAKE_UP_TIME

  //amanece:0 mediodia:1 atardecer:0
  const fullTimeArc  = Math.sin((time+Math.PI/4)*2)*0.5+0.5

  const compressedTimeArc = smoothstep(-0.5,0.3, Math.sin((time+Math.PI/4)*2))
  //console.log(compressedTimeArc)
  //mediodia:1 noche: -1
  const midArc = Math.cos(time)
  
  //luces auto on/off
  if (midArc < 0 && lucesOn === false) {
    gsap.fromTo(driverLuzPantalla, { intensity: 0 }, { intensity: 1, duration: 2, ease: "bounce.inOut" })
    if (modelPanchera) gsap.to(modelPanchera.material, { emissiveIntensity: 1, duration: 1, delay: 3, ease: "back.out(4)" })
    lucesOn = true
  }
  else if (midArc > 0 && lucesOn === true) {
    gsap.to(driverLuzPantalla, { intensity: 0, duration: 0.5, delay: 4 })
    if (modelPanchera) gsap.to(modelPanchera.material, { emissiveIntensity: 0, duration: 0.3 })
    lucesOn = false
  }
  
  if (midArc > 0) {
    sceneBg.value = chroma.mix( duskdawn, day, fullTimeArc, mixMethod ).gl()
    glFog = chroma.mix( duskdawnFogColor, dayFogColor, compressedTimeArc, mixMethod ).gl()
    if (modelPantalla) modelPantalla.material.emissiveIntensity = 0
  }
  else {
    sceneBg.value = chroma.mix( duskdawn, night, fullTimeArc, mixMethod ).gl()
    glFog = chroma.mix( duskdawnFogColor, nightFogColor, compressedTimeArc, mixMethod ).gl()
    if (modelPantalla) modelPantalla.material.emissiveIntensity = driverLuzPantalla.intensity + Math.random()*0.3
  }
  const color = new THREE.Color( sceneBg.value[0], sceneBg.value[1], sceneBg.value[2])

  //FOG
  const colorFog = new THREE.Color( glFog[0], glFog[1], glFog[2] )
  scene.fog = new THREE.FogExp2( colorFog, fogDensity )

  //SKYBOX
  if (ambientLight) {
    ambientLight.color = color
    ambientLight.intensity = Math.sin(time+Math.PI/4) * 0.2 + 0.3
    lightSun.intensity = smoothstep( 0, 2, Math.cos(time) )
    lightMoon.intensity = smoothstep( 0, 4, Math.cos(time+Math.PI) )
    lightGroup.rotation.z = time
    lightGroup.rotation.set(0, 0, time)
  }

  uniforms[ 'iTime' ].value =performance.now() / 1000
  uniforms[ 'skyColor' ].value = glFog

  if ( daySkyMaterial ) daySkyMaterial.opacity = smoothstep( -0.2, 0.5, Math.cos(time) )

  renderer.render( scene, camera )
  //composer.render()
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
  //clock.dispose()
  //scene.dispose()
  renderer.dispose()
  //camera.dispose()
  //sceneBg.dispose()
  if (debug.showLights) {
    ambientLight.dispose()
    lightSun.dispose()
    lightMoon.dispose()
  }
  if (debug.showLightsHelpers) {
    lightHelperSun.dispose()
    lightHelperMoon.dispose()
  }
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
      <source src="/images/experimental.mp4" type="video/mp4">
    </video>
    <div class="absolute bottom-8 text-xl cursor-pointer flex justify-center w-full">
      <button class="btn glass btn-sm"> ▼ </button>
    </div>
  </div>
</template>

<style scoped>
  .hero {
    height: 66vh;
  }
</style>