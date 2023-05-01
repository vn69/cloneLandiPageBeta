<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/drag">Drag</RouterLink> ||
    </nav>
  </header>

  <RouterView />
</template>

<style scoped></style>
