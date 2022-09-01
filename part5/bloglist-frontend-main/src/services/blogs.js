import axios from 'axios';

const baseUrl = '/api/blogs';

const getAll = async () => {
  const responce = await axios.get(baseUrl);
  return responce.data;
};

export default { getAll };
