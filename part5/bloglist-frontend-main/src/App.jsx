/* eslint-env browser */
import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import NewBlogForm from './components/NewBlogForm';
import InfoField from './components/InfoField';
import Toggable from './components/Toggable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  // Setup states
  const [blogs, setBlogs] = useState([]);
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');
  const [infoText, setInfoText] = useState('');
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState(null);

  // List of effects
  useEffect(() => {
    const fetchData = async () => {
      const blogsFromDB = await blogService.getAll();
      setBlogs(blogsFromDB);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON);
      setUser(parsedUser);
    }
  }, []);

  // Use refs
  const blogFormRef = useRef();

  // inner helper functions
  const sendMessage = (message, isErrorMessage) => {
    setInfoText(message);
    setIsError(isErrorMessage);
    setTimeout(() => {
      setInfoText('');
    }, 3000);
  };

  // list 'on' functions
  const onLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const responce = await loginService.getToken(login, password);
      window.localStorage.setItem('loggedUser', JSON.stringify(responce));
      setUser(responce);
      sendMessage(`user "${responce.username}" successfully logged in`, false);
    } catch (error) {
      sendMessage(error.response.data.error, true);
    }
  };

  const onCreateBlogSubmit = async ({ url, title, author }) => {
    blogFormRef.current.toggleVisibility();
    try {
      const responce = await blogService.createNew(user.token, url, title, author);
      const blogsFromDB = await blogService.getAll();
      setBlogs(blogsFromDB);
      sendMessage(`a new blog "${responce.title}" added`, false);
    } catch (error) {
      sendMessage(error.response.data.error, true);
    }
  };

  const onAddLike = async (blog) => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
      };
      await blogService.update(user.token, updatedBlog);
      const blogsFromDB = await blogService.getAll();
      setBlogs(blogsFromDB);
      sendMessage('like added', false);
    } catch (error) {
      sendMessage(error.response.data.error, true);
    }
  };

  const onRemoveBlog = async (blog) => {
    try {
      await blogService.deleteBlog(user.token, blog);
      const blogsFromDB = await blogService.getAll();
      setBlogs(blogsFromDB);
      sendMessage('Blog successfully deleted', false);
    } catch (error) {
      sendMessage(error.response.data.error, true);
    }
  };

  const onLogoutClick = () => {
    window.localStorage.removeItem('loggedUser');
    setUser(null);
  };

  // supportive jsx code
  const loginForm = (
    <LoginForm
      login={login}
      onChangeLogin={({ target }) => setLogin(target.value)}
      password={password}
      onChangePassword={({ target }) => setPassword(target.value)}
      onSubmit={onLoginSubmit}
    />
  );

  const createNewBlogForm = (
    <Toggable buttonName="newBlog" ref={blogFormRef}>
      <h1>create new</h1>
      <NewBlogForm onSubmit={onCreateBlogSubmit} />
    </Toggable>
  );

  // jsx result
  return (
    <div>
      <InfoField text={infoText} isError={isError} />
      {!user && loginForm}
      {user && (
        <>
          <h1>blogs</h1>
          <p>
            {`${user && user.name} `}
            logged in
            <button onClick={onLogoutClick} type="button">logout</button>
          </p>
          {createNewBlogForm}
          <div className="blogs">
            {[...blogs]
              .sort((a, b) => b.likes - a.likes)
              .map((blog) => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  onAddLike={onAddLike}
                  onRemoveBlog={blog.user.id === user.id ? onRemoveBlog : null}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
