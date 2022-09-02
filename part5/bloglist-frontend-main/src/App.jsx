/* eslint-env browser */
import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import blogService from './services/blogs';
import loginService from './services/login';

function App() {
  // Setup states
  const [blogs, setBlogs] = useState([]);
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');
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
    } catch (error) {
      // TODO: add normal error handler
      console.log(error);
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
      <h1>blogs</h1>
      <p>
        {`${user && user.name} `}
        logged in
        <button onClick={onLogoutClick} type="button">logout</button>
      </p>
      {blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
    </>
  );

  // jsx result
  return (
    <div>
      {!user ? loginForm : listOfAllBlogs}
    </div>
  );
}

export default App;
