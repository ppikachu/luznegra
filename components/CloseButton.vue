<template>
	<div class="tooltip tooltip-primary absolute bottom-4 md:bottom-12 left-1/2 -ml-6 z-10 uppercase text-xs" :data-tip="$t('close')">
		<label for="modal-proyecto" @click="$emit('closeMe')" class="btn btn-primary btn-circle hover:scale-90">
			<Icon name="mdi:close-thick" size="28" />
		</label>
	</div>
</template>