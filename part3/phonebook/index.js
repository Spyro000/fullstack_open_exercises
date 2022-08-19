require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

morgan.token('json', (req) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    return JSON.stringify(req.body);
  }
  return null;
});

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'));
app.use(cors());
app.use(express.static('build'));

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then((persons) => {
      response.send(persons);
    });
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.send(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body;

  const person = new Person({
    name,
    number,
  });

  Person.find({ name })
    .then((result) => {
      if (result.length === 0) {
        person.save()
          .then(() => {
            response.json(person);
          })
          .catch((err) => next(err));
      } else {
        response.status(400).json({ error: `${name} already exists` });
      }
    });
});

app.put('/api/persons/:id', (request, response, next) => {
  const person = {
    number: request.body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((err) => next(err));
});

app.get('/info', (request, response) => {
  Person.find({})
    .then((persons) => {
      response.send(`<div>Phonebook has info for ${persons.length} people</div>`
        + `<div>${new Date()}</div>`);
    });
});

//  wrong request handler
const wrongRequest = (request, responce) => {
  responce.status(404).json({ error: 'wrong request' });
};
app.use(wrongRequest);

//  error handling middleware
const errorHandler = (error, request, responce, next) => {
  if (error.name === 'CastError') {
    return responce.status(400).json({ error: 'Wrong id formatting' });
  }
  if (error.name === 'ValidationError') {
    return responce.status(400).json({ error: error.message });
  }
  return next(error);
};
app.use(errorHandler);

//  start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${PORT}`);
});
