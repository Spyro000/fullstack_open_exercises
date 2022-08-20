const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const blogRouter = require('./controllers/blog');
const middleware = require('./utils/middleware');
const { MONGODB_URI } = require('./utils/config');
const { info, error } = require('./utils/logger');

info('connection to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    info('connected to MongoDB');
  })
  .catch((err) => {
    error('error connecting to MongoDB', err);
  });

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/blogs', blogRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
