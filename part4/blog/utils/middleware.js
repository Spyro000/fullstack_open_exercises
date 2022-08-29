const { info, error } = require('./logger');

const requestLogger = (request, responce, next) => {
  info('Method:', request.method);
  info('Path:', request.path);
  info('Body:', request.body);
  info('---');
  next();
};

const unknownEndpoint = (request, responce) => {
  responce.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err, request, responce, next) => {
  error(err.message);

  if (err.name === 'CastError') {
    return responce.status(400).send({ error: 'malformatted id' });
  }
  if (err.name === 'ValidationError') {
    return responce.status(400).json({ error: err.message });
  }
  if (err.name === 'JsonWebTokenError') {
    return responce.status(400).json({ error: 'wrong or missing token' });
  }

  return next(err);
};

const tokenExtractor = (request, responce, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
