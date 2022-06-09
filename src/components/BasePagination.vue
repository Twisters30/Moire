<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a
        class="pagination__link pagination__link--arrow"
        :class="{'pagination__link--disabled':page === 1}"
        aria-label="Предыдущая страница"
        @click.prevent="prevPage(page)"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="../../public/img/svg/sprite.svg#icon-arrow-left"></use>
        </svg>
      </a>
    </li>
    <li class="pagination__item" v-for="pageNumber in pages" :key="pageNumber">
      <a
        class="pagination__link"
        :class="{'pagination__link--current': pageNumber === page }"
        @click.prevent="paginate(pageNumber)"
      >
        {{ pageNumber }}
      </a>
    </li>
    <li class="pagination__item">
      <a
        class="pagination__link pagination__link--arrow"
        :class="{'pagination__link--disabled':page >= pages}"
        aria-label="Следующая страница"
        @click.prevent="nextPage(page)"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="../../public/img/svg/sprite.svg#icon-arrow-right"></use>
        </svg>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'BasePagination',
  props: ['page', 'count', 'perPage'],
  computed: {
    pages () {
      return Math.ceil(this.count / this.perPage)
    }
  },
  methods: {
    paginate (pageNumber) {
      this.$emit('update:page', pageNumber)
    },
    nextPage (currentPage) {
      if (currentPage >= this.pages) return
      this.$emit('update:page', currentPage + 1)
    },
    prevPage (currentPage) {
      if (currentPage <= 1) return
      this.$emit('update:page', currentPage - 1)
    }
  }
}
</script>

<style scoped>

</style>
