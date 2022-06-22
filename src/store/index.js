import { createStore } from 'vuex'
import axios from 'axios'
import { API_BASE_URL } from '@/config'

const store = createStore({
  modules: {},
  state: {
    basketPopupCount: { productAdded: 0, renderKey: 1 },
    basketProducts: [],
    userAccessKey: null,
    cartProductsData: [],
    orderInfo: null
  },
  mutations: {
    getBasketPopupAmount (state, productAmountAdded) {
      state.basketPopupCount.productAdded = productAmountAdded
      state.basketPopupCount.renderKey = state.basketPopupCount.renderKey + 1
    },
    updateOrderInfo (state, orderInfo) {
      state.orderInfo = orderInfo
    },
    resetBasket (state) {
      state.basketProducts = []
      state.cartProductsData = []
    },
    updateAccessKey (state, payloadAccessKey) {
      state.userAccessKey = payloadAccessKey
    },
    updateBasketProductsData (state, products) {
      state.cartProductsData = products
    },
    updateBasketProducts (state, products) {
      state.basketProducts = products
    },
    updateBasketLocal (state, productId) {
      state.basketProducts = state.basketProducts.filter(item => item.id !== productId)
    }
  },
  getters: {
    getBasketPopupAmount (state) {
      return state.basketPopupCount
    },
    isHaveProductsInBasket (state) {
      return state.basketProducts.length
    },
    getBasketProduct (state) {
      return state.basketProducts
    },
    orderBasketPrice (state) {
      return state.basketProducts ? state.basketProducts.reduce((accum, currentValue) => {
        return accum + (currentValue.price * currentValue.quantity)
      }, 0) : 0
    },
    basketProductsQuantity (state) {
      return state.basketProducts ? state.basketProducts.reduce((accum, currentValue) => {
        return accum + currentValue.quantity
      }, 0) : 0
    },
    ordersProductsQuantity (state) {
      return state.orderInfo ? state.orderInfo.basket.items.reduce((accum, currentValue) => {
        return accum + currentValue.quantity
      }, 0) : 0
    }
  },
  actions: {
    async loadOrderInfo (context, orderId) {
      let errorOrderInfo = null
      try {
        const response = await axios
          .get(API_BASE_URL + '/api/orders/' + orderId, {
            params: {
              userAccessKey: context.state.userAccessKey
            }
          })
        context.commit('updateOrderInfo', await response.data)
      } catch (error) {
        errorOrderInfo = error
      }
      return errorOrderInfo
    },
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
        context.commit('updateBasketProductsData', response.data.items)
        context.commit('updateBasketProducts', response.data.items)
      } catch (error) {
        return error
      }
    },
    async addProductToBasket (context, { productId, quantity, sizeId, colorId }) {
      let isError = null
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
        context.commit('getBasketPopupAmount', quantity)
        await context.dispatch('loadBasket')
      } catch (error) {
        isError = error
      }
      return isError
    },
    async updateBasketProductQuantity (context, { productId, quantity }) {
      if (quantity < 1) return
      try {
        const response = await axios.put(API_BASE_URL + '/api/baskets/products', {
          basketItemId: productId,
          quantity: quantity
        }, {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        await context.commit('updateBasketProducts', response.data.items)
      } catch (error) {
        return error.response.data
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
        return error.response.data
      }
    }
  }
})

export default store
