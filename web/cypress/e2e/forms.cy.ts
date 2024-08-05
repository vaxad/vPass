describe('forms test', () => {
    beforeEach(() => {
        cy.visit('/auth');
    })
    it("should contain correct header", () => {
        cy.getDataTest('auth-header').should('contains.text', 'Log in to vPass!');
    })
    it("should function correctly", () => {
        cy.getDataTest('login-email').as("email-input");
        cy.getDataTest('login-password').as("password-input");

        cy.get("@email-input").type('varad@gmail.com');
        cy.get("@password-input").type('varad@123');
        cy.contains("Login failed!").should("not.exist");

        cy.getDataTest('login-submit').click();
        cy.contains("Login failed!").should("exist");

        cy.get("@email-input").clear().type('varad@gmail');

        cy.getDataTest('login-submit').click();
        cy.contains("Login failed!").should("exist");


        cy.get("@email-input").clear().type('varad@gmail.com');
        cy.get("@password-input").clear().type('varad123');
        cy.getDataTest('login-submit').click();
        cy.contains("Login successful!").should("exist");

        cy.location("pathname").should("equal", "/");

        cy.contains("Get Started").click();
        cy.location("pathname").should("equal", "/passwords");
    })

    // it("intercepts-test", () => {
    //     cy.visit('/passwords');
    //     cy.intercept('GET', 'http://localhost:5000/password/all?groupId=0d46e89f-6e71-474a-9c8a-3f23090d4a91&teamId=c1937186-e63f-42c3-ac1f-de252116b673&orderBy=&isPublic=&limit=&offset=', {
    //         forceNetworkError: true
    //     })
    // })
});