const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);
const globalVars = {};

// Create user and get token
beforeAll(async () => {
  await User.deleteMany({});
  const user = {
    username: 'root',
    name: 'test',
    password: 'password',
  };

  const userRes = await api
    .post('/api/users')
    .send(user);

  globalVars.userId = userRes.body.id;
  const tokenRes = await api
    .post('/api/login')
    .send(user);
  globalVars.token = `bearer ${tokenRes.body.token}`;
});

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog({
    ...blog,
    user: globalVars.userId,
  }));
  const promises = blogObjects.map((blog) => blog.save());

  await Promise.all(promises);
});

// tests
describe('GET /api/blogs ', () => {
  test('returns status 200 and content in json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('returns correct amount of blogs', async () => {
    const responce = await api.get('/api/blogs');
    expect(responce.body.length).toBe(helper.initialBlogs.length);
  });

  test('returns blogs with field "id"', async () => {
    const responce = await api.get('/api/blogs');
    expect(responce.body[0].id).toBeDefined();
  });
});

describe('POST /api/blogs', () => {
  test('should return created blog responce with id', async () => {
    const testBlog = helper.getTestBlog();
    const responce = await api
      .post('/api/blogs')
      .set('authorization', globalVars.token)
      .send(testBlog);
    expect(responce.body.id).toBeDefined();
  });

  test('should increase amount of blogs by 1', async () => {
    const testBlog = helper.getTestBlog();

    await api
      .post('/api/blogs')
      .set('authorization', globalVars.token)
      .send(testBlog);

    const responce = await api.get('/api/blogs');

    expect(responce.body.length)
      .toBe(helper.initialBlogs.length + 1);
  });

  test('id of POST responce should exists in DB', async () => {
    const testBlog = helper.getTestBlog();
    const postResponce = await api
      .post('/api/blogs')
      .set('authorization', globalVars.token)
      .send(testBlog);
    const idOfResponce = postResponce.body.id;

    const getResponce = await api.get('/api/blogs');
    const allID = getResponce.body.map((blog) => blog.id);

    expect(allID).toContain(idOfResponce);
  });

  test('should save all data of request under correct ID', async () => {
    const testBlog = helper.getTestBlog();
    const postResponce = await api
      .post('/api/blogs')
      .set('authorization', globalVars.token)
      .send(testBlog);
    const idOfResponce = postResponce.body.id;

    const getResponce = await api.get('/api/blogs');
    const savedBlog = getResponce.body.find((blog) => blog.id === idOfResponce);

    expect(savedBlog).toEqual(expect.objectContaining(testBlog));
  });

  test('should set likes to 0 if no such field provided', async () => {
    const testBlog = helper.getTestBlog();
    delete testBlog.likes;
    const postResponce = await api
      .post('/api/blogs')
      .set('authorization', globalVars.token)
      .send(testBlog);
    const idOfResponce = postResponce.body.id;

    const getResponce = await api.get('/api/blogs');
    const savedBlog = getResponce.body.find((blog) => blog.id === idOfResponce);

    expect(savedBlog.likes).toBeDefined();
    expect(savedBlog.likes).toBe(0);
  });

  test('should return status 400 if title or url missing', async () => {
    const testBlogNoTitle = helper.getTestBlog();
    delete testBlogNoTitle.title;
    const testBlogNoURL = helper.getTestBlog();
    delete testBlogNoURL.url;

    await api
      .post('/api/blogs')
      .set('authorization', globalVars.token)
      .send(testBlogNoTitle)
      .expect(400);

    await api
      .post('/api/blogs')
      .set('authorization', globalVars.token)
      .send(testBlogNoURL)
      .expect(400);
  });

  test('should return status 401 if token missing', async () => {
    const testBlog = helper.getTestBlog();

    await api
      .post('/api/blogs')
      .send(testBlog)
      .expect(401);
  });
});

describe('DELETE /api/blog/:id', () => {
  test('should delete blog from DB when correct Id is presented', async () => {
    const responceBeforeDelete = await api.get('/api/blogs');
    const blogToDelete = responceBeforeDelete.body[0];
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('authorization', globalVars.token)
      .expect(204);

    const responceAfterDelete = await api.get('/api/blogs');
    const content = responceAfterDelete.body.map((n) => n.title);

    expect(responceAfterDelete.body.length).toBe(responceBeforeDelete.body.length - 1);
    expect(content).not.toContainEqual(blogToDelete.title);
  });
});

describe('PUT /api/blog/:id', () => {
  test('should change title of blog under correct id', async () => {
    const blogsBeforeChange = await api.get('/api/blogs');
    const blogToChange = blogsBeforeChange.body[0];
    blogToChange.title = 'New title';

    await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send(blogToChange);

    const blogsAfterChanging = await api.get('/api/blogs');
    const changedBlog = blogsAfterChanging.body
      .find((blog) => blog.id === blogToChange.id);

    expect(changedBlog).toEqual(blogToChange);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
