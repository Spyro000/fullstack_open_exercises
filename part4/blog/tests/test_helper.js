const Blog = require('../models/blog');

const initialBlogs = require('./test_blogs');

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Temp',
    author: 'will be deleted',
    url: 'https://rerns.com/',
    likes: 23,
  });
  await blog.save();
  await blog.remove();

  // eslint-disable-next-line no-underscore-dangle
  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogsDb = await Blog.find({});
  return blogsDb;
};

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
};
