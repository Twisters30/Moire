<template>
  <div class="form__counter">
    <button type="button" aria-label="Убрать один товар" @click.prevent="amount--" @click="updateRenderKey">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="img/svg/sprite.svg#icon-minus"></use>
      </svg>
    </button>

    <input type="number" v-model.number="amount" @blur="updateRenderKey">

    <button type="button" aria-label="Добавить один товар" @click.prevent="amount++" @click="updateRenderKey">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="img/svg/sprite.svg#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ProductCounter',
  props: {
    countChange: { type: Number, default: 1 },
    renderKeyChange: { type: Number, default: 1 }
  },
  computed: {
    amount: {
      get () {
        return this.countChange
      },
      set (value) {
        this.$emit('update:countChange', value)
      }
    }
  },
  methods: {
    updateRenderKey () {
      this.$emit('update:renderKeyChange', this.renderKeyChange + 1)
    }
  }
}
</script>

<style scoped>

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
