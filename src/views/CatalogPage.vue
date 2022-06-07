<template>
  <main class="content container">
    <div class="content__top">

      <div class="content__row">
        <h1 class="content__title">
          Каталог
        </h1>
        <span class="content__info">
          152 товара
        </span>
      </div>
    </div>

    <div class="content__catalog">
      <ProductFilter
        v-model:filters-update="filters"
      />

      <section class="catalog">
        <ul class="catalog__list" v-if="products">
          <ProductItem
            v-for="product in products"
            :key="product.id"
            :product="product"
            :filter-color-id="colorIdFromFilter"
          />
        </ul>

        <BasePagination
          v-model:page="page"
          :count="countProduct"
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

export default {
  name: 'CatalogPage',
  components: { ProductItem, BasePagination, ProductFilter },
  data () {
    return {
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
      productsLoading: false,
      productsLoadingFailed: false,
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
    countProduct () {
      return this.productsData ? this.productsData.pagination.total : 0
    },
    products () {
      return this.productsData ? this.productsData.items
        .map((product) => {
          return {
            ...product,
            image: product.colors[0].gallery ? product.colors[0].gallery[0].file.url : this.noFoundPage,
            colorId: product.colors[0].color.id
          }
        }) : []
    }
  },
  methods: {
    async loadProducts () {
      this.productsLoading = true
      this.productsLoadingFailed = false
      clearTimeout(this.loadProductTimer)
      this.loadProductTimer = setTimeout(async () => {
        try {
          const response = await this.axios.get(API_BASE_URL + '/api/products', {
            params: {
              page: this.page,
              limit: this.productPerPage,
              categoryId: this.filters.categoryId,
              minPrice: this.filters.priceFrom,
              maxPrice: this.filters.priceTo,
              colorIds: this.filters.colorIds,
              seasonIds: this.filters.seasonIds,
              materialIds: this.filters.materialIds
            }
          })
          this.productsData = await response.data
          this.productsLoading = false
        } catch (error) {
          this.productsLoadingFailed = true
          this.productsLoading = false
        }
      }, 0)
    }
  }
}
</script>
