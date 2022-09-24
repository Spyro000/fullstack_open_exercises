/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
describe('Blog app', function () {
  beforeEach(function () {
    const baseUser = {
      username: 'username',
      user: 'user',
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
});
