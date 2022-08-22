const dummy = () => 1;

const totalLikes = (posts = []) => posts
  .reduce((total, post) => total + post.likes, 0);

module.exports = { dummy, totalLikes };
