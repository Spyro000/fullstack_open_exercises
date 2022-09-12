import PropTypes from 'prop-types';
import { useState } from 'react';

const NewBlogForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const createBlog = (event) => {
    event.preventDefault();
    onSubmit({
      title,
      author,
      url,
    });
    setTitle('');
    setAuthor('');
    setUrl('');
  };
  return (
    <form onSubmit={createBlog}>
      <div>
        title:
        <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" />
      </div>
      <div>
        author:
        <input type="text" value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Author" />
      </div>
      <div>
        url:
        <input type="text" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Url" />
      </div>
      <button type="submit">create</button>
    </form>
  );
};
NewBlogForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default NewBlogForm;
