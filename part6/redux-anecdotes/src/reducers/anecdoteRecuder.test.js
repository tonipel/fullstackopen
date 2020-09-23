import anecdoteReducer from './anecdoteReducer'
import deepFreeze from 'deep-freeze'

describe('anecdoteReducer', () => {
  test('returns new state with action NEW_ANECDOTE', () => {
    const state = []
    const action = {
      type: 'NEW_ANECDOTE',
      data: {
        content: 'If it hurts, do it more often',
        id: 1,
        votes: 0
      }
    }

    deepFreeze(state)
    const newState = anecdoteReducer(state, action)

    expect(newState.length).toBe(1)
    expect(newState).toContainEqual(action.data)
  })

  test('returns new state with action VOTE', () => {
    const state = [
      {
        content: 'If it hurts, do it more often',
        id: 1,
        votes: 0
      },
      {
        content: 'Adding manpower to a late software project makes it later!',
        id: 2,
        votes: 0
      }
    ]

    const action = {
      type: 'VOTE',
      data: {
        id: 2,
      }
    }

    deepFreeze(state)
    const newState = anecdoteReducer(state, action)

    expect(newState.length).toBe(2)
    expect(newState).toContainEqual(state[0])
    expect(newState).toContainEqual({
      content: 'Adding manpower to a late software project makes it later!',
      id: 2,
      votes: 1
    })
  })
})