describe('VilaNaB', () => {
  beforeEach(() => {
    // Intercepta a requisição de votação e retorna uma resposta simulada
    cy.intercept('POST', '**/poll', {
      statusCode: 200,
      body: {}
    }).as('vote')

    // Intercepta a requisição para obter os resultados da votação e retorna uma resposta simulada
    cy.intercept('GET', '**/rpc/get_poll', {
      statusCode: 200,
      body: [
        {
          total_true: 60,
          total_false: 40,
          total_votes: 100
        }
      ]
    }).as('getPoll')
  })

  it('Checa se a votação aparece', () => {
    cy.visit('/')
    cy.get('.poll__voting-btn').should('exist')
  })

  // it('Após votar na enquete, deve exibir o resultado', () => {
  //   cy.visit('/')
  //   cy.get('.poll__voting-btn').first().click()
  //   cy.wait('@vote')
  //   cy.wait('@getPoll')
  //   cy.get('.poll__result').should('exist')
  // })
})
