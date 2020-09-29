import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { addNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter.filter)
  const dispatch = useDispatch()

  const sortAnecdotesByVotes = (anecdotes) => {
    // Sorts array without mutating the original array
    return [...anecdotes].sort((a, b) => b.votes - a.votes)
  }

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote.id))
    dispatch(addNotification(`You voted for: ${anecdote.content}`))
  }

  let filteredAnecdotes = anecdotes
  if (filter !== '') {
    filteredAnecdotes = anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  }

  return (
    <>
    {sortAnecdotesByVotes(filteredAnecdotes).map(anecdote =>
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

export default AnecdoteList
