<template>
  <div class="hero mx-auto bg-gradient-to-br from-secondary to-secondary-focus py-8">
    <div class="hero-content flex-col lg:flex-row-reverse">
      <div class="text-center lg:text-left">
        <h1 class="text-5xl font-bold">Escribínos!</h1>
        <!--<p class="py-6">Acá podés escribirnos.</p>-->
      </div>
      <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <div class="card-body">
          <!--<form action="https://app.headlessforms.cloud/api/v1/form-submission/awfCcRTUJ4" method="POST">-->
          <form action="https://formspree.io/f/mwkzplkb" method="POST">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input type="email" name="email" required placeholder="email" class="input input-bordered" />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Mensaje</span>
              </label>
              <textarea name="mensaje" class="textarea textarea-bordered" placeholder="Tu mensaje"></textarea>
            </div>
            <div class="form-control mt-6">
              <button class="btn btn-primary">Enviar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>