import { defineStore } from 'pinia'

export const usePollStore = defineStore('poll', {
  state: () => ({
    isButtonClicked: false,
    votes: {},
    isLoading: true
  }),
  actions: {
    setButtonClicked(value) {
      this.isButtonClicked = value
    },
    setVotes(votes) {
      this.votes = votes
    },
    setLoading(isLoading) {
      this.isLoading = isLoading
    }
  }
})
