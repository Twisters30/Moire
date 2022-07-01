<template>
  <div class="item__desc">
    <ul class="tabs">
      <li class="tabs__item" v-for="tab of tabData" :key="tab.title">
        <button
          type="button"
          class="tabs__link btn--reset"
          :class="{ 'tabs__link--current': tab.name === currentTab }"
          @click="currentTab = tab.name"
        >
          {{ tab.title }}
        </button>
      </li>
    </ul>

    <div class="item__content">
      <keep-alive>
        <component :is="currentTabComponent" :product="productData" />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import DeliveryRefaundTab from '@/components/tabs/DeliveryRefaundTab.vue'
import InfoTab from '@/components/tabs/InfoTab.vue'

export default {
  name: 'ProductDescriptionTabs',
  props: ['tabData', 'productData'],
  components: { DeliveryRefaundTab, InfoTab },
  data () {
    return {
      currentTab: 'Info',
      selectedTabTitle: null
    }
  },
  computed: {
    currentTabComponent () {
      return this.currentTab + 'Tab'
    }
  }
}
</script>

<style scoped>
.btn--reset {
  background-color: transparent;
  border: none;
}
</style>
