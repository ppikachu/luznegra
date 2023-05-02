<template>
	<div class="hero bg-gradient-to-br from-secondary to-secondary-focus py-8">
		<div class="hero-content flex-col w-full md:w-2/3">
			<div class="text-center lg:text-left">
				<h1 class="text-5xl font-bold mb-6" data-aos="fade-up">{{ $t('escribinos') }}!</h1>
			</div>
			<div class="card card-compact md:card-normal shadow-2xl bg-base-100" data-aos="fade-up" data-aos-delay="200">
				<div class="card-body">
					<form action="https://submit-form.com/Nhhk4492" method="POST">
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
							<textarea id="message" name="message" required class="textarea textarea-secondary" :placeholder="$t('tu_mensaje')"></textarea>
						</div>
						<div class="form-control mt-4"><NuxtTurnstile ref="turnstile" /></div>
						<div class="form-control mt-8">
							<button type="submit" class="btn btn-primary">{{ $t('enviar') }}</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>