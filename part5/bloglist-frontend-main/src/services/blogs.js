import axios from 'axios';

const baseUrl = '/api/blogs';

const getAll = async () => {
  const responce = await axios.get(baseUrl);
  return responce.data;
};

const createNew = async (token, url, title, author) => {
  const headers = {
    Authorization: `bearer ${token}`,
  };
  const newBlog = {
    url, title, author,
  };
  const responce = await axios.post(baseUrl, newBlog, { headers });
  return responce.data;
};

export default { getAll, createNew };
