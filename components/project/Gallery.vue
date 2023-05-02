<script lang="ts" setup>
/* Define props */
interface Props {
	gallery: {
		items: Array<{
			title: string,
			url: string,
			width: number,
			height: number
		}>
	}
}
const props = defineProps<Props>()

const carousel = ref()
const currentImg = ref(0)

const imgGallery = props.gallery.items

const goTo = (tag:number) => {
	//marca active el button group:
	currentImg.value = tag
	//scroll to:
	const target = carousel.value.children[tag]
	const left = target.offsetLeft
	carousel.value.scrollTo({left: left})
}
</script>

<template>
	<!--gallery component-->
	<section v-if="imgGallery.length>0">
		<!--gallery ON-->
		<aside ref="carousel" class="carousel items-center">
			<div v-for="(img, i) in imgGallery" :key="i" :id="'img'+i" class="carousel-item w-full h-fit justify-center">
				<img
					:src="img.url"
					:width="img.width"
					:height="img.height"
					:alt="img.title"
					class="rounded"
				/>
			</div>
		</aside>
		<!--chooser-->
		<div v-if="props.gallery.items.length > 1" class="flex justify-center">
			<div class="py-4 btn-group overflow-x-auto">
				<span v-for="(img, i) in imgGallery"
					:class="{ 'btn-active': i == currentImg }"
					class="btn btn-sm"
					@click="goTo(i)"
				>
					{{ img.title }}
				</span>
			</div>
		</div>
	</section>
</template>