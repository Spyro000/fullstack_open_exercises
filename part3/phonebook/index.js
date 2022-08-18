require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require('./models/person')

const app = express()

morgan.token('json', (req, res) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        return JSON.stringify(req.body)
    }
    else {
        return null
    }
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then((persons) => {
            response.send(persons)
        })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.send(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        response.status(400).json({ error: 'Missed name or number' })
        return
    }
    //TODO fix this block of code so that it will work with MongoDB
    /*if (persons.find(person => person.name === body.name)) {
        response.status(400).json({ error: `Name ${body.name} already exists in phonebook` })
        return
    }*/

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            response.json(person)
        })
})

app.put('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        person.number = request.body.number
        response.json(person)
    }
    else {
        response.status(400).json({ error: `Name ${request.body.name} already deleted from phonebook` })
        return
    }

})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(err => next(err))
})

app.get('/info', (request, response) => {
    response.send(`<div>Phonebook has info for ${persons.length} people</div>`
        + `<div>${new Date()}</div>`)
})

//wrong request handler
const wrongRequest = (request, responce) => {
    responce.status(404).json({error: 'wrong request'})
}
app.use(wrongRequest)

//error handling middleware
const errorHandler = (error, request, responce, next) => {
    console.log(error)
    if (error.name === 'CastError') {
        responce.status(400).send('Wrong id formatting')
    }
    next(error)
}
app.use(errorHandler)

//start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})