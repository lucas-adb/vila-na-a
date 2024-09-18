import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VilaNaB from '../VilaNaB.vue'
import { createTestingPinia } from '@pinia/testing'
import { supabase } from '@/lib/supabaseClient'

describe('VilaNaB', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
  })

  it('deve exibir os botões para votar, caso não tiver votado', async () => {
    // Mock da função supabase.rpc
    vi.spyOn(supabase, 'rpc').mockResolvedValue({
      data: [{ total_true: 6, total_false: 4, total_votes: 10 }],
      error: null
    })

    // Mock da função supabase.from().insert()
    const insertMock = vi.fn().mockResolvedValue({ error: null })
    vi.spyOn(supabase, 'from').mockReturnValue({
      insert: insertMock
    })

    const wrapper = mount(VilaNaB, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              poll: {
                isButtonClicked: false,
                votes: {},
                isLoading: false
              }
            }
          })
        ]
      }
    })

    const votingButtons = wrapper.findAll('.poll__voting-btn')
    expect(votingButtons).toHaveLength(2)
    votingButtons.forEach((button) => {
      expect(button.element.tagName).toBe('BUTTON')
    })

    // Simula o clique no botão "Sim"
    await votingButtons[0].trigger('click')

    // Verifica se a função supabase.from().insert() foi chamada
    expect(insertMock).toHaveBeenCalledWith([{ vote: true }])

    // Verifica se a função supabase.rpc foi chamada
    expect(supabase.rpc).toHaveBeenCalledWith('get_poll')
  })

  it('deve exibir o resultado da enquete, caso tiver votado', async () => {
    // Mock da função supabase.rpc
    vi.spyOn(supabase, 'rpc').mockResolvedValue({
      data: [{ total_true: 6, total_false: 4, total_votes: 10 }],
      error: null
    })

    const wrapper = mount(VilaNaB, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              poll: {
                isButtonClicked: true,
                votes: {
                  total_false: 4,
                  total_true: 6,
                  total_votes: 10
                },
                isLoading: false
              }
            }
          })
        ]
      }
    })

    // checa se os botões de votação não estão presentes
    const votingButtons = wrapper.findAll('.poll__voting-btn')
    expect(votingButtons).toHaveLength(0)

    // checa se o resultado da enquete está correto
    const results = wrapper.findAll('.poll__result')
    expect(results).toHaveLength(2)

    const positiveResultsParagraphs = results[0].findAll('p')
    expect(positiveResultsParagraphs).toHaveLength(2)
    expect(positiveResultsParagraphs[0].text()).toBe('Sim')
    expect(positiveResultsParagraphs[1].text()).toBe('60.00%')

    const negativeResultsParagraphs = results[1].findAll('p')
    expect(negativeResultsParagraphs).toHaveLength(2)
    expect(negativeResultsParagraphs[0].text()).toBe('Não')
    expect(negativeResultsParagraphs[1].text()).toBe('40.00%')

    // checa se o total de votos está correto
    const totalVotes = wrapper.find('.poll__total-votes')
    expect(totalVotes.text()).toBe('10 votos')
  })
})
