<script setup>
import VilaNaB from './components/VilaNaB.vue'

const lastYearOnSeriesA = 1985
const currentYear = new Date().getFullYear()
</script>

<template>
  <VilaNaB :currentYear="currentYear" :lastYearOnSeriesA="lastYearOnSeriesA" />
</template>
