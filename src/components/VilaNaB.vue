<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { usePollStore } from '../stores/poll'

const props = defineProps({
  currentYear: {
    type: Number,
    required: true
  },
  lastYearOnSeriesA: {
    type: Number,
    required: true
  }
})

const pollStore = usePollStore()
const votes = ref({})
const isLoading = ref(true)

function animateFills() {
  const fills = document.querySelectorAll('.poll__fill')

  fills.forEach((fill) => {
    fill.style.width = '0'
    fill.offsetWidth
  })

  fills[0].style.width = `${((votes.value.total_true / votes.value.total_votes) * 100).toFixed(2)}%`
  fills[1].style.width = `${((votes.value.total_false / votes.value.total_votes) * 100).toFixed(2)}%`

  fills.forEach((fill) => fill.classList.add('animate-fill'))
}

async function getPoll() {
  const { data, error } = await supabase.rpc('get_poll')

  if (error) {
    console.error('Error fetching poll:', error)
    return
  }

  votes.value = data[0]
  isLoading.value = false

  await nextTick()
  animateFills()
}

async function vote(bool) {
  const existingVote = localStorage.getItem('vila-poll')
  if (existingVote) return

  const { error } = await supabase.from('poll').insert([{ vote: bool }])

  if (error) {
    console.error('Error voting:', error)
    return
  }

  getPoll()

  pollStore.setButtonClicked(true)
  localStorage.setItem('vila-poll', true)
}

onMounted(async () => {
  if (localStorage.getItem('vila-poll')) {
    getPoll()
    pollStore.setButtonClicked(true)
  } else {
    isLoading.value = false
  }
})
</script>

<template>
  <img src="@/assets/sad-tiger.png" alt="illustration of cartoon tiger crying" class="tiger-img" />
  <div>
    <h1 class="year">{{ props.currentYear - props.lastYearOnSeriesA }} anos</h1>
    <p class="description">se passaram desde que o Vila Nova disputou a série A.</p>
  </div>
  <div class="poll">
    <img v-if="isLoading" src="@/assets/loading.svg" alt="animated loading icon" class="loading" />
    <template v-else>
      <div class="poll__title">Esse ano sobe?</div>
      <button v-if="!pollStore.isButtonClicked" class="poll__voting-btn" @click="() => vote(true)">
        Sim
      </button>
      <button v-if="!pollStore.isButtonClicked" class="poll__voting-btn" @click="() => vote(false)">
        Não
      </button>

      <div v-if="pollStore.isButtonClicked" class="poll__result">
        <p>Sim</p>
        <p v-if="votes.value">
          {{ ((votes.value.total_true / votes.value.total_votes) * 100).toFixed(2) }}%
        </p>
        <div class="poll__fill"></div>
      </div>

      <div v-if="pollStore.isButtonClicked" class="poll__result">
        <p>Não</p>
        <p v-if="votes.value">
          {{ ((votes.value.total_false / votes.value.total_votes) * 100).toFixed(2) }}%
        </p>
        <div class="poll__fill"></div>
      </div>

      <p v-if="pollStore.isButtonClicked && votes.value" class="poll__total-votes">
        {{ votes.value.total_votes }} votos
      </p>
    </template>
  </div>
  <a href="https://lucasalves.dev/" class="portfolio" target="_blank">lucasalves.dev</a>
</template>
