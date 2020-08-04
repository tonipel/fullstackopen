import React, { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterText, setNewFilter ] = useState('')
  const [ personsFiltered, setNewPersonsFilter ] = useState([])
  const [ notificationMessage, setNotification ] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        setNewPersonsFilter(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const personObj = {
      name: newName,
      number: newNumber
    }

    if (persons.some(person => person.name === personObj.name)) {
      if (window.confirm(`${personObj.name} is already added to phonebook, replace the old number with new one?`)) {
        const personToUpdate = persons.find(elem => elem.name === personObj.name)
        personToUpdate.number = personObj.number

        personService
          .update(personToUpdate)
          .then(returnedPerson => {
            const newPersons = persons.map(person => person.id !== personToUpdate.id ? person : returnedPerson)
            setPersons(newPersons)
            setNewPersonsFilter(newPersons)
            setNewName('')
            setNewNumber('')
            handleNotification(`Changed phone number for ${returnedPerson.name}`)
          })
      }
    }
    else {
      personService
        .create(personObj)
        .then(returnedPerson => {
          const newPersons = persons.concat(returnedPerson)
          setPersons(newPersons)
          setNewPersonsFilter(newPersons)
          setNewName('')
          setNewNumber('')
          handleNotification(`Added ${returnedPerson.name}`)
        })
    }
  }

  const handleNotification = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const deleteName = (id) => {
    personService.deletePerson(id)
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleDelete = (person, event) => {
    event.preventDefault()
  
    if (window.confirm(`Delete ${person.name} ?`)) {
      const personsCopy = persons.filter(function(obj) {
        return obj.id !== person.id
      })

      setPersons(personsCopy)
      setNewPersonsFilter(personsCopy)
      
      deleteName(person.id)
    }
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

      <Notification message={notificationMessage}/>

      <Filter filterText={filterText}
              handleFilterChange={handleFilterChange}/>

      <h2>Add new person</h2>
      <PersonForm addName={addName}
                  newName={newName}
                  handlePersonChange={handlePersonChange}
                  newNumber={newNumber}
                  handleNumberChange={handleNumberChange}/>

      <h2>Numbers</h2>
      <Persons personsFiltered={personsFiltered}
               deleteName={deleteName}
               handleDelete={handleDelete}/>
    </div>
  )
}

export default App
