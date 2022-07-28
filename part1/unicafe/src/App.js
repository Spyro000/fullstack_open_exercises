import { useState } from "react"

const Header = () => {
  return (
    <h1>give feedback</h1>
  )
}

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const Statistic = ({ good, neutral, bad }) => {
  if (good + neutral + bad > 0) {
    return (
      <div>
        <h1>statistic</h1>

        <StatisticLine text='good' value={good}/>
        <StatisticLine text='neutral' value={neutral}/>
        <StatisticLine text='bad' value={bad}/>
        <StatisticLine text='all' value={good + neutral + bad}/>
        <StatisticLine text='average' value={(good - bad) / (good + neutral + bad)}/>
        <StatisticLine text='positive %' value={good * 100 / (good + neutral + bad)}/>
      </div>
    )
  }
  else {
    return (
      <p>No feedback given</p>
    )
  }
}

const StatisticLine = ({ text, value }) => {
  return (
    <div>{text} {value}</div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setGoodReview = () => setGood(good + 1)
  const setNeutralReview = () => setNeutral(neutral + 1)
  const setBadReview = () => setBad(bad + 1)

  return (
    <div>
      <Header />
      <div>
        <Button text="good" onClick={setGoodReview} />
        <Button text="neutral" onClick={setNeutralReview} />
        <Button text="bad" onClick={setBadReview} />
      </div>
      <Statistic good={good} neutral={neutral} bad={bad} />
    </div>
  );
}

export default App;
