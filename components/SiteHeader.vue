<script lang="ts" setup>
	const config = useRuntimeConfig()
</script>

<template>
		<div class="navbar bg-base-100 container mx-auto mb-6 md:mb-0 md:px-8">
			<div class="navbar-start">
				<a href="/" class="">
					<img class="w-60 py-8" src="/images/logo2022.svg" :alt="config.public.TEAM_NAME" />
				</a>
			</div>
			<div class="navbar-end">
				<LangSwitcher />
			</div>
	</div>
</template>