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
    },
    updateProductsData (state, products) {
      state.cartProductsData = products
    },
    updateBasketLocal (state, productId) {
      state.cartProductsData = state.cartProductsData.filter(item => item.id !== productId)
    }
  },
  getters: {
    syncProductBasket (state) {
      return state.cartProductsData
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
        context.commit('updateProductsData', response.data.items)
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
        return error.data
      }
    },
    async deleteProduct (context, productId) {
      context.commit('updateBasketLocal', productId)
      try {
        await axios.delete(API_BASE_URL + '/api/baskets/products', {
          params: {
            userAccessKey: context.state.userAccessKey
          },
          data: {
            basketItemId: productId
          }
        })
      } catch (error) {
        return error.data
      }
      // context.commit('updateBasket', response.data.items)turn error.data
    }
  }
})

export default store
