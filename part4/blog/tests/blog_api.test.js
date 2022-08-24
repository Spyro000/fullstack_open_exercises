const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
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
      .send(testBlog);
    expect(responce.body.id).toBeDefined();
  });

  test('should increase amount of blogs by 1', async () => {
    const testBlog = helper.getTestBlog();

    await api
      .post('/api/blogs')
      .send(testBlog);

    const responce = await api.get('/api/blogs');

    expect(responce.body.length)
      .toBe(helper.initialBlogs.length + 1);
  });

  test('id of POST responce should exists in DB', async () => {
    const testBlog = helper.getTestBlog();
    const postResponce = await api
      .post('/api/blogs')
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
      .send(testBlog);
    const idOfResponce = postResponce.body.id;

    const getResponce = await api.get('/api/blogs');
    const savedBlog = getResponce.body.find((blog) => blog.id === idOfResponce);

    expect(savedBlog.likes).toBeDefined();
    expect(savedBlog.likes).toBe(0);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
