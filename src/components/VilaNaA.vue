<script setup>
import { onMounted } from 'vue'
import confettiRain from 'confetti-rain'

onMounted(() => {
  const confetti = new confettiRain()
  confetti.start()
})
</script>

<template>
  <img
    src="@/assets/happy-tiger.png"
    alt="illustration of cartoon tiger crying"
    class="tiger-img"
  />
  <div id="content-wrapper">
    <h1 class="year">Estamos na série A!</h1>
    <p class="vila-na-a-p">Viiila 🎉!</p>
  </div>
  <a href="https://lucasalves.dev/" class="portfolio" target="_blank">lucasalves.dev</a>
</template>
