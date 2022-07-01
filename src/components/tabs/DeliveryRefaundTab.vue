<template>
  <ul v-if="deliveryData">
    <li v-for="delivery of deliveryData" :key="delivery.id">{{ deliveryInfo(delivery) }}</li>
  </ul>
  <p v-else>
    {{ deliveryError }}
  </p>
</template>

<script>
import { API_BASE_URL } from '@/config'

export default {
  name: 'DeliveryRefaundTab',
  props: ['product'],
  data () {
    return {
      deliveryData: null,
      deliveryError: null,
      content: 'Информация о доставке и возврате'
    }
  },
  created () {
    this.getDelivery()
  },
  methods: {
    deliveryInfo (delivery) {
      return `${delivery.title + ' ' + 'стоимость:' + ' ' + delivery.price}`
    },
    async getDelivery () {
      try {
        const response = await this.axios.get(API_BASE_URL + '/api/deliveries')
        this.deliveryData = await response.data
      } catch (error) {
        this.deliveryError = error.response.data.error.message
      }
    }
  }
}
</script>
