<script setup>
import VilaNaB from './components/VilaNaB.vue'
import VilaNaA from './components/VilaNaA.vue'

defineProps({
  currentYear: {
    type: Number,
    required: true
  },
  lastYearOnSeriesA: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <VilaNaB
    v-if="currentYear - lastYearOnSeriesA > 0"
    :currentYear="currentYear"
    :lastYearOnSeriesA="lastYearOnSeriesA"
  />
  <VilaNaA v-else />
</template>
