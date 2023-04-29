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
const currentImg = ref(0)

const imgGallery = props.gallery.items

function buttonClick(selected:number) {
	currentImg.value = selected
}
</script>

<template>
	<!--gallery component-->
	<section v-if="imgGallery.length>0">
		<!--gallery ON-->
		<aside class="carousel items-center">
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
				<a v-for="(img, i) in imgGallery"
					:href="`#img${i}`"
					:class="{ 'btn-active': i == currentImg }"
					class="btn btn-sm"
					@click="buttonClick(i)"
				>
					{{ img.title }}
				</a>
			</div>
		</div>
	</section>
</template>