const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);

describe('user creation POST /api/users', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const rootUser = new User({
      username: 'root',
      name: 'SpyFox',
      hashPassword: await bcrypt.hash('password', 10),
    });

    await rootUser.save();
  });

  it('should create new user in DB', async () => {
    const newUser = {
      username: 'newUser',
      name: 'John Smith',
      password: 'password',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect(({ body }) => {
        expect(body.username).toBe('newUser');
        expect(body.name).toBe('John Smith');
      });

    const allUsersUsernames = (await api.get('/api/users'))
      .body.map((user) => user.username);

    expect(allUsersUsernames).toContain(newUser.username);
  });

  it('should return error if username already in db', async () => {
    const newUser = {
      username: 'root',
      name: 'John Smith',
      password: 'password',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect(({ body }) => {
        expect(body.error).toBeDefined();
      });

    await api
      .get('/api/users')
      .expect(({ body }) => {
        expect(body.length).toBe(1);
      });
  });

  it('should return error if missed username', async () => {
    const newUser = {
      name: 'John Smith',
      password: 'password',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect(({ body }) => {
        expect(body.error).toBeDefined();
      });

    await api
      .get('/api/users')
      .expect(({ body }) => {
        expect(body.length).toBe(1);
      });
  });

  it('should return error if name less than 3 charapters', async () => {
    const newUser = {
      username: 'aa',
      name: 'John Smith',
      password: 'password',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect(({ body }) => {
        expect(body.error).toBeDefined();
      });

    await api
      .get('/api/users')
      .expect(({ body }) => {
        expect(body.length).toBe(1);
      });
  });

  it('should return error if password missed', async () => {
    const newUser = {
      username: 'test',
      name: 'John Smith',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect(({ body }) => {
        expect(body.error).toBeDefined();
      });

    await api
      .get('/api/users')
      .expect(({ body }) => {
        expect(body.length).toBe(1);
      });
  });

  it('should return error if password length less than 3', async () => {
    const newUser = {
      username: 'test',
      name: 'John Smith',
      password: 'aa',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect(({ body }) => {
        expect(body.error).toBeDefined();
      });

    await api
      .get('/api/users')
      .expect(({ body }) => {
        expect(body.length).toBe(1);
      });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
