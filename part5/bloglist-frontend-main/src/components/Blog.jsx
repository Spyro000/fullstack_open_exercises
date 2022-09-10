import PropTypes from 'prop-types';
import { useState } from 'react';

const Blog = ({ blog, onAddLike, onRemoveBlog }) => {
  // use states
  const [hidden, setHidden] = useState(true);

  // styles
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const hiddenStyle = { display: hidden ? 'none' : '' };

  return (
    <div style={blogStyle}>
      <span>{blog.title}</span>
      <span>{blog.author}</span>
      <button type="button" onClick={() => setHidden(!hidden)}>
        {hidden ? 'view' : 'hide'}
      </button>
      <div style={hiddenStyle}>
        <div>{blog.url}</div>
        <span>likes </span>
        <span>{blog.likes}</span>
        <button type="button" onClick={() => onAddLike(blog)}>like</button>
        {onRemoveBlog && <button type="button" onClick={() => onRemoveBlog(blog)}>remove</button>}
      </div>
    </div>
  );
};
Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    likes: PropTypes.number,
    url: PropTypes.string,
  }).isRequired,
  onAddLike: PropTypes.func.isRequired,
  onRemoveBlog: PropTypes.func,
};
Blog.defaultProps = {
  onRemoveBlog: null,
};

export default Blog;
