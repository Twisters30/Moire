import { createStore } from 'vuex'
import axios from 'axios'
import { API_BASE_URL } from '@/config'

const store = createStore({
  modules: {},
  state: {
    cartProduct: [],
    userAccessKey: null,
    cartProductsData: [],
    orderInfo: null
  },
  mutations: {
    updateAccessKey (state, payloadAccessKey) {
      state.userAccessKey = payloadAccessKey
    }
  },
  actions: {
    async getAccessKey (context) {
      const userAccessKey = localStorage.getItem('userAccessKey')
      if (userAccessKey) {
        context.commit('updateAccessKey', userAccessKey)
        return
      }
      try {
        const response = await axios.get(API_BASE_URL + '/api/users/accessKey')
        context.commit('updateAccessKey', response.data.accessKey)
        localStorage.setItem('userAccessKey', response.data.accessKey)
      } catch (error) {
        return error.response.data
      }
    },
    async loadBasket (context) {
      try {
        const response = await axios.get(API_BASE_URL + '/api/baskets', {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        context.state.cartProductsData = await response.data
        return response.data
      } catch (error) {
        return error.response.data
      }
    },
    async addProductToBasket (context, { productId, quantity, sizeId, colorId }) {
      try {
        const response = await axios.post(API_BASE_URL + '/api/baskets/products', {
          productId: productId,
          colorId: colorId,
          sizeId: sizeId,
          quantity: quantity
        }, {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        context.state.cartProduct = await response.data
      } catch (error) {
        console.log(error)
      }
    }
  }
})

export default store
