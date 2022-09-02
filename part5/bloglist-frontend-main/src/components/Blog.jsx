import PropTypes from 'prop-types';

function Blog({ blog }) {
  return (
    <div>
      {`${blog.title} `}
      {blog.author}
    </div>
  );
}
Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
  }).isRequired,

};

export default Blog;
