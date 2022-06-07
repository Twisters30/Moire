<template>
  <aside class="filter">
    <form class="filter__form form" action="#" method="get" @submit.prevent="submitFilter">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="min-price"
            v-model.number="filterParams.currentPriceFrom"
          >
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="max-price"
            v-model.number="filterParams.currentPriceTo"
          >
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select
            class="form__select"
            v-model.number="filterParams.currentCategoryId"
          >
            <option value="0">Все категории</option>
            <option
              :value="category.id"
              v-for="category in categories" :key="category.id"
            >
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors colors--black">
          <li class="colors__item"
              v-for="color in colors"
              :key="color.id"
          >
            <label class="colors__label">
              <input
                class="colors__radio sr-only"
                type="radio"
                :value="color.id"
                v-model="filterParams.currentColor"
              >
              <span class="colors__value" :style="{ 'background-color': color.code }"></span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li class="check-list__item" v-for="material in materials" :key="material.id">
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox" :value="material.id"
                v-model="filterParams.currentMaterial"
              >
              <span class="check-list__desc">
                    {{ material.title }}
                    <span> ({{ material.productsCount }}) </span>
                  </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li
            class="check-list__item"
            v-for="season in seasons"
            :key="season.id"
          >
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                :value="season.id"
                v-model="filterParams.currentSeason"
              >
              <span class="check-list__desc">
                    {{ season.title }}
                    <span>({{ season.productsCount }})</span>
                  </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit">
        Применить
      </button>
      <button class="filter__reset button button--second" type="button" @click="resetFilter">
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import { API_BASE_URL } from '@/config'

export default {
  name: 'ProductFilter',
  props: ['filtersUpdate'],
  data () {
    return {
      filterParams: {
        currentColor: null,
        currentPriceFrom: 0,
        currentPriceTo: 0,
        currentCategoryId: 0,
        currentMaterial: [],
        currentSeason: []
      },
      categoriesData: null,
      colorsData: null,
      materialsData: null,
      seasonsData: null
    }
  },
  watch: {
    filtersUpdate: {
      handler () {
        this.filterParams = {
          currentColor: this.filtersUpdate.colorIds,
          currentPriceFrom: this.filtersUpdate.priceFrom,
          currentPriceTo: this.filtersUpdate.priceTo,
          currentCategoryId: this.filtersUpdate.categoryId,
          currentMaterial: this.filtersUpdate.materialIds,
          currentSeason: this.filtersUpdate.seasonIds
        }
      },
      deep: true
    }
  },
  computed: {
    categories () {
      return this.categoriesData ? this.categoriesData.items : []
    },
    colors () {
      return this.colorsData ? this.colorsData.items : []
    },
    materials () {
      return this.materialsData ? this.materialsData.items : []
    },
    seasons () {
      return this.seasonsData ? this.seasonsData.items : []
    }
  },
  methods: {
    submitFilter () {
      this.$emit('update:filtersUpdate',
        this.filterUpdate = {
          priceFrom: this.filterParams.currentPriceFrom,
          priceTo: this.filterParams.currentPriceTo,
          categoryId: this.filterParams.currentCategoryId,
          colorIds: this.filterParams.currentColor,
          seasonIds: this.filterParams.currentSeason,
          materialIds: this.filterParams.currentMaterial
        })
    },
    resetFilter () {
      this.$emit('update:filtersUpdate',
        this.filterUpdate = {
          priceFrom: 0,
          priceTo: 0,
          categoryId: 0,
          colorIds: [],
          seasonIds: [],
          materialIds: []
        })
    },
    async loadCategories () {
      try {
        const response = await this.axios.get(API_BASE_URL + '/api/productCategories')
        this.categoriesData = await response.data
      } catch (error) {
        console.log(error)
      }
    },
    async loadColors () {
      try {
        const response = await this.axios.get(API_BASE_URL + '/api/colors')
        this.colorsData = await response.data
      } catch (error) {
        console.log(error)
      }
    },
    async loadMaterials () {
      try {
        const response = await this.axios.get(API_BASE_URL + '/api/materials')
        this.materialsData = await response.data
      } catch (error) {
        console.log(error)
      }
    },
    async loadCollections () {
      try {
        const response = await this.axios.get(API_BASE_URL + '/api/seasons')
        this.seasonsData = await response.data
      } catch (error) {
        console.log(error)
      }
    }
  },
  created () {
    this.loadCategories()
    this.loadColors()
    this.loadMaterials()
    this.loadCollections()
  }
}
</script>
