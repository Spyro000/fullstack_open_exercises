const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    return 1
}

const password = process.argv[2]

const url = `mongodb+srv://spyfox:${password}@cluster0.c4xeowl.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const getPhones = () => {
    Person
        .find({})
        .then(persons => {
            console.log('phonebook:')
            persons.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
}

const addPhone = (name, number) => {
    const person = new Person({ name, number })

    person.save()
        .then(responce => {
            mongoose.connection.close()
        })
}

mongoose
    .connect(url)
    .then(responce => {
        if (process.argv.length === 5) {
            addPhone(process.argv[3], process.argv[4])
        }
        else {
            getPhones()
        }
    })



