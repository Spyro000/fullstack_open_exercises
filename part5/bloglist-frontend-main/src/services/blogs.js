import axios from 'axios';

const baseUrl = '/api/blogs';

// Helper inner functions
const createHeaders = (token) => ({
  Authorization: `bearer ${token}`,
});

// Api functions
const getAll = async () => {
  const responce = await axios.get(baseUrl);
  return responce.data;
};

const createNew = async (token, url, title, author) => {
  const headers = createHeaders(token);
  const newBlog = {
    url, title, author,
  };
  const responce = await axios.post(baseUrl, newBlog, { headers });
  return responce.data;
};

const update = async (token, blog) => {
  const headers = createHeaders(token);
  const newBlog = { ...blog };
  const responce = await axios.put(`${baseUrl}/${blog.id}`, newBlog, { headers });
  return responce.data;
};

export default { getAll, createNew, update };
