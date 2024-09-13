<script setup>
import { onMounted, ref } from 'vue'
// import confettiRain from 'confetti-rain'
import audioUrl from '@/assets/bonde-do-tigrao.mp3'
import { PhPlayCircle, PhPauseCircle } from '@phosphor-icons/vue'

const audio = ref(null)
const isPlaying = ref(true)
// const canvasRef = ref(null)

onMounted(() => {
  // const canvas = canvasRef.value
  // if (canvas) {
  //   const context = canvas.getContext('2d')
  //   if (context) {
  //     const confetti = new confettiRain()
  //     confetti.start()
  //   }
  // }
  // const confetti = new confettiRain()
  // confetti.start()

  audio.value = new Audio(audioUrl)
  audio.value.loop = true
  audio.value.play()
  isPlaying.value = true
})

function toggleAudio() {
  if (audio.value) {
    if (isPlaying.value) {
      audio.value.pause()
    } else {
      audio.value.play()
    }
    isPlaying.value = !isPlaying.value
  }
}
</script>

<template>
  <!-- <canvas ref="canvasRef" width="800" height="600"></canvas> -->
  <img
    src="@/assets/happy-tiger.png"
    alt="illustration of cartoon tiger crying"
    class="tiger-img"
  />
  <div id="content-wrapper">
    <h1 class="year">Estamos na série A!</h1>
    <p class="vila-na-a-p">Viiila 🎉!</p>
    <button
      @click="toggleAudio"
      :class="isPlaying ? 'toggle-audio-btn animate-toggle' : 'toggle-audio-btn'"
    >
      <PhPauseCircle v-if="isPlaying" :size="64" weight="fill" />
      <PhPlayCircle v-else :size="64" weight="fill" />
    </button>
  </div>
  <a href="https://lucasalves.dev/" class="portfolio" target="_blank">lucasalves.dev</a>
</template>
