import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Header = props => <h1>{props.text}</h1>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Display = ({props}) => {
  if (props.text === 'positive') {
    return (
      <>
      <div>
        {props.text} {props.value} {"%"}
      </div>
      </>
    )
  }

  return (
    <>
    <div>
      {props.text} {props.value}
    </div>
    </>
  )
}

const Statistics = ({props}) => {
  if (props[3].value === 0) {
    // if all is zero
    return (
      <>
      <div>
        {"No feedback given"}
      </div>
      </>
    )
  }

  return (
    <>
      <Display props={props[0]} />
      <Display props={props[1]} />
      <Display props={props[2]} />
      <Display props={props[3]} />
      <Display props={props[4]} />
      <Display props={props[5]} />
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

  const props = [
    {
      text: 'good',
      value: good
    },
    {
      text: 'neutral',
      value: neutral
    },
    {
      text: 'bad',
      value: bad
    },
    {
      text: 'all',
      value: all
    },
    {
      text: 'average',
      value: average
    },
    {
      text: 'positive',
      value: positive
    },
  ]

  return (
    <>
    <Header text='give feedback'/>
    <div>
      <Button handleClick={() => setToGood(good + 1)} text="good" />
      <Button handleClick={() => setToNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setToBad(bad + 1)} text="bad" />
    </div>
    <Header text='statistics'/>
    <Statistics props={props} />
    </>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)