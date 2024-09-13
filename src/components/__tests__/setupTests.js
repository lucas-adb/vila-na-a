import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, afterAll } from 'vitest'

beforeEach(() => {
  const pinia = createPinia()
  setActivePinia(pinia)

  // Mock do método play
  HTMLMediaElement.prototype.play = () => Promise.resolve()
})

afterAll(() => {
  // Remover o mock do método play
  delete HTMLMediaElement.prototype.play
})
