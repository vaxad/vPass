import NewDropdown from "@/components/Dropdown"

describe('Dropdown.cy.tsx', () => {
  it('playground', () => {
    cy.mount(<NewDropdown data={[{ name: "test", value: "10" }, { name: "test2", value: "20" }, { name: "test3", value: "30" }]} handleChange={() => { }} className="" title="Test Dropdown" ></NewDropdown>)
  })
})