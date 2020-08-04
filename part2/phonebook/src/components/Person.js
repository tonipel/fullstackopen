import React from 'react'

const Person = ({ person, deleteName, handleDelete }) => {
  return (
    <li>
      {person.name} {person.number}
      {' '}
      <button onClick={event => handleDelete(person, event)}>delete</button>
    </li>
  )
}

export default Person
