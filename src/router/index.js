import { createRouter, createWebHashHistory } from 'vue-router'
import CatalogPage from '@/views/CatalogPage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'
import CartPage from '@/views/cart/CartPage.vue'
import ProductPage from '@/views/ProductPage.vue'
import OrderPage from '@/views/order/OrderPage.vue'
import OrderInfoPage from '@/views/order/OrderInfoPage.vue'
import config from '../../vue.config'

const routes = [
  { path: '/', redirect: '/catalog' },
  { path: '/catalog/:id', name: 'catalog', component: CatalogPage },
  { path: '/catalog', name: 'catalog', component: CatalogPage },
  { path: '/:catchAll(.*)', name: 'notFoundPage', component: NotFoundPage },
  { path: '/cart', name: 'cart', component: CartPage },
  { path: '/product/:id', name: 'product', component: ProductPage },
  { path: '/order', name: 'order', component: OrderPage },
  { path: '/order/:id', name: 'orderInfo', component: OrderInfoPage }
]

const router = createRouter({
  history: createWebHashHistory(config.publicPath),
  routes
})

export default router
