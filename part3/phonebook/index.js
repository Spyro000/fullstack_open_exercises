const { request, response } = require("express")
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

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

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const randomId = () => {
    return Math.round(Math.random() * 10000000)
}

app.get('/api/persons', (request, response) => {
    response.send(persons)
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
    if (persons.find(person => person.name === body.name)) {
        response.status(400).json({ error: `Name ${body.name} already exists in phonebook` })
        return
    }

    const person = {
        name: body.name,
        number: body.number,
        id: randomId()
    }

    persons = persons.concat(person)

    response.json(person)
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

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.get('/info', (request, response) => {
    response.send(`<div>Phonebook has info for ${persons.length} people</div>`
        + `<div>${new Date()}</div>`)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})