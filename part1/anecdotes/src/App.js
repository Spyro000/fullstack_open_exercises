import { useState } from 'react'

// components of the App
const Anecdot = ({ anecdot, votes }) => {
  return (
    <div>
      <div>
        {anecdot}
      </div>
      <div>
        has {votes} votes
      </div>
    </div>
  )
}

const Button = ({ text, onClick }) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]

  // initialize states
  const [selected, setSelected] = useState(0)
  const [votes, setVote] = useState(Array(anecdotes.length).fill(0))

  // event handlers for buttons
  const changeAnecdote = () => {
    let indOfAnecdot = null

    do {
      indOfAnecdot = Math.floor(Math.random() * anecdotes.length)
    }
    while (indOfAnecdot === selected)

    setSelected(indOfAnecdot)
  }

  const voteAnecdote = () => {
    const copyOfVotes = [...votes]
    copyOfVotes[selected] += 1

    setVote(copyOfVotes)
  }

  // index of the anecdote with the most votes on it
  const popAncInd = votes.indexOf(Math.max(...votes))

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdot anecdot={anecdotes[selected]} votes={votes[selected]} />
      <Button text='vote' onClick={voteAnecdote} />
      <Button text='next anecdote' onClick={changeAnecdote} />
      <h1>Anecdote with the most votes</h1>
      <Anecdot anecdot={anecdotes[popAncInd]} votes={votes[popAncInd]} />
    </div>
  )
}

export default App