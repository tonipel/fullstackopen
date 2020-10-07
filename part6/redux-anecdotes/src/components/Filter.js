import React from 'react'
import { connect } from 'react-redux'
import { addFilter } from '../reducers/filterReducer'

const Filter = (props) => {

  const handleChange = (event) => {
    event.preventDefault()
    const filter = event.target.value
    props.addFilter(filter)
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

const ConnectedFilter = connect(
  null,
  { addFilter }
)(Filter)

export default ConnectedFilter
