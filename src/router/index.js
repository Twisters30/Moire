import { createRouter, createWebHashHistory } from 'vue-router'
import CatalogPage from '@/views/CatalogPage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'
import CartPage from '@/views/cart/CartPage.vue'
import ProductPage from '@/views/ProductPage.vue'
import OrderPage from '@/views/Order/OrderPage.vue'

const routes = [
  { path: '/', redirect: '/catalog' },
  { path: '/catalog', name: 'catalog', component: CatalogPage },
  { path: '/:catchAll(.*)', name: 'notFoundPage', component: NotFoundPage },
  { path: '/cart', name: 'cart', component: CartPage },
  { path: '/product/:id', name: 'product', component: ProductPage },
  { path: '/order', name: 'order', component: OrderPage }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
