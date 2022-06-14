<template>
  <main class="content container" v-if="productData">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'catalog' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="#">
            {{ productData.category.title }}
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ productData.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item" v-if="selectedProduct">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img
            width="570"
            height="570"
            :src="selectedProduct.gallery[0].file.url"
            :alt="product[0].title">
        </div>
        <ul class="pics__list">
          <li class="pics__item" v-for="(image,i) in productData.colors" :key="i">
            <button
              @click.prevent="changeImage(image.color.id)"
              type="button"
               class="pics__link link--btn"
              :class="{'pics__link--current' : image.gallery[0].file.name === selectedProduct.gallery[0].file.name }">
              <img class="pics__preview" width="98" height="98" :src="image.gallery[0].file.url" :alt="productData.title">
            </button>
          </li>
        </ul>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул:{{ productData.id }}</span>
        <h2 class="item__title">
          {{ productData.title }}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST" @submit.prevent="addToBasket">
            <div class="item__row item__row--center">
              <ProductCounter
                v-model:count-change="countAmount"
                v-model:render-key-change="renderKey"
                :key="renderKey"
              />
              <b class="item__price">
                {{ productData.price }} ₽
              </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ul class="colors colors--black">
                  <li class="colors__item" v-for="item in productData.colors" :key="item.color.id">
                    <label class="colors__label">
                      <input
                        class="colors__radio sr-only"
                        type="radio"
                        name="color-item"
                        :value="item.color.id"
                        v-model="pickedColorId"
                      >
                      <span class="colors__value" :style="{'background-color': item.color.code }">
                      </span>
                    </label>
                  </li>
                </ul>
              </fieldset>
              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label class="form__label form__label--small form__label--select">
                  <select
                    class="form__select"
                    name="category"
                    v-model="sizeId"
                  >
                    <option v-for="size in productData.sizes" :key="size.id" :value="size.id">{{ size.title }}</option>
                  </select>
                </label>
              </fieldset>
            </div>

            <button class="item__button button button--primery" type="submit">
              В корзину
            </button>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link tabs__link--current">
              Информация о товаре
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Доставка и возврат
            </a>
          </li>
        </ul>

        <div class="item__content">
          <h3>Состав:</h3>

          <p>
            60% хлопок<br>
            30% полиэстер<br>
          </p>

          <h3>Уход:</h3>

          <p>
            Машинная стирка при макс. 30ºC короткий отжим<br>
            Гладить при макс. 110ºC<br>
            Не использовать машинную сушку<br>
            Отбеливать запрещено<br>
            Не подвергать химчистке<br>
          </p>

        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { API_BASE_URL } from '@/config'
import ProductCounter from '@/components/ProductCounter.vue'
import { mapActions } from 'vuex'

export default {
  name: 'ProductPage',
  components: { ProductCounter },
  data () {
    return {
      count: 1,
      noFoundImage: 'img/svg/no-photo.svg',
      sizeId: this.defaultSize,
      pickedColorId: null,
      productAmount: 1,
      renderKey: 1,
      productData: null,
      productLoading: false,
      productLoadingFailed: false,
      productAdded: false,
      productAddSending: false
    }
  },
  watch: {
    productData () {
      this.pickedColorId = this.productData.colors[0].color.id
    }
  },
  computed: {
    countAmount: {
      get () {
        return this.count
      },
      set (value) {
        this.count = value < 1 ? 1 : value
      }
    },
    defaultSize () {
      return this.productData ? this.productData.sizes[0].id : 'размеров нет'
    },
    selectedProduct () {
      this.productData.colors.forEach(item => {
        if (!item.gallery) {
          item.gallery = []
          item.gallery.push({ file: { url: this.noFoundImage } })
        }
      })
      return this.productData ? this.productData.colors
        .find(item => item.color.id === this.pickedColorId) : {}
    },
    product () {
      return this.productData ? this.productData.colors.map(item => {
        return {
          ...this.productData,
          selectedProduct: item.color.id === this.pickedColorId ? { ...item } : null,
          image: item.color.id === this.pickedColorId ? item.gallery[0].file.url : null
        }
      }) : {}
    }
  },
  created () {
    this.loadProduct()
  },
  beforeRouteUpdate () {
    this.loadProduct()
  },
  methods: {
    ...mapActions(['addProductToBasket']),
    addToBasket () {
      this.addProductToBasket({
        productId: this.productData.id,
        quantity: this.countAmount,
        sizeId: this.sizeId,
        colorId: this.selectedProduct.color.id
      })
    },
    changeImage (colorId) {
      this.pickedColorId = colorId
    },
    async loadProduct () {
      this.productLoading = true
      this.productLoadingFailed = false
      try {
        const response = await this.axios.get(API_BASE_URL + '/api/products/' + this.$route.params.id)
        this.productData = response.data
        this.productLoading = false
        this.sizeId = this.defaultSize
      } catch (error) {
        this.productLoadingFailed = true
        this.productLoading = false
      }
    }
  }
}
</script>
<style scoped lang="scss">
.form__label--select::after {
  pointer-events: none;
}
.link--btn {
  border-top: none;
  border-left: none;
  border-right: none;
  background-color: transparent;
  cursor: pointer;
}
.pics__preview {
  height: 98px;
}
.form__select {
  cursor: pointer;
  transition: background-color 500ms;
  &:hover {
    background-color: #f8f5f5;
  }
}
</style>
