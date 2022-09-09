import PropTypes from 'prop-types';

const LoginForm = ({
  login, onChangeLogin,
  password, onChangePassword,
  onSubmit,
}) => (
  <form onSubmit={onSubmit}>
    <h1>log in to application</h1>
    <div>
      username
      <input type="text" value={login} onChange={onChangeLogin} />
    </div>
    <div>
      password
      <input type="password" value={password} onChange={onChangePassword} />
    </div>
    <button type="submit">login</button>
  </form>
);
LoginForm.propTypes = {
  login: PropTypes.string,
  onChangeLogin: PropTypes.func.isRequired,
  password: PropTypes.string,
  onChangePassword: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
LoginForm.defaultProps = {
  login: '',
  password: '',
};

export default LoginForm;
