<template>
	<div class="text-center">
		<UButton
			@click="$emit('closeMe')"
			icon="mdi-close-thick"
			size="xl"
			class="rounded-full cursor-pointer mb-2"
		/>
	</div>
</template>