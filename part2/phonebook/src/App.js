import { useState } from 'react'

const App = () => {
  
  // initialize states
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

  //add person event handler
  const addPerson = (event) => {
    event.preventDefault()

    const notAlreadyExists = () =>
      persons.every((person) => person.name !== newName)

    if (notAlreadyExists()) {
      setPersons(persons.concat({
        name: newName
      }))
      setNewName('')
    }
    else {
      alert(`${newName} is already added to phonebook`)
    }
  }

  // change  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) =>
        <div key={person.name}>{person.name}</div>
      )}
    </div>
  )
}

export default App