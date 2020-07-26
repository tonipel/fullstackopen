import React from 'react'
import Person from './Person'

const Persons = ({ personsFiltered }) => {
  return (
    <ul>
      {personsFiltered.map((person, i) =>
          <Person key={i} person={person} />
      )}
    </ul>
  )
}

export default Persons
