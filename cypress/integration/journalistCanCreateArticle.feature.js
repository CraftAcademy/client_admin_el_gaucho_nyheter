describe("Journalist can create article", () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: "POST",
      url: "http://localhost:3000/api/v1/auth/sign_in",
      response: "fixture:login_journalist.json",
    });
    cy.route({
      method: "GET",
      url: "http://localhost:3000/api/v1/auth/**",
      response: "fixture:login_journalist.json",
    });
    // cy.route({
    //   method: "POST",
    //   url: "**/journalist/articles",
    //   response: { message: "Article successfully created" },
    // });
    cy.visit("/");
    cy.get('[data-cy="login-form"]').within(() => {
      cy.get('[data-cy="email"]').type("journalist@mail.com");
      cy.get('[data-cy="password"]').type("password");
      cy.get('[data-cy="button"]').contains("Submit").click();
    });
  });
  context("successfully created", () => {
    beforeEach(() => {
      cy.route({
        method: "POST",
        url: "**/journalist/articles",
        response: { message: "Article successfully created" },
      });
    });
    it("journalist can successfully create articles", () => {
      cy.get('[data-cy="create-article"]').contains("Create Article").click();
      cy.get('[data-cy="form-article"]').within(() => {
        cy.get('[data-cy="title"]').type("Title");
        cy.get('[data-cy="lead"]').type("Lead");
        cy.get('[data-cy="category"]').click();
        cy.get('[data-cy="category"]').contains("Politics").click();
      });
      cy.get('[data-cy="content"]').type("Content");
      cy.get('[data-cy="save-article"]').contains("Save Article").click();
      cy.get('[data-cy="save-article-message"]').should(
        "contain",
        "Article successfully created"
      );
    });
  });

  context("unsuccessfully", () => {
    before(() => {
      cy.server();
      cy.route({
        method: "POST",
        url: "http://localhost:3000/api/v1/journalist/articles",
        response: { message: "Title can't be blank" },
      });
    });
    it("unsuccessfully without title", () => {
      cy.get('[data-cy="create-article"]').contains("Create Article").click();
      cy.get('[data-cy="form-article"]').within(() => {
        cy.get('[data-cy="lead"]').type("Lead");
        cy.get('[data-cy="category"]').click();
        cy.get('[data-cy="category"]').contains("Politics").click();
      });
      cy.get('[data-cy="content"]').type("Content");
      cy.get('[data-cy="save-article"]').contains("Save Article").click();
      cy.get('[data-cy="save-article-message"]').should(
        "contain",
        "Title can't be blank"
      );
    });
  });
});
