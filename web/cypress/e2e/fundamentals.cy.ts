describe('fundamental test', () => {
  beforeEach(() => {
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjYjIzN2RjNC00ZmVlLTQ2Y2MtOThhYy0yN2IwOGIxM2U5M2MiLCJpYXQiOjE3MjI4NDc0OTIsImV4cCI6MTcyMjkzMzg5Mn0.UklhVUf8GKpD1UvUA2X6-ToMrg3TMIfDeDGLGQ_I-gg")
  })
  it('contains correct header', () => {
    cy.visit('http://localhost:3000');
    cy.getDataTest('landing-header').should('contains.text', 'vPass/Passify');
  })
  it('team changer works', () => {
    cy.visit('http://localhost:3000/passwords');
    cy.get('[data-test=drop-down-Teams-0]').should("not.exist")

    cy.get('[data-test=team-changer]', {
      timeout: 1e10
    }).click().then(() => {
      cy.get('[data-test=drop-down-Teams-0]').should("exist")
    });

  });
})