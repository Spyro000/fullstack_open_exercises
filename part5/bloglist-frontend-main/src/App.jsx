/* eslint-env browser */
import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import NewBlogForm from './components/NewBlogForm';
import InfoField from './components/InfoField';
import blogService from './services/blogs';
import loginService from './services/login';

function App() {
  // Setup states
  const [blogs, setBlogs] = useState([]);
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
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

  const onCreateBlogSubmit = async (event) => {
    event.preventDefault();
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
      // TODO: add normal error handler
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
  const listOfAllBlogs = (
    <>
      {blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
    </>
  );
  const createNewBlogForm = (
    <>
      <h1>create new</h1>
      <NewBlogForm
        title={title}
        onChangeTitle={({ target }) => setTitle(target.value)}
        author={author}
        onChangeAuthor={({ target }) => setAuthor(target.value)}
        url={url}
        onChangeUrl={({ target }) => setUrl(target.value)}
        onSubmit={onCreateBlogSubmit}
      />
    </>
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
          {listOfAllBlogs}
        </>
      )}
    </div>
  );
}

export default App;
