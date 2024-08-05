import React from 'react'
import NewDropdown from './Dropdown'

describe('<NewDropdown />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<NewDropdown />)
  })
})