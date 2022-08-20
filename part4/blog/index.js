const http = require('http');
const app = require('./app');
const { PORT } = require('./utils/config');
const { info } = require('./utils/logger');

const server = http.createServer(app);

server.listen(PORT, () => {
  info(`Server is running on port ${PORT}`);
});
