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

async function vote() {
  const { data, error } = await supabase.from('poll').insert([{ vote: false }])
  console.log('data', data)
  console.log('error', error)
  getPoll()
}

onMounted(() => {
  getPoll()
})
</script>

<template>
  <ul>
    <li>Total Votes: {{ votes.total_votes }}</li>
    <li>Total True: {{ votes.total_true }}</li>
    <li>Total False: {{ votes.total_false }}</li>
  </ul>
  <button @click="vote">Vote</button>
</template>
