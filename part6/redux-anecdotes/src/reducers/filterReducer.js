const initialState = {
  filter: ''
}
  
const filterReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'NEW_FILTER':
      return { filter: action.data }

    default:
      return state
  }
}

export const addFilter = (filter) => {
  return {
    type: 'NEW_FILTER',
    data: filter
  }
}

export default filterReducer