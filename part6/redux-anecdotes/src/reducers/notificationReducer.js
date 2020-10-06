const initialState = {
  message: null
}

var timeoutId = null

const timeout = ms => {
  return new Promise(resolve => timeoutId = setTimeout(resolve, ms));
}

const notificationReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'NEW_NOTIFICATION':
      return { message: action.data }

    case 'REMOVE_NOTIFICATION':
      return { message: null }

    default:
      return state
  }
}

export const addNotification = (message, time) => {
  if (timeoutId !== null) {
    clearTimeout(timeoutId)
  }

  return async dispatch => {
    dispatch({
      type: 'NEW_NOTIFICATION',
      data: message
    })
    await timeout(time * 1000)
    dispatch({
      type: 'REMOVE_NOTIFICATION',
      data: null
    })
  }
}

export default notificationReducer