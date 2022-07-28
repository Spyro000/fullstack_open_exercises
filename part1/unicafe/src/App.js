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

const Statistic = ({good, neutral, bad}) => {
  return (
    <div>
      <h1>statistic</h1>

      <div>good {good}</div>
      <div>neutral {neutral}</div>
      <div>bad {bad}</div>
      <div>all {good + neutral + bad}</div>
      <div>average {(good - bad) / (good + neutral + bad)}</div>
      <div>positive {good * 100 / (good + neutral + bad)} %</div>
    </div>
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
        <Button text="good" onClick={setGoodReview}/>
        <Button text="neutral" onClick={setNeutralReview}/>
        <Button text="bad" onClick={setBadReview}/>
      </div>
      <Statistic good={good} neutral={neutral} bad={bad}/>
    </div>
  );
}

export default App;
