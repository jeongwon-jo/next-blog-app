describe('홈페이지 테스트', () => {
  beforeEach('접속', () => {
    cy.visit('/');
  })

  it("사이드바", () => {
    cy.get("[data-cy='sidebarLink']").click();

    cy.contains("홈")
    cy.contains("태그")
    // cy.get("[data-cy='instaLink']").should("have.attr", "href", "")

  });

  it("챗봇 페이지 이동", () => {
    cy.get("[data-cy='chatBotLink']").click()
    cy.url().should("include", "/search")
  })

  it("글 목록", () => {
    cy.get("a[href*='/posts/']").first().click()
    cy.url().should("include", "/posts/")
  })

  it("푸터", () => {
    cy.contains("프론트엔드 엔지니어 조정원")
    cy.get("[data-cy='adminLink']").click();
    cy.url().should("include", "/admin")
    cy.get("[data-cy='writeLink']").click();
    cy.url().should("not.be.a", "/write")
  })
})