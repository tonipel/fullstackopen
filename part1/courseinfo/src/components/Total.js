import React from 'react'

const Total = ({ course }) => {
    let sum_of_exercises = 0
  
    course.parts.forEach(value => {
      sum_of_exercises += value.exercises
    });
  
    return (
      <p>
        <b>
          Number of exercises {sum_of_exercises}
        </b>
      </p>
    )
  }

export default Total
