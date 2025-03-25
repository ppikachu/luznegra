<script lang="ts" setup>
	const config = useRuntimeConfig()
</script>

<template>
	<div class="flex items-center justify-between bg-base-100 container max-w-4xl mx-auto mb-6 md:mb-0 px-4">
		<a href="/" class="">
			<img class="w-60 py-8" src="/images/logo2022.svg" :alt="config.public.TEAM_NAME" />
		</a>
		<LangSwitcher />
	</div>
</template>