<template>
  <div>
    <p v-if="product">{{ product.content ? product.content : 'Информация о продукте...' }} </p>
    <p v-else>Информация отсутствует</p>
  </div>
</template>

<script>
export default {
  name: 'InfoTab',
  props: ['product']
}
</script>

<style scoped>

</style>
