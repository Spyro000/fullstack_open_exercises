/* eslint-disable no-underscore-dangle */
const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const {
    url,
    title,
    userId,
    author,
    likes,
  } = request.body;

  if (!url || !title || !userId) {
    response.status(400).end();
    return;
  }

  const user = await User.findById(userId);

  const blog = new Blog({
    url,
    title,
    user: user._id,
    author,
    likes,
  });
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogRouter.put('/:id', async (request, responce) => {
  const { title, url, likes } = request.body;
  const newBlog = {
    title,
    url,
    likes,
  };

  const updatedNote = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true });
  responce.json(updatedNote);
});

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

module.exports = blogRouter;
