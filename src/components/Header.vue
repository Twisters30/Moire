<template>
  <header class="header container">
    <div class="header__wrapper">
      <router-link class="header__info" :to="{ name: 'catalog' }">Каталог</router-link>

      <router-link class="header__logo" :to="{ name: 'catalog' }">
        <img src="img/svg/logo-moire.svg" alt="Логотип интернет магазина Moire" width="116" height="34">
      </router-link>

      <a class="header__tel" href="tel:8 800 600 90 09">
        8 800 600 90 09
      </a>

      <CartIndicator />
    </div>
  </header>
</template>

<script>
import CartIndicator from '@/components/cart/CartIndicator'

export default {
  name: 'Header',
  components: { CartIndicator }
}
</script>

<style scoped>

</style>
