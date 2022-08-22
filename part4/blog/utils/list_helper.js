const { countBy, groupBy } = require('lodash');

// just test function, delete after
const dummy = () => 1;

// returns amount of likes of entire blog
const totalLikes = (posts) => posts
  .reduce((total, post) => total + post.likes, 0);

// returns the most favorable post
const favoriteBlog = (posts) => posts
  .reduce((most, current) => (current.likes > most.likes
    ? current : most));

// returns author with the most blogs and amount
const mostBlogs = (posts) => Object.entries(countBy(posts, 'author'))
  .map((key) => ({ author: key[0], blogs: key[1] }))
  .reduce((most, current) => (current.blogs > most.blogs
    ? current : most));

// returns author with the most likes
const mostLikes = (posts) => Object.entries(groupBy(posts, 'author'))
  .map((key) => ({
    author: key[0],
    likes: key[1].reduce((sum, current) => sum + current.likes, 0),
  }))
  .reduce((most, current) => (current.likes > most.likes
    ? current : most));

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
