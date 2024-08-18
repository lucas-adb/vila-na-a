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

    <div class="poll__result">
      <p>Sim</p>
      <p>{{ (votes.total_true / votes.total_votes) * 100 }}%</p>
      <div
        class="poll__fill"
        :style="{ width: (votes.total_true / votes.total_votes) * 100 + '%' }"
      ></div>
    </div>

    <div class="poll__result">
      <p>Não</p>
      <p>{{ (votes.total_true / votes.total_false) * 100 }}%</p>
      <div
        class="poll__fill"
        :style="{ width: (votes.total_true / votes.total_false) * 100 + '%' }"
      ></div>
    </div>

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

<!-- <div class="poll__option poll__option--selected" id="poll__option-0">
  <div class="poll__option-info">
    <span class="poll__label">Sim</span>
    <span class="poll__percentage">100%</span>
  </div>
  <div class="poll__option-fill"></div>
</div> -->
