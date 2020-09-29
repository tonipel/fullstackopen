const initialState = {
  message: null
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

export const addNotification = (message) => {
  return {
    type: 'NEW_NOTIFICATION',
    data: message
  }
}

export const removeNotification = () => {
  return {
    type: 'REMOVE_NOTIFICATION',
    data: null
  }
}

export default notificationReducer