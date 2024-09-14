<script setup>
import { onMounted, nextTick } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { usePollStore } from '../stores/poll'

const props = defineProps({
  currentYear: Number,
  lastYearOnSeriesA: Number
})

const pollStore = usePollStore()

const animateFills = () => {
  const fills = document.querySelectorAll('.poll__fill')
  fills.forEach((fill) => {
    fill.style.width = '0'
    fill.offsetWidth
  })
  fills[0].style.width = `${((pollStore.votes.total_true / pollStore.votes.total_votes) * 100).toFixed(2)}%`
  fills[1].style.width = `${((pollStore.votes.total_false / pollStore.votes.total_votes) * 100).toFixed(2)}%`
  fills.forEach((fill) => fill.classList.add('animate-fill'))
}

const getPoll = async () => {
  const { data, error } = await supabase.rpc('get_poll')
  if (error) return console.error('Error fetching poll:', error)
  pollStore.setVotes(data[0])
  pollStore.setLoading(false)
  await nextTick()
  animateFills()
}

const vote = async (bool) => {
  if (localStorage.getItem('vila-poll')) return
  const { error } = await supabase.from('poll').insert([{ vote: bool }])
  if (error) return console.error('Error voting:', error)
  getPoll()
  pollStore.setButtonClicked(true)
  localStorage.setItem('vila-poll', true)
}

onMounted(() => {
  if (localStorage.getItem('vila-poll')) {
    getPoll()
    pollStore.setButtonClicked(true)
  } else {
    pollStore.setLoading(false)
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
    <img
      v-if="pollStore.isLoading"
      src="@/assets/loading.svg"
      alt="animated loading icon"
      class="loading"
    />
    <template v-else>
      <div class="poll__title">Esse ano sobe?</div>
      <template v-if="!pollStore.isButtonClicked">
        <button class="poll__voting-btn" @click="() => vote(true)">Sim</button>
        <button class="poll__voting-btn" @click="() => vote(false)">Não</button>
      </template>
      <div v-else class="poll__result">
        <p>Sim</p>
        <p v-if="pollStore.votes">
          {{ ((pollStore.votes.total_true / pollStore.votes.total_votes) * 100).toFixed(2) }}%
        </p>
        <div class="poll__fill"></div>
      </div>
      <div v-if="pollStore.isButtonClicked" class="poll__result">
        <p>Não</p>
        <p v-if="pollStore.votes">
          {{ ((pollStore.votes.total_false / pollStore.votes.total_votes) * 100).toFixed(2) }}%
        </p>
        <div class="poll__fill"></div>
      </div>
      <p v-if="pollStore.votes" class="poll__total-votes">
        {{ pollStore.votes.total_votes }} votos
      </p>
    </template>
  </div>
  <a href="https://lucasalves.dev/" class="portfolio" target="_blank">lucasalves.dev</a>
</template>
