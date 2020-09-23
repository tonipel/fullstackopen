import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  const sortAnecdotesByVotes = (anecdotes) => {
    // Sorts array without mutating the original array
    return [...anecdotes].sort((a, b) => b.votes - a.votes)
  }

  return (
    <>
    {sortAnecdotesByVotes(anecdotes).map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => dispatch(voteAnecdote(anecdote.id))}>vote</button>
        </div>
      </div>
    )}
    </>
  )
}

export default AnecdoteList
