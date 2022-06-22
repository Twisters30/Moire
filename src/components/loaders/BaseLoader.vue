<template>
  <svg
    viewBox="0 0 90 90"
    xmlns="http://www.w3.org/2000/svg"
    :style="{ 'width': widthLoader, 'height': heightLoader, 'margin': position, 'opacity': loaderOpacity }">
    <circle fill="none" stroke-width="4" stroke-linecap="round" :stroke="loaderColor" cx="45" cy="45" r="43" />
  </svg>
</template>

<script>
export default {
  name: 'BaseLoader',
  props: ['width', 'height', 'position', 'opacity', 'color'],
  computed: {
    widthLoader () {
      return this.width ? this.width : 50
    },
    heightLoader () {
      return this.height ? this.height : 50
    },
    loaderColor () {
      return this.color ? this.color : 'gray'
    },
    loaderOpacity () {
      return this.opacity ? this.opacity : 0
    }
  }
}
</script>

<style scoped>
svg {
  display: block;
  opacity: 0;
  stroke-dasharray: 269.7405090332031px;
  stroke-dashoffset: 0;
  animation: heartBeat 10s linear reverse infinite;
  transform: rotate(-90deg);
}

@keyframes heartBeat {
  50% {
    stroke-dashoffset: 269.7405090332031px;
  }
  50.01% {
    stroke-dashoffset: -269.7405090332031px;
    opacity: 1;
  }
}
</style>
