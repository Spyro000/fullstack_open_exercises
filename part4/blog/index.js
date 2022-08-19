const express = require('express');

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const { info } = require('./utils/logger');
const { MONGODB_URI, PORT } = require('./utils/config');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model('Blog', blogSchema);

const mongoUrl = MONGODB_URI;
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then((blogs) => {
      response.json(blogs);
    });
});

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  info(`Server running on port ${PORT}`);
});
