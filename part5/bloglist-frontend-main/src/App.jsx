/* eslint-env browser */
import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import NewBlogForm from './components/NewBlogForm';
import InfoField from './components/InfoField';
import Toggable from './components/Toggable';
import blogService from './services/blogs';
import loginService from './services/login';

function App() {
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
  // list 'on' functions
  const onLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const responce = await loginService.getToken(login, password);
      window.localStorage.setItem('loggedUser', JSON.stringify(responce));
      setUser(responce);
      setInfoText(`user "${responce.username}" successfully logged in`);
      setIsError(false);

      setTimeout(() => {
        setInfoText('');
      }, 3000);
    } catch (error) {
      setInfoText(error.response.data.error);
      setIsError(true);

      setTimeout(() => {
        setInfoText('');
      }, 3000);
    }
  };

  const onCreateBlogSubmit = async ({ url, title, author }) => {
    blogFormRef.current.toggleVisibility();
    try {
      const responce = await blogService.createNew(user.token, url, title, author);
      const blogsFromDB = await blogService.getAll();
      setBlogs(blogsFromDB);
      setInfoText(`a new blog "${responce.title}" added`);
      setIsError(false);

      setTimeout(() => {
        setInfoText('');
      }, 3000);
    } catch (error) {
      setInfoText(error.response.data.error);
      setIsError(true);

      setTimeout(() => {
        setInfoText('');
      }, 3000);
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

      setInfoText('like added');
      setIsError(false);
      setTimeout(() => {
        setInfoText('');
      }, 3000);
    } catch (error) {
      setInfoText(error.response.data.error);
      setIsError(true);
      setTimeout(() => {
        setInfoText('');
      }, 3000);
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
          {[...blogs]
            .sort((a, b) => a.likes < b.likes)
            .map((blog) => <Blog key={blog.id} blog={blog} onAddLike={onAddLike} />)}
        </>
      )}
    </div>
  );
}

export default App;
