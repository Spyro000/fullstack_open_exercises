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
  test('should add new blog', async () => {
    const testBlog = helper.getTestBlog();

    await api
      .post('/api/blogs')
      .send(testBlog);

    const responce = await api.get('/api/blogs');
    const content = responce.body.map((blog) => {
      const entity = { ...blog };
      delete entity.id;
      return entity;
    });

    expect(content.length)
      .toBe(helper.initialBlogs.length + 1);
    expect(content).toContainEqual(testBlog);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
