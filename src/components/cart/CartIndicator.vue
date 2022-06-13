<template>
  <router-link class="header__cart" :to="{ name: 'cart' }" aria-label="Корзина с товарами">
    <svg width="19" height="24">
      <use xlink:href="img/svg/sprite.svg#icon-cart"></use>
    </svg>
    <span class="header__count" aria-label="Количество товаров">{{ basketProductsQuantity }}</span>
  </router-link>
</template>

<script>

export default {
  name: 'CartIndicator',
  props: {
    basketProductsQuantity: { type: [String, Number], default: 0 }
  }
}
</script>
