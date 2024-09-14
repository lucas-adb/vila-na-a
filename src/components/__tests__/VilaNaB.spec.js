import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VilaNaB from '../VilaNaB.vue'
import './setupTests'

describe('VilaNaB', () => {
  it('se o usuário não tiver votado, deve existir a enquete', () => {
    const wrapper = mount(VilaNaB)

    expect(wrapper.find('.poll').exists()).toBe(true)
  })
})
