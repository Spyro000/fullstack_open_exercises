const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  if (!request.body.url || !request.body.title) {
    response.status(400).end();
    return;
  }

  const blog = new Blog(request.body);
  const result = await blog.save();
  response.status(201).json(result);
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
