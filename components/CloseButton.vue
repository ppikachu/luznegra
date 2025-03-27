<template>
	<div class="text-center">
		<UButton
			@click="$emit('closeMe')"
			icon="line-md:close"
			size="xl"
			class="rounded-full cursor-pointer mb-2"
		/>
	</div>
</template>