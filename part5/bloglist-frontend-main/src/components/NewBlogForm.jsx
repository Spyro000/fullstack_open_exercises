import PropTypes from 'prop-types';

function NewBlogForm({
  title, onChangeTitle,
  author, onChangeAuthor,
  url, onChangeUrl,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        title:
        <input type="text" value={title} onChange={onChangeTitle} />
      </div>
      <div>
        author:
        <input type="text" value={author} onChange={onChangeAuthor} />
      </div>
      <div>
        url:
        <input type="text" value={url} onChange={onChangeUrl} />
      </div>
      <button type="submit">create</button>
    </form>
  );
}
NewBlogForm.propTypes = {
  title: PropTypes.string,
  onChangeTitle: PropTypes.func.isRequired,
  author: PropTypes.string,
  onChangeAuthor: PropTypes.func.isRequired,
  url: PropTypes.string,
  onChangeUrl: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
NewBlogForm.defaultProps = {
  title: '',
  author: '',
  url: '',
};

export default NewBlogForm;
