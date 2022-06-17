<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'catalog' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Корзина
        </h1>
        <span class="content__info">
          {{ basketProductsQuantity }} товара
        </span>
      </div>
    </div>

    <section class="cart" v-if="products">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="createOrder">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem
              v-for="product in products"
              :key="product.id"
              :product="product"
              @clickOnCounter="activeLoader"
            />
          </ul>
        </div>

        <div class="cart__block" v-if="isHaveProductsInBasket">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            <span ref="price" v-if="!isLoadingPrice">Итого: <span>{{ orderBasketPrice }} ₽</span></span>
            <BaseLoader v-else width="50" :height="getHeightPrice" position="auto" />
          </p>

          <button
            class="cart__button button button--primery"
            type="submit"
          >
            Оформить заказ
          </button>
        </div>
        <div class="cart__block text--center" v-else>
          <router-link
            class="cart__desc"
            :to="{ name: 'catalog' }">
            Добавте товары в корзину
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import CartItem from '@/components/cart/CartItem.vue'
import BaseLoader from '@/components/loader/BaseLoader.vue'

export default {
  name: 'CartPage',
  components: { BaseLoader, CartItem },
  data () {
    return {
      isLoadingPrice: false
    }
  },
  watch: {
    orderBasketPrice () {
      this.isLoadingPrice = false
    }
  },
  computed: {
    ...mapGetters(['getBasketProduct', 'basketProductsQuantity', 'orderBasketPrice', 'isHaveProductsInBasket']),
    getHeightPrice () {
      return this.$refs.price.offsetHeight
    },
    products () {
      return this.getBasketProduct ? this.getBasketProduct.map(item => {
        return {
          ...item,
          image: item.color.gallery.map(color => color.file.url).find(el => el)
        }
      }) : []
    }
  },
  methods: {
    createOrder () {
      this.$router.push({ name: 'order' })
    },
    activeLoader (e) {
      this.isLoadingPrice = e
    }
  }
}
</script>
<style>
.text--center {
  text-align: center;
  margin-bottom: 0;
}
</style>
