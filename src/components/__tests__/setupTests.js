import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, afterAll } from 'vitest'

beforeEach(() => {
  const pinia = createPinia()
  setActivePinia(pinia)

  // Mock do método play
  HTMLMediaElement.prototype.play = () => Promise.resolve()

  // Mock do método getContext
  HTMLCanvasElement.prototype.getContext = () => ({
    clearRect: () => {},
    drawImage: () => {},
    fillRect: () => {},
    beginPath: () => {},
    lineWidth: 1,
    strokeStyle: '',
    stroke: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {},
    fill: () => {},
    save: () => {},
    restore: () => {}
    // Adicione outros métodos conforme necessário
  })
})

afterAll(() => {
  // Remover o mock do método play
  delete HTMLMediaElement.prototype.play

  // Remover o mock do método getContext
  delete HTMLCanvasElement.prototype.getContext
})
