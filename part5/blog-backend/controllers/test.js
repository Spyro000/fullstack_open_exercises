const testingRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

testingRouter.post('/reset', async (request, responce) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  responce.status(204).end();
});

module.exports = testingRouter;
