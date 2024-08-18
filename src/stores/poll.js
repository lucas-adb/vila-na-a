import { defineStore } from 'pinia'

export const usePollStore = defineStore('poll', {
  state: () => ({
    isButtonClicked: false
  }),
  actions: {
    setButtonClicked(value) {
      this.isButtonClicked = value
    }
  }
})
