/* eslint-disable no-underscore-dangle */
const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

// Get all blogs
blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

// Add new blog
blogRouter.post('/', async (request, response) => {
  // Get variables from request and the token
  const {
    url,
    title,
    author,
    likes,
  } = request.body;
  const { token } = request;
  const decodedToken = jwt.verify(token, process.env.SECRET);

  // Check if every important variable exists
  if (!decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid',
    });
  }
  if (!url || !title) {
    return response.status(400).json({
      error: 'missing url or title',
    });
  }

  // If everything ok, create new blog
  const user = await User.findById(decodedToken.id);

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

  return response.status(201).json(savedBlog);
});

// Change existing blog
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

// Delete existing blog
blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

module.exports = blogRouter;
