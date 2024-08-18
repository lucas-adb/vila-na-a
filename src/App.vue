<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'
import { usePollStore } from './stores/poll'

const pollStore = usePollStore()
const votes = ref({})

async function getPoll() {
  const { data, error } = await supabase.rpc('get_poll')

  if (error) {
    console.error('Error fetching poll:', error)
    return
  }

  votes.value = data[0]
  console.log('poll', data)
}

async function vote(bool) {
  const vote = localStorage.getItem('vila-poll')
  if (vote) return

  const { data, error } = await supabase.from('poll').insert([{ vote: bool }])

  if (error) {
    console.error('Error voting:', error)
    return
  }

  console.log('data', data)
  getPoll()

  pollStore.setButtonClicked(true)
  localStorage.setItem('vila-poll', true)
}

onMounted(() => {
  if (localStorage.getItem('vila-poll')) {
    getPoll()
    pollStore.setButtonClicked(true)
  }
})
</script>

<template>
  <img src="./assets/sad-tiger.png" alt="illustration of cartoon tiger crying" class="tiger-img" />
  <div>
    <h1 class="year">39 anos</h1>
    <p class="description">se passaram desde que o Vila Nova disputou a série A.</p>
  </div>
  <div class="poll">
    <div class="poll__title">Esse ano sobe?</div>
    <button v-if="!pollStore.isButtonClicked" class="poll__voting-btn" @click="() => vote(true)">
      Sim
    </button>
    <button v-if="!pollStore.isButtonClicked" class="poll__voting-btn" @click="() => vote(false)">
      Não
    </button>

    <div v-if="pollStore.isButtonClicked" class="poll__result">
      <p>Sim</p>
      <p>{{ ((votes.total_true / votes.total_votes) * 100).toFixed(2) }}%</p>
      <div
        class="poll__fill"
        :style="{ width: ((votes.total_true / votes.total_votes) * 100).toFixed(2) + '%' }"
      ></div>
    </div>

    <div v-if="pollStore.isButtonClicked" class="poll__result">
      <p>Não</p>
      <p>{{ ((votes.total_false / votes.total_votes) * 100).toFixed(2) }}%</p>
      <div
        class="poll__fill"
        :style="{ width: ((votes.total_false / votes.total_votes) * 100).toFixed(2) + '%' }"
      ></div>
    </div>

    <p v-if="pollStore.isButtonClicked" class="poll__total-votes">{{ votes.total_votes }} votos</p>
  </div>
  <a href="https://lucasalves.dev/" class="portfolio" target="_blank">lucasalves.dev</a>
</template>
