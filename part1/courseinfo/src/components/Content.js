import React from 'react'
import Part from './Part'

const Content = ({ course }) => {
    return (
      <>
        {course.parts.map(part => (
          <Part key={part.id} name={part.name} exercise={part.exercises}/>
        ))}
      </>
    )
  }

export default Content
