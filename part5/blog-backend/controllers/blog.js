/* eslint-disable no-underscore-dangle */
const blogRouter = require('express').Router();
const middleware = require('../utils/middleware');
const Blog = require('../models/blog');

// Get all blogs
blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

// Add new blog
blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  // Get variables from request
  const {
    url,
    title,
    author,
    likes,
  } = request.body;
  const { user } = request;

  // Check conditions
  if (!url || !title) {
    return response.status(400).json({
      error: 'missing url or title',
    });
  }

  // If everything ok, create new blog
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
blogRouter.put('/:id', middleware.userExtractor, async (request, responce) => {
  const { user } = request;
  const blogToChange = await Blog.findById(request.params.id);

  if (user.id.toString() !== blogToChange.user.toString()) {
    return responce.status(401).json({ error: 'Permission to change blog denied' });
  }

  const { title, url, likes } = request.body;
  const newBlog = {
    title,
    url,
    likes,
  };

  const updatedNote = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true });
  return responce.json(updatedNote);
});

// Delete existing blog
blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  // Get important data
  const blogForDeletion = await Blog.findById(request.params.id);
  const { user } = request;

  // Check conditions
  if (!(blogForDeletion.user.toString() === user._id.toString())) {
    return response.status(401).json({
      error: 'permission denied',
    });
  }

  // Delete blog
  await blogForDeletion.delete();
  return response.status(204).end();
});

module.exports = blogRouter;
