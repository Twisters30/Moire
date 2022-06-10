<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="product.image" width="120" height="120" :alt=" product.product.title">
    </div>
    <h3 class="product__title">
      {{ product.product.title }}
    </h3>
    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i :style="{ 'backgroundColor': product.color.color.code }"></i>
        {{ product.color.color.title }}
      </span>
    </p>
    <span class="product__code">
                Артикул: {{ product.id }}
              </span>

    <ProductCounter
      v-model:count-change="updateProductAmount"
      v-model:render-key-change="renderKey"
      :key="renderKey"
    />

    <b class="product__price">
      {{ product.price }} ₽
    </b>

    <button
      @click.prevent="deleteProduct(product.id)"
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="img/svg/sprite.svg#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import ProductCounter from '@/components/ProductCounter.vue'
import { mapActions } from 'vuex'

export default {
  name: 'CartItem',
  components: { ProductCounter },
  props: ['product'],
  data () {
    return {
      renderKey: 1,
      productAmount: null
    }
  },
  computed: {
    updateProductAmount: {
      get () {
        return this.productAmount
      },
      set (value) {
        this.productAmount = value < 1 ? 1 : value
      }
    }
  },
  methods: {
    ...mapActions(['deleteProduct'])
  },
  created () {
    this.productAmount = this.product.quantity
  }
}
</script>

<style scoped>

</style>
