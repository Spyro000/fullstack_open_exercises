const dummy = () => 1;

const totalLikes = (posts = []) => posts
  .reduce((total, post) => total + post.likes, 0);

const favoriteBlog = (posts = []) => posts
  .reduce((mostPopular, current) => {
    const result = current.likes > mostPopular.likes
      ? current
      : mostPopular;
    return result;
  }, posts[0]);

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
