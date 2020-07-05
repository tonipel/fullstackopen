import React from 'react'

const Total = ({ parts }) => {

    const total = parts.reduce((s, p) => (
        {exercises: s.exercises + p.exercises}
    ))
  
    return (
      <p>
        <b>
          Number of exercises {total.exercises}
        </b>
      </p>
    )
  }

export default Total
