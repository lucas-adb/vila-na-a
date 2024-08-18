<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

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
  const { data, error } = await supabase.from('poll').insert([{ vote: bool }])
  console.log('data', data)
  console.log('error', error)
  getPoll()
}

onMounted(() => {
  getPoll()
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
    <button class="poll__voting-btn" @click="() => vote(true)">Sim</button>
    <button class="poll__voting-btn" @click="() => vote(false)">Não</button>
    <p class="poll__total-votes">{{ votes.total_votes }} votos</p>
  </div>
  <a href="https://lucasalves.dev/" class="portfolio" target="_blank">lucasalves.dev</a>
</template>

<!-- <ul>
  <li>Total Votes: {{ votes.total_votes }}</li>
  <li>Total True: {{ votes.total_true }}</li>
  <li>Total False: {{ votes.total_false }}</li>
</ul>
<button @click="() => vote(true)">Yes</button>
<button @click="() => vote(false)">No</button> -->
