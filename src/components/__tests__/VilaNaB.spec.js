import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VilaNaB from '../VilaNaB.vue'
import { createTestingPinia } from '@pinia/testing'
// import { supabase } from '@/lib/supabaseClient'

// vi.mock('../lib/supabaseClient', () => ({
//   supabase: {
//     rpc: vi.fn(),
//     from: vi.fn(() => ({
//       insert: vi.fn()
//     }))
//   }
// }))

describe('VilaNaB', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('deve exibir os botões para votar,caso não tiver votado', () => {
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
  })

  it('deve exibir o resultado da enquete, caso tiver votado', () => {
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
