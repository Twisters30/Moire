<template>
  <div>
   <Header :basket-products-quantity="basketProductsQuantity"/>
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: { Header, Footer },
  created () {
    this.getAccessKey()
    this.loadBasket()
  },
  computed: {
    ...mapGetters(['basketProductsQuantity'])
  },
  methods: {
    ...mapActions(['getAccessKey', 'loadBasket'])
  }
}
</script>
