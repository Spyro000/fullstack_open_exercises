import PropTypes from 'prop-types';
import { useState } from 'react';

function Blog({ blog, onAddLike }) {
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
      {`${blog.title} `}
      <button type="button" onClick={() => setHidden(!hidden)}>
        {hidden ? 'view' : 'hide'}
      </button>
      <div style={hiddenStyle}>
        <div>{blog.url}</div>
        <span>likes </span>
        {blog.likes}
        <button type="button" onClick={() => onAddLike(blog)}>like</button>
        <div>{blog.author}</div>
      </div>
    </div>
  );
}
Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    likes: PropTypes.number,
    url: PropTypes.string,
  }).isRequired,
  onAddLike: PropTypes.func.isRequired,
};

export default Blog;
