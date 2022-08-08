import { useState, useEffect } from "react";
import axios from 'axios'

// components
const Search = ({ text, onChange }) => {
  return (
    <div>
      find countries <input value={text} onChange={onChange} />
    </div>
  )
}

const Results = ({ countries, setSearchText }) => {
  // get amount of countries
  const length = countries.length

  // if 11 and more countries
  if (length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
  // if 2 or more countries
  else if (length > 1) {
    return (
      <ListOfCountries countries={countries} setSearchText={setSearchText} />
    )
  }
  // if only one country
  else if (countries.length === 1) {
    return (
      <Country country={countries[0]} />
    )
  }
}

const ListOfCountries = ({ countries, setSearchText }) => {
  return (
    <div>
      {countries.map(country =>
        <div key={country.name.common}>
          {country.name.common} <button onClick={() => setSearchText(country.name.common)}>show</button>
        </div>
      )}
    </div>
  )
}

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>
        capital {country.capital}
      </div>
      <div>
        area {country.area}
      </div>
      <div>
        <h3>languages:</h3>
        <ul>
          {Object.values(country.languages).map(language =>
            <li key={language}>{language}</li>)}
        </ul>
      </div>
      <div style={{ 'fontSize': '1500%' }}>
        {country.flag}
      </div>
      <div>
        <h3>Weather in {country.capital}</h3>
        <Weather lat={country.capitalInfo.latlng[0]} lon={country.capitalInfo.latlng[1]} />
      </div>
    </div>
  )
}

const Weather = ({ lat, lon }) => {
  // useStates
  const [weatherData, setWeatherData] = useState({
    temp: 0,
    icon: '01d',
    speed: 0
  })

  // useEffects and their hooks
  const hook = () => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_API_KEY}`)
      .then(responce => {
        const weather = {
          temp: (responce.data.main.temp - 273.15).toFixed(1),
          icon: responce.data.weather[0].icon,
          speed: responce.data.wind.speed
        }
        setWeatherData(weather)
      })



  }
  useEffect(hook, [lat, lon])

  return (
    <div>
      <div>temperature {weatherData.temp} Celcius</div>
      <div><img src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} alt='weather icon' /></div>
      <div>Wind {weatherData.speed} m/s</div>
    </div>
  )
}

// main Component
const App = () => {
  // useStates
  const [countries, setCountries] = useState([])
  const [searchText, setSearchText] = useState('')

  // useEffects and their hooks
  const fetchCountriesHook = () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(responce => {
        setCountries(responce.data)
      })
  }

  useEffect(fetchCountriesHook, [])

  // handlers
  const handleSearchChange = (event) => {
    setSearchText(event.target.value)
  }

  // other const
  const filteredCountries = searchText.trim() ?
    countries.filter(country =>
      country.name.common.toLowerCase().includes(searchText.toLowerCase()))
    : countries

  return (
    <div>
      <Search text={searchText} onChange={handleSearchChange} />
      <Results countries={filteredCountries} setSearchText={setSearchText} />
    </div>
  )
}

export default App