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
        cy.get('#title').type('test title created by cypress')
        cy.get('#author').type('test author')
        cy.get('#url').type('test url')
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
    })
  })
})