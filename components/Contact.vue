<script setup>

</script>

<template>
	<div class="hero bg-gradient-to-br from-secondary to-secondary-focus py-8">
		<div class="hero-content flex-col">
			<div class="text-center lg:text-left">
				<h1 class="text-5xl font-bold mb-6">{{ $t('escribinos') }}!</h1>
			</div>
			<div class="card card-compact lg:card-normal flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
				<div class="card-body">
					<form action="https://submit-form.com/Nhhk4492">
						<div class="form-control">
							<label class="label">
								<span class="label-text">E-mail</span>
							</label>
							<input type="email" name="email" required placeholder="e-mail" class=" textarea-secondary accent-amber-500 input" />
						</div>
						<div class="form-control">
							<label class="label">
								<span class="label-text">{{ $t('mensaje') }}</span>
							</label>
							<textarea name="mensaje" required class="textarea textarea-secondary" :placeholder="$t('tu_mensaje')"></textarea>
						</div>
						<div class="form-control mt-6">
							<button type="submit" class="btn btn-primary">{{ $t('enviar') }}</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>