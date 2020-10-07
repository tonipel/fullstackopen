import React from 'react'
import { useDispatch, connect } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { addNotification } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
  const dispatch = useDispatch()

  const sortAnecdotesByVotes = (anecdotes) => {
    // Sorts array without mutating the original array
    return [...anecdotes].sort((a, b) => b.votes - a.votes)
  }

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(addNotification(`You voted for: ${anecdote.content}`, 5))
  }

  return (
    <>
    {sortAnecdotesByVotes(props.anecdotes).map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => vote(anecdote)}>vote</button>
        </div>
      </div>
    )}
    </>
  )
}

const mapStateToProps = (state) => {
  let filteredAnecdotes = state.anecdotes
  if (state.filter !== '') {
    filteredAnecdotes = state.anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(state.filter.filter.toLowerCase())
    )
  }

  return {
    anecdotes: filteredAnecdotes
  }
}

const ConnectedAnecdoteList = connect(mapStateToProps)(AnecdoteList)
export default ConnectedAnecdoteList
