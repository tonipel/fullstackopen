import React from 'react'

const Notification = ({ message }) => {

    const messageStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderEadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    if (message === null) {
      return <></>
    }
  
    return (
      <div className="message" style={messageStyle}>
        {message}
      </div>
    )
  }

export default Notification
