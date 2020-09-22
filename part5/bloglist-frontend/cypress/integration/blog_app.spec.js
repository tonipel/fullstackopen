describe('Blog app', function() {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'salasana'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()

      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('wrong password')
      cy.get('#login-button').click()

      cy.contains('Log in to application')
    })
  })

  describe.only('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('add new blog').click()
      cy.get('#title').type('test title created by cypress')
      cy.get('#author').type('test author')
      cy.get('#url').type('test url')
      cy.contains('create').click()

      cy.contains('test title created by cypress')
    })

    describe('Blog exists', function () {
      beforeEach(function () {
        cy.contains('add new blog').click()
        cy.get('#title').type('test title created by cypress2')
        cy.get('#author').type('test author2')
        cy.get('#url').type('test url2')
        cy.get('#create').click()
      })

      it('can like a blog', function () {
        cy.get('#view-button').click()
        cy.get('#like-button').click()
        cy.get('#likes').contains('1')
      })

      it('can delete a blog', function () {
        cy.get('#view-button').click()
        cy.get('#remove-button').click()
        cy.get('html').should('not.contain', 'test title created by cypress')
      })

      it('blogs ordered by like count', function () {
        cy.contains('add new blog').click()
        cy.get('#title').type('test title3')
        cy.get('#author').type('test author3')
        cy.get('#url').type('test url3')
        cy.get('#create').click()
        cy.get('#blogs')
          .contains('test title3')
          .contains('view')
          .click()
          .parent()
          .parent()
          .contains('like')
          .click()
          .click()

        cy.contains('add new blog').click()
        cy.get('#title').type('test title4')
        cy.get('#author').type('test author4')
        cy.get('#url').type('test url4')
        cy.get('#create').click()

        cy.get('#blogs')
          .contains('test title4')
          .contains('view')
          .click()
          .parent()
          .parent()
          .contains('like')
          .click()

        cy.get('#blogs')
          .children()
          .eq(0)
          .should('contain', 'test title3')
        cy.get('#blogs')
          .children()
          .eq(1)
          .should('contain', 'test title4')
        cy.get('#blogs')
          .children()
          .eq(2)
          .should('contain', 'test title created by cypress2')
      })
    })
  })
})