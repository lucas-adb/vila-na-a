import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../../App.vue'
import VilaNaB from '../VilaNaB.vue'
import VilaNaA from '../VilaNaA.vue'
import './setupTests'

describe('App', () => {
  it('mostrar VilaNaB quando currentYear - lastYearOnSeriesA > 0', () => {
    const wrapper = mount(App, {
      props: {
        currentYear: 2024,
        lastYearOnSeriesA: 2021
      }
    })

    expect(wrapper.findComponent(VilaNaB).exists()).toBe(true)
    expect(wrapper.findComponent(VilaNaA).exists()).toBe(false)
  }),
    it('mostrar VilaNaA quando currentYear - lastYearOnSeriesA <= 0', () => {
      const wrapper = mount(App, {
        props: {
          currentYear: 2021,
          lastYearOnSeriesA: 2021
        }
      })

      expect(wrapper.findComponent(VilaNaB).exists()).toBe(false)
      expect(wrapper.findComponent(VilaNaA).exists()).toBe(true)
    })
})
