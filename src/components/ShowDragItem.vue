<template>
  <div class="block_item" :class="{'border': isDev}" v-html="item.content" :style="getStyle(item)"></div>
</template>

<script setup>
const props = defineProps({
  item: Object,
  isDev: {
    type: Boolean,
    default: false
  }
})

const getStyle = (item) => {
  return {
    top: item.boxItem.y + 'px',
    left: item.boxItem.x + 'px',
    width: item.boxItem.w + 'px',
    height: item.boxItem.h + 'px'
  }
}
</script>

<style scoped>
.block_item {
  position: absolute;
}
.border {
  border: 1px solid #33333321;
}
</style>
