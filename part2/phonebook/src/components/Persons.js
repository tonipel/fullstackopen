import React from 'react'
import Person from './Person'

const Persons = ({ personsFiltered, deleteName, handleDelete }) => {
  return (
    <ul>
      {personsFiltered.map((person, i) =>
          <Person key={i}
                  person={person}
                  deleteName={deleteName}
                  handleDelete={handleDelete} />
      )}
    </ul>
  )
}

export default Persons
