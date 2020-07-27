import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterText, setNewFilter ] = useState('')
  const [ personsFiltered, setNewPersonsFilter ] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
        setNewPersonsFilter(response.data)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const personObj = {
      name: newName,
      number: newNumber
    }

    if (persons.some(person => person.name === personObj.name)) {
      window.alert(`${personObj.name} is already added to phonebook`)
    }
    else {
      const newPersons = persons.concat(personObj)
      setPersons(newPersons)
      setNewPersonsFilter(newPersons)
      setNewName('')
      setNewNumber('')
    }
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    const change = event.target.value
    setNewFilter(change)

    if (change === null) {
      setNewPersonsFilter(persons)
    }
    else {
      const filteredPersons = persons.filter(person =>
        person.name.toLowerCase().startsWith(change.toLowerCase())
      )
      setNewPersonsFilter(filteredPersons)
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter filterText={filterText}
              handleFilterChange={handleFilterChange}/>

      <h2>Add new person</h2>
      <PersonForm addName={addName}
                  newName={newName}
                  handlePersonChange={handlePersonChange}
                  newNumber={newNumber}
                  handleNumberChange={handleNumberChange}/>

      <h2>Numbers</h2>
      <Persons personsFiltered={personsFiltered}/>
    </div>
  )
}

export default App
