<template>
  <main class="content container" v-if="products">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'catalog'}">
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

      <div class="content__row">
        <h1 class="content__title">
          Оформление заказа
        </h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="sendOrder">
        <div class="cart__field">
          <div class="cart__data">
            <label class="form__label">
              <input
                v-model="formData.name"
                class="form__input"
                type="text"
                placeholder="Введите ваше полное имя"
              >
              <span class="form__value">ФИО</span>
              <span class="form__error" v-if="formError.name">{{ formError.name }}</span>
            </label>

            <label class="form__label">
              <input
                v-model="formData.address"
                class="form__input"
                type="text"
                placeholder="Введите ваш адрес"
              >
              <span class="form__value">Адрес доставки</span>
              <span class="form__error"  v-if="formError.address">{{ formError.address }}</span>
            </label>

            <label class="form__label">
              <input
                v-model="formData.phone"
                class="form__input"
                type="tel"
                placeholder="Введите ваш телефон">
              <span class="form__value">Телефон</span>
              <span class="form__error" v-if="formError.phone">{{ formError.phone }}</span>
            </label>

            <label class="form__label">
              <input
                v-model="formData.email"
                class="form__input"
                type="email"
                placeholder="Введи ваш Email">
              <span class="form__value">Email</span>
              <span class="form__error" v-if="formError.email">{{ formError.email }}</span>
            </label>

            <label class="form__label">
              <textarea
                v-model="formData.comment"
                class="form__input form__input--area"
                placeholder="Ваши пожелания"></textarea>
              <span class="form__value">Комментарий к заказу</span>
              <span class="form__error" v-if="formError.comment">{{ formError.comment }}</span>
            </label>
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="deliveryType in deliveryTypeData" :key="deliveryType.id">
                <label class="options__label">
                  <input
                    v-model="formData.deliveryTypeId"
                    class="options__radio sr-only"
                    type="radio"
                    :value="deliveryType.id"
                  >
                  <span class="options__value">
                    {{ deliveryType.title }} <b>{{ deliveryType.price }} ₽</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="paymentType in paymentTypeData" :key="paymentType.id">
                <label class="options__label">
                  <input
                    v-model="formData.paymentTypeId"
                    class="options__radio sr-only"
                    type="radio"
                    :value="paymentType.id"
                  >
                  <span class="options__value">
                    {{ paymentType.title }}
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li
              v-for="product in products"
              :key="product.id"
              class="cart__order"
            >
              <h3>{{ product.product.title }}</h3>
              <b>{{ product.price }} ₽</b>
              <span>Артикул: {{ product.id }}</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>бесплатно</b></p>
            <p>Итого: <b>{{ basketProductsQuantity }}</b> товара на сумму <b>{{ orderPrice }} ₽</b></p>
          </div>

          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </div>
        <div class="cart__error form__error-block">
          <h4>Заявка не отправлена!</h4>
          <p>
            Похоже произошла ошибка. Попробуйте отправить снова или перезагрузите страницу.
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import { API_BASE_URL } from '@/config'

export default {
  name: 'OrderPage',
  data () {
    return {
      formData: {
        deliveryTypeId: 1,
        paymentTypeId: 1
      },
      formError: {},
      deliveryTypeData: null,
      paymentTypeData: null
    }
  },
  watch: {
    'formData.deliveryTypeId' (value) {
      this.getPaymentOptions(value)
    }
  },
  computed: {
    ...mapState(['userAccessKey']),
    ...mapGetters(['getBasketProduct', 'basketProductsQuantity', 'orderPrice']),
    products () {
      return this.getBasketProduct
    }
  },
  created () {
    this.getDeliveryOptions()
    this.getPaymentOptions(1)
  },
  methods: {
    ...mapMutations(['resetBasket']),
    async getPaymentOptions (deliveryTypeId) {
      try {
        const response = await this.axios.get(API_BASE_URL + '/api/payments', {
          params: {
            deliveryTypeId: deliveryTypeId
          }
        })
        this.paymentTypeData = await response.data
      } catch (error) {
        return error
      }
    },
    async getDeliveryOptions () {
      try {
        const response = await this.axios.get(API_BASE_URL + '/api/deliveries')
        this.deliveryTypeData = await response.data
      } catch (error) {
        return error
      }
    },
    async sendOrder () {
      this.formError = {}
      try {
        await this.axios.post(API_BASE_URL + '/api/orders', {
          ...this.formData
        }, {
          params: {
            userAccessKey: this.userAccessKey
          }
        })
        this.resetBasket()
      } catch (error) {
        this.formError = error.response.data.error.request || {}
      }
    }
  }
}
</script>
