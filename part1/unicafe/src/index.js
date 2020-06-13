import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Header = props => <h1>{props.text}</h1>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Display = props => {
  if (props.tail) {
    return (
      <>
      <div>
        {props.name} {props.value} {props.tail}
      </div>
      </>
    )
  }
  return (
    <>
    <div>
      {props.name} {props.value}
    </div>
    </>
  )
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const setToGood = newValue => {
    setGood(newValue)
    setAll(newValue+neutral+bad)
    setAverage((newValue-bad)/(newValue+neutral+bad))
    setPositive(newValue/(newValue+neutral+bad)*100)
  }

  const setToNeutral = newValue => {
    setNeutral(newValue)
    setAll(good+newValue+bad)
    setAverage((good-bad)/(good+newValue+bad))
    setPositive(good/(good+newValue+bad)*100)
  }

  const setToBad = newValue => {
    setBad(newValue)
    setAll(good+neutral+newValue)
    setAverage((good-newValue)/(good+neutral+newValue))
    setPositive(good/(good+neutral+newValue)*100)
  }

  return (
    <>
    <Header text='give feedback'/>
    <div>
      <Button handleClick={() => setToGood(good + 1)} text="good" />
      <Button handleClick={() => setToNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setToBad(bad + 1)} text="bad" />
    </div>
    <Header text='statistics'/>
    <Display value={good} name='good' />
    <Display value={neutral} name='neutral' />
    <Display value={bad} name='bad' />
    <Display value={all} name='all' />
    <Display value={average} name='average' />
    <Display value={positive} name='positive' tail='%' />
    </>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)