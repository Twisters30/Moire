<template>
  <router-link class="header__cart" :to="{ name: 'cart' }" aria-label="Корзина с товарами">
    <svg width="19" height="24">
      <use xlink:href="img/svg/sprite.svg#icon-cart"></use>
    </svg>
    <span class="header__count" aria-label="Количество товаров">{{ basketProductsQuantity }}</span>
    <span v-show="showPopup" class="header__popup">+{{ getBasketPopupAmount.productAdded }}</span>
  </router-link>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CartIndicator',
  props: {
    basketProductsQuantity: { type: [String, Number], default: 0 }
  },
  data () {
    return {
      showPopup: false
    }
  },
  watch: {
    'getBasketPopupAmount.renderKey' () {
      this.doShowPopup()
    }
  },
  computed: {
    ...mapGetters(['getBasketPopupAmount'])
  },
  methods: {
    doShowPopup () {
      this.showPopup = true
      setTimeout(() => {
        this.showPopup = false
      }, 1000)
    }
  }
}
</script>
<style scoped lang="scss">
.header {
  &__cart {
    position: relative;
  }
  &__popup {
    position: absolute;
    top: 0;
    right: -20px;
    color: #8BE000;
    font-size: 14px;
    opacity: 0;
    animation: popup 1s;
  }
}
@keyframes popup {
  25% {
    font-size: 16px;
    opacity: .2;
  }
  50% {
    font-size: 19px;
    opacity: .4;
  }
  75% {
    right: -100px;
    opacity: .7;
  }
  100% {
    opacity: 0;
  }
}
</style>
