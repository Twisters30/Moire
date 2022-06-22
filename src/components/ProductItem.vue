<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{ name: 'product' , params: { id: product.id }}">
      <img
        :src="currentImage ? currentImage.gallery[0].file.url : product.image"
        :alt="product.title"
      >
    </router-link>

    <h3 class="catalog__title">
      <a>
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
      {{ prettyPrice }} ₽
    </span>

    <ul class="colors colors--black">
      <li
        class="colors__item"
        v-for="item in product.colors"
        :key="item.color.id"
      >
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            :value="item.color.id"
            v-model="checkedColor"
          >
          <span class="colors__value" :style="{ 'backgroundColor': item.color.code }"></span>
        </label>
      </li>
    </ul>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat'

export default {
  name: 'ProductItem',
  props: {
    product: { type: Object, default: () => {} },
    filterColorId: { type: Number, default: null }
  },
  data () {
    return {
      noFoundImage: 'img/svg/no-photo.svg',
      checkedColor: null
    }
  },
  watch: {
    filterColorId (colorId) {
      this.checkedColor = !colorId ? this.product.colors.find(el => el).color.id : colorId
    }
  },
  computed: {
    prettyPrice () {
      return numberFormat(this.product.price)
    },
    currentImage () {
      return this.product ? this.product.colors.find(item => {
        if (item.color.id === this.checkedColor) {
          if (!item.gallery) {
            item.gallery = []
            item.gallery.push({ file: { url: this.noFoundImage } })
          }
          return item.gallery[0].file.url
        }
      }) : {}
    }
  },
  created () {
    this.setDefaultColor()
  },
  methods: {
    setDefaultColor () {
      this.checkedColor = this.filterColorId ? this.filterColorId : this.product.colors.find(el => el).color.id
    }
  }
}
</script>
