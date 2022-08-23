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

describe('blog api tests', () => {
  test('GET /api/blogs returns status 200 and content in json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('GET /api/blogs returns correct amount of blogs', async () => {
    const responce = await api.get('/api/blogs');
    expect(responce.body.length).toBe(helper.initialBlogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
