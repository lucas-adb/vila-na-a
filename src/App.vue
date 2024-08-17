<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

const votes = ref([])

async function getPoll() {
  const { data } = await supabase.from('poll').select()
  console.log('data', data)
  votes.value = data
}

async function vote() {
  const { data, error } = await supabase.from('poll').insert([{ vote: 'yes' }])
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
    <li v-for="vote in votes" :key="vote.id">{{ vote.vote }}</li>
  </ul>
  <button @click="vote">Vote</button>
</template>
