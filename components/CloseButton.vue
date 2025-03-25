<template>
	<div class="text-center">
		<!-- <UTooltip :text="$t('close')"> -->
			<UButton
				@click="$emit('closeMe')"
				icon="mdi-close-thick"
				size="xl"
				class="rounded-full cursor-pointer mt-10 mb-2"
			/>
		<!-- </UTooltip> -->
	</div>
</template>