import { useState, useEffect } from 'react'
import phoneServices from './services/phones'

// components
const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange} />
    </div>
  )
}

const PersonForm = ({ onSubmit, nameValue, nameOnChange, numberValue, numberOnChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={nameValue} onChange={nameOnChange} />
      </div>
      <div>
        number: <input value={numberValue} onChange={numberOnChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ values, deleteHandler }) => {
  return (
    <div>
      {values.map((person) =>
        <div key={person.id}>
          {person.name} {person.number} <button onClick={() => deleteHandler(person.id)} >
            delete
          </button>
        </div>
      )}
    </div>
  )
}

const Message = ({text, isError}) => {
  const messageStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  const errorStyle = {...messageStyle, color: 'red'}
  
  if (text === null) {
    return null
  }

  return (
    <div style={isError ? errorStyle : messageStyle}>
      {text}
    </div>
  )
}

// main component
const App = () => {
  // -- initialize states --
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [message, setMessage] = useState({text: null, isError: false})

  // -- Hooks and useEffects
  // effects
  useEffect(() => {
    phoneServices
      .getAll()
      .then(phones => setPersons(phones))
  }, [])

  // -- Handlers --
  // add person event handler
  const addPerson = (event) => {
    event.preventDefault()
    const notAlreadyExists = () =>
      persons.every((person) => person.name !== newName)

    if (notAlreadyExists()) {
      const newPerson = { name: newName, number: newNumber }
      phoneServices
        .addNew(newPerson)
        .then(addedPerson => {
          setMessage({text: `Added ${newName}`, isError: false})
          setTimeout(() => {
            setMessage({text: null})
          }, 3000)
          setPersons(persons.concat(addedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log(error.response.data.error)
          setMessage({text: error.response.data.error, isError: true})
          setTimeout(() => {
            setMessage({text: null})
          }, 3000)
          setNewName('')
          setNewNumber('')
        })
    }

    else {
      const person = persons.find(p => p.name === newName)
      const newPerson = { ...person, number: newNumber }
      if (window.confirm(`${newName} is already added to phonebook, `
        + `replace the old number with a new one?`)) {
        phoneServices
          .modify(newPerson.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== newPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setMessage({text: `Person ${newName} already deleted`, isError: true})
            setTimeout(() => {
              setMessage({text: null})
            }, 3000)
            setPersons(persons.filter(person => person.id !== newPerson.id))
          })
      }
    }
  }

  // delete person event handler
  const deletePerson = id => {
    const personName = persons.find(person => person.id === id).name
    if (window.confirm(`Delete ${personName}`)) {
      phoneServices
        .deleteOne(id)
        .then(deletedPerson => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          setMessage({text: `Person ${personName} already deleted`, isError: true})
          setTimeout(() => {
            setMessage({text: null})
          }, 3000)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  // change handlers
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
  }

  // -- other constantes --
  const filteredPersons = filterValue.trim() ? persons.filter((person) =>
    person.name.toLowerCase().includes(filterValue.toLowerCase())
  ) : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Message text={message.text} isError={message.isError} />
      <Filter value={filterValue} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm onSubmit={addPerson} nameValue={newName} nameOnChange={handleNameChange}
        numberValue={newNumber} numberOnChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons values={filteredPersons} deleteHandler={deletePerson} />
    </div>
  )
}

export default App