/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
describe('Blog app', function () {
  beforeEach(function () {
    const baseUser = {
      username: 'username',
      name: 'user',
      password: 'password',
    };
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    cy.request('POST', 'http://localhost:3003/api/users', baseUser);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('log in to application');
    cy.contains('username');
    cy.contains('password');
    cy.contains('login');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('[type="text"]').type('username');
      cy.get('[type="password"]').type('password');
      cy.contains('login').click();

      cy.contains('user logged in');
    });

    it('fails with wrong credentials', function () {
      cy.get('[type="text"]').type('1username');
      cy.get('[type="password"]').type('1password');
      cy.contains('login').click();

      cy.contains('invalid username or password').should('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });
});
