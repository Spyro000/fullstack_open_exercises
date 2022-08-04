import { useState } from 'react'

const App = () => {

  // initialize states
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilterValue] = useState('')

  //add person event handler
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

  // filtered names
  const filteredPersons = filterValue.trim() ? persons.filter((person) =>
    person.name.toLowerCase().includes(filterValue.toLowerCase())
  ) : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input value={filterValue} onChange={handleFilterChange} />
      </div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {filteredPersons.map((person) =>
        <div key={person.name}>{person.name} {person.number}</div>
      )}
    </div>
  )
}

export default App