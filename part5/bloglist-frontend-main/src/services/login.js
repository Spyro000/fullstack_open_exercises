import axios from 'axios';

const baseUrl = '/api/login';

const getToken = async (login, password) => {
  const request = { username: login, password };
  const responce = await axios
    .post(baseUrl, request);
  return responce.data;
};

export default { getToken };
