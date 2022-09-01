const Blog = require('../models/blog');

const initialBlogs = require('./test_blogs');

const testBlog = {
  title: 'test',
  author: 'test',
  url: 'https://test.com',
  likes: 10,
};

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
  return blog.id.toString();
};

const blogsInDb = async () => {
  const blogsDb = await Blog.find({});
  return blogsDb;
};

const getTestBlog = () => ({ ...testBlog });

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
  getTestBlog,
};
