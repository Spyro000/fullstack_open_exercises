import { useState, useEffect } from 'react'
import axios from 'axios'

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

const Persons = ({ values }) => {
  return (
    <div>
      {values.map((person) =>
        <div key={person.name}>{person.name} {person.number}</div>
      )}
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

  // -- Hooks and useEffects
  // hooks
  const hook = () => {
    axios
      .get('http://localhost:3001/persons')
      .then(responce => {
        const data = responce.data
        setPersons(data)
      })
  }
  // effects
  useEffect(hook, [])

  // -- Handlers --
  // add person event handler
  const addPerson = (event) => {
    event.preventDefault()

    const notAlreadyExists = () =>
      persons.every((person) => person.name !== newName)

    if (notAlreadyExists()) {
      setPersons(persons.concat(
        { name: newName, number: newNumber }
      ))
      setNewName('')
      setNewNumber('')
    }
    else {
      alert(`${newName} is already added to phonebook`)
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
      <Filter value={filterValue} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm onSubmit={addPerson} nameValue={newName} nameOnChange={handleNameChange}
        numberValue={newNumber} numberOnChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons values={filteredPersons} />
    </div>
  )
}

export default App