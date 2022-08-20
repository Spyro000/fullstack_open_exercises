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

  return next(err);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
