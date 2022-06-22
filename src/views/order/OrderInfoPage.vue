<template>
  <main class="content container" v-if="isOrderInfoLoading">
    <BaseLoader width="100" height="100" position="auto"/>
  </main>
  <div class="content container" v-if="errorMessage">{{ errorMessage }}</div>
  <main v-else class="content container">
    <div class="content__top" v-if="order">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'catalog' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'cart' }">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Заказ оформлен <span>№ {{ order.id }}</span>
      </h1>
    </div>

    <section class="cart" v-if="order">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{ order.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ order.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{ order.phone }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{ order.email }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                {{ order.paymentType }}
              </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li
              v-for="product in order.basket.items"
              :key="product.id"
              class="cart__order"
            >
              <h3>{{ product.product.title }}: <b>{{ product.quantity }}шт.</b></h3>
              <b>{{ prettyPrice(product.product.price) }} ₽</b>
              <span>Артикул: {{ product.id }}</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>{{ order.deliveryType.title }}</b></p>
            <p>Итого: <b>{{ orderQuantity }}</b> товара на сумму <b>{{ prettyPrice(orderTotalPrice) }} ₽</b></p>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import BaseLoader from '@/components/loaders/BaseLoader.vue'
import numberFormat from '@/helpers/numberFormat'

export default {
  name: 'OrderInfoPage',
  components: { BaseLoader },
  data () {
    return {
      errorMessage: null,
      isOrderInfoLoading: false
    }
  },
  created () {
    this.getOrderInfo()
  },
  computed: {
    ...mapState(['orderInfo']),
    ...mapGetters(['ordersProductsQuantity']),
    orderQuantity () {
      return this.ordersProductsQuantity
    },
    orderTotalPrice () {
      return this.order.totalPrice
    },
    order () {
      return this.orderInfo
    }
  },
  methods: {
    ...mapActions(['loadOrderInfo']),
    prettyPrice (price) {
      return numberFormat(price)
    },
    getOrderInfo () {
      this.isOrderInfoLoading = true
      this.loadOrderInfo(this.$route.params.id)
        .then((error) => {
          if (error) {
            this.errorMessage = error.response.data.error.message
          }
          this.isOrderInfoLoading = false
        })
    }
  }
}
</script>
