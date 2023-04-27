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
const imgGallery = props.gallery.items
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
				/>
			</div>
		</aside>
		<div class="flex justify-center py-2 btn-group overflow-x-auto">
			<a v-for="(img, i) in imgGallery" :href="`#img${i}`" class="btn btn-sm text-xs">{{ img.title }}</a>
		</div>
	</section>
</template>