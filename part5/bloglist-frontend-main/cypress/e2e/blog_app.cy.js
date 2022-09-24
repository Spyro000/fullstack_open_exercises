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

  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('[type="text"]').type('username');
      cy.get('[type="password"]').type('password');
      cy.contains('login').click();
    });

    it('A blog can be created', function () {
      const newBlog = {
        title: 'title',
        author: 'authorTest',
        url: 'url',
      };

      cy.contains('newBlog').click();
      cy.get('[placeholder="Title"]').type(newBlog.title);
      cy.get('[placeholder="Author"]').type(newBlog.author);
      cy.get('[placeholder="Url"]').type(newBlog.url);

      cy.get('[type="submit"]').click();

      cy.contains(newBlog.title);
      cy.contains(newBlog.author);
    });

    describe('When blog created', function () {
      beforeEach(function () {
        const newBlog = {
          title: 'titleTest',
          author: 'authorTest',
          url: 'url',
        };

        cy.contains('newBlog').click();
        cy.get('[placeholder="Title"]').type(newBlog.title);
        cy.get('[placeholder="Author"]').type(newBlog.author);
        cy.get('[placeholder="Url"]').type(newBlog.url);

        cy.get('[type="submit"]').click();
      });

      it('User can like blog', function () {
        cy.contains('view').click();
        cy.get('[type="button"]').contains('like').click();
        cy.contains('likes 1');
      });

      it('User can delete blog', function () {
        cy.contains('view').click();
        cy.get('[type="button"]').contains('remove').click();
        cy.wait(500);
        cy.contains('authorTest').should('not.exist');
        cy.contains('titleTest').should('not.exist');
        cy.contains('Blog successfully deleted');
      });
    });
  });
});
