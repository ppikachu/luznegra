<script setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
//import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
//import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
//import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
//import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import chroma from 'chroma-js'

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
  vec2 uv = fragCoord/iResolution.xy;
  
  // Stars computation:
  vec3 stars_direction = normalize(vec3(uv * 2.0f - 1.0f, 1.0f)); // could be view vector for example
	float stars_threshold = 8.0f; // modifies the number of stars that are visible
	float stars_exposure = 200.0f; // modifies the overall strength of the stars
	float stars = pow(clamp(noise(stars_direction * 200.0f), 0.0f, 1.0f), stars_threshold) * stars_exposure;
	stars *= mix(0.4, 1.4, noise(stars_direction * 100.0f + vec3(iTime))); // time based flickering
	
  // Output to screen
  fragColor = vec4(vec3(stars),1.0);
}

void main() {
  mainImage(gl_FragColor, vUv * iResolution.xy);
}
`
const uniforms = {
  iTime: { value: 0 },
  iResolution:  { value: new THREE.Vector3(1, 1, 1) },
}
const day = 0xffffff
const daySkyColor = 0x00eeff
const duskdawn = 0xC87335
const night = 0x660103
const mixMethod = 'rgb' //opciones: rgb, hsl, lab, lch, lrgb
const GROUND_SIZE = 100
const SHADOW_SIZE = 2048
const DAYNIGHT_CYCLE_SPEED = 16
const WAKE_UP_TIME = 0
const lightSunColor = 0xffaaaa
const lightMoonColor = 0x660103
const lightPower = 5
const hdrimgUrl = '/images/Studio_80s.hdr'
const clock = new THREE.Clock()
const loader = new GLTFLoader()
let canvasSize
let sceneBg = ref()
let mouseX = 0
let mouseY = 0
const initialSceneRotation = -Math.PI*0.2
const turntableLimit = 1
const turntableLimitX = -0.145
const turntableSpeed = 0.002
const turntableSpeedB = 0.005
const cameraPerspPos = {
  x: 0,
  y: 0.6,
  z: 3.8
}
let mixer, windowHalfX, windowHalfY, time = 0, container,
scene, camera, renderer, composer,
lightSun, lightMoon, ambientLight, lightHelperSun, lightHelperMoon, lightGroup,
groundGeometry, groundMaterial, ground,
telonMaterial, modelPanchera, daySkyMaterial, nightSkyMaterial

onMounted(() => {
  //#region sceneSetup
  windowHalfX = window.innerWidth / 2
  windowHalfY = window.innerHeight / 2
  container = document.getElementById( 'container' )
  canvasSize = new THREE.Vector2( container.clientWidth, container.clientHeight )
  scene = new THREE.Scene()
  scene.rotation.y = initialSceneRotation

  renderer = new THREE.WebGLRenderer( { antialias: true } )
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( container.clientWidth, container.clientHeight )
  renderer.outputEncoding = THREE.sRGBEncoding
  //renderer.toneMapping =THREE. ACESFilmicToneMapping
  //renderer.toneMappingExposure = 1
  // turn on the physically correct lighting model
  //renderer.physicallyCorrectLights = true
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  container.appendChild( renderer.domElement )

  //perspectiveCamera( fov, aspect, near, far )
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 )
  camera.aspect = container.clientWidth / container.clientHeight
  camera.position.set( cameraPerspPos.x, cameraPerspPos.y, cameraPerspPos.z )
  camera.lookAt( 0, 0.5, 0 )
  camera.updateProjectionMatrix()
  //#endregion sceneSetup
  
  //#region environment
  nightSkyMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    //side: THREE.DoubleSide,
    uniforms: uniforms,
    vertexShader:   vertexShaderCode,
    fragmentShader: fragmentShaderCode
  })
  
  //SphereGeometry(radius:Float, widthSegments:Integer, heightSegments:Integer, phiStart:Float, phiLength:Float, thetaStart Float, thetaLength:Float)
  //const skyGeometry = new THREE.SphereGeometry( 20, 32, 16, 0, Math.PI, 0, Math.PI / 2 )
  
  //CylinderGeometry(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)
  const skyGeometry = new THREE.CylinderGeometry( 20, 20, 30, 32, 1, true, 0, Math.PI, 0, Math.PI / 2 )
  const sky = new THREE.Mesh( skyGeometry, nightSkyMaterial )
  sky.rotation.y = Math.PI / 1.4
  
  daySkyMaterial = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    color: daySkyColor,
    transparent: true
  })
  const daySkyGeometry = new THREE.CylinderGeometry( 15, 15, 30, 32, 1, true, 0, Math.PI, 0, Math.PI / 2 )
  const daySky = new THREE.Mesh( daySkyGeometry, daySkyMaterial )
  daySky.rotation.y = Math.PI / 1.4
  //daySky.scale.set( .999, .999, .999 )
  scene.add( daySky, sky )

  props()

  //const pmremGenerator = new THREE.PMREMGenerator( renderer )
  //scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture

  /*const loadedTexture = new RGBELoader().load(hdrimgUrl, () => {
    const envMap = loadedTexture
    scene.environment = envMap
    scene.environment.mapping = THREE.EquirectangularReflectionMapping
    scene.environment.needsUpdate = true
  })*/

  //#endregion environment
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
  animate()
})

function props() {
  //#region Lights
  ambientLight = new THREE.AmbientLight(0x404040)
  scene.add( ambientLight )

  lightSun = new THREE.DirectionalLight( lightSunColor, lightPower, 100 )
  lightSun.position.set( 0, 40, -20 )
  lightSun.distance = 10
  lightSun.angle = 0.3
  lightSun.castShadow = true
  lightSun.shadow.camera.near = 40
  lightSun.shadow.camera.far = 50
  lightSun.shadow.camera.right =2
  lightSun.shadow.camera.left = -2
  lightSun.shadow.camera.top	= 2
  lightSun.shadow.camera.bottom = -2
  lightSun.shadow.radius = 4
  //lightSun.shadow.bias = -0.0001
  lightSun.shadow.mapSize.width = lightSun.shadow.mapSize.height = SHADOW_SIZE
  lightHelperSun = new THREE.DirectionalLightHelper( lightSun )
  lightHelperSun.color = 0xff0000

  lightMoon = new THREE.DirectionalLight( lightMoonColor, lightPower, 100 )
  lightMoon.position.set( 0, -5, 5 )
  lightMoon.distance = 10
  lightMoon.angle = 0.3
  lightMoon.castShadow = true
  //lightMoon.shadow.bias = -0.0001
  lightMoon.shadow.mapSize.width = lightMoon.shadow.mapSize.height = SHADOW_SIZE
  lightHelperMoon = new THREE.DirectionalLightHelper( lightMoon )
  //scene.add( lightHelperSun, lightHelperMoon )

  lightGroup = new THREE.Group()
  lightGroup.rotation.x = .1
  lightGroup.add( lightSun, lightMoon )
  //lightGroup.add( lightSun )
  scene.add( lightGroup )
  //#endregion Lights
  
  //#region GROUND
  groundGeometry = new THREE.PlaneGeometry( GROUND_SIZE, GROUND_SIZE )
  groundMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff, side: THREE.DoubleSide } )
  ground = new THREE.Mesh( groundGeometry, groundMaterial )
  ground.receiveShadow = true
  //ground.castShadow = true
  ground.rotation.x = -Math.PI / 2
  scene.add( ground )

  loader.load( '/gltf/pantalla.gltf', function ( gltf ) {
    const modelPantalla = gltf.scene.children[0].children[0].children[0]
    //model.position.set( 1, 1, 0 )
    modelPantalla.scale.set( 15, 15, 15)
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
    modelPanchera.castShadow = true
    //modelPanchera.material.envMap = envMap
    //modelPanchera.material.needsUpdate = true
    scene.add( modelPanchera )
  }, undefined, function ( e ) { console.error( e ) })
  //#endregion GROUND
  
  initProjector()
}

function initProjector() {
  const video = document.getElementById( 'video' )
  video.play()

  const telonGeometry = new THREE.PlaneGeometry( 2.15, 1.25 )
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

  const telon = new THREE.Mesh( telonGeometry, telonMaterial )
  telon.position.set( 0, 0.9, -0.001 )
  scene.add( telon )
}

function animate() {
  requestAnimationFrame( animate )
  const targetX = mouseX/turntableLimit * turntableSpeed + initialSceneRotation //rotación (encuadre) inicial
  const targetY = mouseY/turntableLimit * turntableSpeed
  scene.rotation.y += turntableSpeedB * ( targetX - scene.rotation.y )
  scene.rotation.x += turntableSpeedB * ( targetY - scene.rotation.x )
  if (scene.rotation.x < turntableLimitX ) scene.rotation.x = turntableLimitX 
  time = clock.getElapsedTime() / DAYNIGHT_CYCLE_SPEED + WAKE_UP_TIME
  const fullTimeArc  = (Math.sin((time+Math.PI/4)*2)+1)/2
  const midArc = Math.cos(time)

  if (midArc > 0) sceneBg.value = chroma.mix( duskdawn, day, fullTimeArc, mixMethod ).gl()
    else          sceneBg.value = chroma.mix( duskdawn, night, fullTimeArc, mixMethod ).gl()
  const color = new THREE.Color( sceneBg.value[0], sceneBg.value[1], sceneBg.value[2])
  
  //luces auto on/off
  if (midArc < 0 && modelPanchera) modelPanchera.material.emissiveIntensity = 1
    else if (modelPanchera)        modelPanchera.material.emissiveIntensity = 0

  scene.fog = new THREE.FogExp2( color, 0.1 )
  scene.background = color
  if (ambientLight) {
    ambientLight.color = color
    //ambientLight.intensity = Math.cos(time*2)*0.1+0.1
    ambientLight.intensity = smoothstep( 0, 3, Math.cos(time) )
    lightSun.intensity = smoothstep( 0, 2, Math.cos(time) )
    lightMoon.intensity = smoothstep( 0, 4, Math.cos(time+Math.PI) )
    lightGroup.rotation.z = time
  }
  //if (telonMaterial) telonMaterial.color = color

  //mixer.update( delta )
  uniforms[ 'iTime' ].value =performance.now() / 1000
  daySkyMaterial.opacity = smoothstep( 0, 0.5, Math.cos(time) )
  //uniforms.iResolution.value.set(canvasSize, 1)
  renderer.render( scene, camera )
  //composer.render()
}

function onDocumentMouseMove(event) {
  mouseX = ( event.clientX - windowHalfX )
  mouseY = ( event.clientY - windowHalfY ) * 0.3
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
  ambientLight.dispose()
  lightSun.dispose()
  lightMoon.dispose()
  lightHelperSun.dispose()
  lightHelperMoon.dispose()
  //lightGroup.dispose()
})
</script>

<template>
  <div id="container" class="hero block overflow-hidden">
    <video id="video"
      loop
      muted
      crossOrigin="anonymous"
      playsinline
      style="display:none"
    >
      <source src="/planetario_old_film.mp4" type="video/mp4">
    </video>
  </div>
</template>

<style scoped>
  .hero {
    height: 66vh;
  }
</style>