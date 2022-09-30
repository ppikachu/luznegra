<script setup>
  useHead({
    script: [
      {
        src: 'https://www.google.com/recaptcha/api.js',
        async: true,
        defer: true,
      }
    ]
  })
  //onMounted(() => {
    //var clientId = grecaptcha.render('inline-badge', {
    //    'sitekey': '6LcEqzEiAAAAAOD_YpFJknOXbj8eB5kHaGStn7DV',
    //    'badge': 'inline',
    //    'size': 'invisible'
    //})
    //grecaptcha.ready(function() {
    //    grecaptcha.execute(clientId, { action: 'submit' }).then(function(token) {
    //      // Verify the token on the server.
    //      console.info("got token: " + token)
    //      document.getElementById('g-recaptcha-response').value = token
    //    })
    //})
  //})
</script>

<template>
  <div class="hero bg-gradient-to-br from-secondary to-secondary-focus py-8">
    <div class="hero-content flex-col">
      <div class="text-center lg:text-left">
        <h1 class="text-5xl font-bold mb-6">{{ $t('escribinos') }}!</h1>
      </div>
      <div class="card card-compact lg:card-normal flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <div class="card-body">
          <form action="https://formspree.io/f/mwkzplkb" method="POST">
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
              <textarea name="mensaje" class="textarea textarea-secondary" :placeholder="$t('tu_mensaje')"></textarea>
            </div>
            <div
              class="g-recaptcha my-6 w-min"
              data-sitekey="6LdCmi0iAAAAAM-uaWYQCJTdtBUeXbMDZ7UtGiup"
              data-theme="dark"
            ></div>
            <div class="form-control mt-6">
              <button class="btn btn-primary">{{ $t('enviar') }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>