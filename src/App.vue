<script setup>
import VilaNaB from './components/VilaNaB.vue'
import VilaNaA from './components/VilaNaA.vue'

// const lastYearOnSeriesA = 1985
const lastYearOnSeriesA = 2024
const currentYear = new Date().getFullYear()
</script>

<template>
  <VilaNaB
    v-if="currentYear - lastYearOnSeriesA > 0"
    :currentYear="currentYear"
    :lastYearOnSeriesA="lastYearOnSeriesA"
  />
  <VilaNaA v-else />
</template>
