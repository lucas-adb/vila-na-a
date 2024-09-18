import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VilaNaA from '../VilaNaA.vue'
import './setupTests'

// Mock da função confettiRain
vi.mock('confetti-rain', () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        start: vi.fn()
      }
    })
  }
})

describe('VilaNaA', () => {
  let confettiRain

  beforeEach(async () => {
    // Mock do método play
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockResolvedValue()

    // Importa o mock da função confettiRain
    confettiRain = (await import('confetti-rain')).default
  })

  it('deve começar tocando o áudio quando o componente é montado', async () => {
    const wrapper = mount(VilaNaA)

    // Espera a próxima tick para garantir que o onMounted foi executado
    await wrapper.vm.$nextTick()

    // Verifica se o método play foi chamado
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()
  })

  it('deve parar o áudio quando clicar no botão de pause e voltar a tocar quando clicado novamente', async () => {
    const wrapper = mount(VilaNaA)

    // Espera a próxima tick para garantir que o onMounted foi executado
    await wrapper.vm.$nextTick()

    // Encontra o botão de pause
    const pauseButton = wrapper.find('#toggle-audio-btn')

    // Simula o clique no botão de pause
    await pauseButton.trigger('click')

    // Verifica se o método pause foi chamado
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled()

    // Simula o clique no botão de play
    await pauseButton.trigger('click')

    // Verifica se o método play foi chamado
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()
  })

  it('deve ir para nova página ao clicar no link', () => {
    const wrapper = mount(VilaNaA)

    // Encontra o link
    const link = wrapper.find('#portfolio-link')

    // Verifica se o atributo href do link é o esperado
    expect(link.attributes('href')).toBe('https://lucasalves.dev/')

    // Verifica se o link possui o atributo target="_blank"
    expect(link.attributes('target')).toBe('_blank')
  })

  it('deve iniciar a chuva de confetes quando o componente é montado', async () => {
    const wrapper = mount(VilaNaA)

    // Espera a próxima tick para garantir que o onMounted foi executado
    await wrapper.vm.$nextTick()

    // Verifica se a função confettiRain foi chamada
    expect(confettiRain).toHaveBeenCalled()

    // Verifica se o método start da chuva de confetes foi chamado
    const confettiInstance = confettiRain.mock.results[0].value
    expect(confettiInstance.start).toHaveBeenCalled()
  })
})
