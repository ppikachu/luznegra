<script setup>
import { Camera, PointLight, AmbientLight, Group, Renderer, Scene, GltfModel, RenderPass, EffectComposer, UnrealBloomPass } from 'troisjs'
import { ref } from 'vue'
const pantallaRef = useState()
const pisoRef = useState()
const rendererRef = useState()
const lucesRef = useState()
const lightMoon = useState()
const lightSun = ref(null)

let time = 0
onBeforeMount(() => {
  console.clear()
})

onMounted(() => {
  //animate()
  console.log(lightSun)
  //lightSun.position.x = Math.sin( time * 0.7 ) * 30
})

function onLoad(object) {
  const scene = object.scene
  scene.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}
function onLoadC(object) {
  const scene = object.scene
  scene.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true
    }
  })
}

function animate() {
  //console.log(time)
  //time += 0.11
  //requestAnimationFrame(animate)
  //lightSun.position.y = Math.cos( time * 0.5 ) * 40
  //lightSun.position.z = Math.cos( time * 0.3 ) * 30
  // rotate lights
  //lucesRef.rotation.z += 0.01
  //gltfScene.rotation.y = Math.PI * Math.sin(clock.getElapsedTime() / 5)
}

</script>

<template>
  <div class="h-96" >
    <!--<ClientOnly>-->
      <Renderer ref="rendererRef" shadow :shadow-map-size="{ width: 2048, height: 2048 }" antialias :orbit-ctrl="{ enableDamping: true }" resize>
        <Camera :position="{ x:0.6, y:0.3, z: 1.5 }" />
        <Scene background="#044">
          <Group ref="lucesRef" :rotation="{ z: 2 }">
            <PointLight ref="lightMoon" :position="{ y: 10, z: 10 }" :color="0x2244ff" cast-shadow />
            <PointLight ref="lightSun" :position="{ y: -10, z:10 }" :color="0xffeeee" cast-shadow />
          </Group>
          <GltfModel ref="pisoRef" src="/gltf/piso.gltf" :scale="{x: 10, y:10, z:10 }" @load="onLoad" />
          <GltfModel ref="pantallaRef" src="/gltf/pantalla.gltf" :scale="{x: 10, y:10, z:10 }" @load="onLoadC" />
          <GltfModel src="/gltf/panchera.gltf" :scale="{x: 10, y:10, z:10 }" :position="{ z:1 }" @load="onLoadC" />
          <GltfModel v-for="i in 4" :key="i" :ref="`mesh${i}`" src="/gltf/arbol.gltf" :scale="{x: 10, y:10, z:10 }" :position="{ x: `${i*2-5}`, z: -2 }" @load="onLoad" />
        </Scene>
        <EffectComposer>
          <RenderPass />
          <UnrealBloomPass :strength="0.25" />
        </EffectComposer>
      </Renderer>
    <!--</ClientOnly>-->
  </div>
</template>