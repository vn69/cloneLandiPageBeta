<template>
  <div class="view" :style="global.getStyleContainer()">
    <div class="back" @click="this.$router.push('/')">back to editor</div>
    <div v-for="item in global.data.listItem" :key="item.id">
      <ShowDragItem :item="item"></ShowDragItem>
    </div>
  </div>
</template>

<script setup>
import { useGlobalStore } from '../stores/global'
const global = useGlobalStore()

import ShowDragItem from '../components/ShowDragItem.vue';
</script>

<style scoped>
.view {
  margin: auto;
  width: 1200px;
  position: relative;
}

.back {
  position: fixed;
  top: 10px;
  left: 10px;
  background-color: rgb(255, 253, 127);
  padding: 10px;
  border-radius: 6px;
}
</style>
