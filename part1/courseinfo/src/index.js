import React from 'react';
import ReactDOM from 'react-dom';

const Header = (props) => {
  return (
    <>
      <h1>
        {props.course.name}
      </h1>
    </>
  )
}

const Part = (props) => {
  return (
    <>
      <p>
        {props.name} {props.exercise}
      </p>
    </>
  )
}

const Content = (props) => {
  return (
    <>
      {props.course.parts.map(part => (
        <Part name={part.name} exercise={part.exercises}/>
      ))}
    </>
  )
}

const Total = (props) => {
  let sum_of_exercises = 0

  props.course.parts.forEach(value => {
    sum_of_exercises += value.exercises
  });

  return (
    <p>
      Number of exercises {sum_of_exercises}
    </p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
