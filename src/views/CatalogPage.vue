<template>
  <main class="content container">
    <div class="content__top">

      <div class="content__row">
        <h1 class="content__title">
          Каталог
        </h1>
        <span class="content__info">
          {{ countProducts }} товара
        </span>
      </div>
    </div>

    <div class="content__catalog">
      <ProductFilter
        v-model:filters-update="filters"
      />

      <section class="catalog" v-if="products">
        <BaseLoader height="100px" width="100px" position="auto auto" v-if="isLoading" />
        <ul class="catalog__list" v-else>
          <ProductItem
            v-for="product in products"
            :key="product.id"
            :product="product"
            :filter-color-id="colorIdFromFilter"
          />
        </ul>
        <div v-if="isLoadingFailed">
          Произошла ошибка!
          <button @click.prevent="loadProducts">Перезагрузить страницу</button>
        </div>

        <BasePagination
          v-if="countProducts"
          v-model:page="page"
          :count="countProducts"
          :per-page="productPerPage"
        />
      </section>
    </div>
  </main>
</template>

<script>
import ProductFilter from '@/components/ProductFilter.vue'
import BasePagination from '@/components/BasePagination.vue'
import { API_BASE_URL } from '@/config'
import ProductItem from '@/components/ProductItem.vue'
import BaseLoader from '@/components/loaders/BaseLoader.vue'

export default {
  name: 'CatalogPage',
  components: { BaseLoader, ProductItem, BasePagination, ProductFilter },
  data () {
    return {
      currentProductColor: null,
      isLoading: false,
      isLoadingFailed: false,
      noFoundImage: 'img/svg/no-photo.svg',
      colorIdFromFilter: null,
      filters: {
        colorIds: [],
        seasonIds: [],
        materialIds: [],
        priceFrom: 0,
        priceTo: 0,
        categoryId: 0
      },
      productPerPage: 12,
      productsData: null,
      page: 1
    }
  },
  watch: {
    page () {
      this.loadProducts()
    },
    filters: {
      handler () {
        this.loadProducts()
        if (this.filters.colorIds) {
          if (Array.isArray(this.filters.colorIds)) {
            this.colorIdFromFilter = this.filters.colorIds[0]
          } else {
            this.colorIdFromFilter = this.filters.colorIds
          }
        }
      },
      deep: true
    }
  },
  created () {
    this.loadProducts()
  },
  computed: {
    countProducts () {
      return this.productsData ? this.productsData.pagination.total : 0
    },
    products () {
      return this.productsData ? this.productsData.items
        .map((product) => {
          return {
            ...product,
            image: product.colors[0].gallery ? product.colors[0].gallery[0].file.url : this.noFoundImage,
            colorId: product.colors[0].color.id
          }
        }) : []
    }
  },
  methods: {
    async loadProducts () {
      this.isLoading = true
      this.isLoadingFailed = false
      clearTimeout(this.loadProductTimer)
      this.loadProductTimer = setTimeout(async () => {
        try {
          const response = await this.axios.get(API_BASE_URL + '/api/products', {
            params: {
              page: this.page,
              limit: this.productPerPage,
              categoryId: this.$route.params.categoryId ? this.$route.params.categoryId : this.filters.categoryId,
              minPrice: this.filters.priceFrom,
              maxPrice: this.filters.priceTo,
              colorIds: this.filters.colorIds,
              seasonIds: this.filters.seasonIds,
              materialIds: this.filters.materialIds
            }
          })
          this.productsData = await response.data
          this.isLoading = false
        } catch (error) {
          this.isLoadingFailed = true
          this.isLoading = false
        }
      }, 0)
    }
  }
}
</script>
