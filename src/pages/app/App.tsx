import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import './App.css';
import debounce from 'lodash.debounce';

import { WeatherForecast } from '../../util/types';

const App: React.FC = () => {
  const [ searchValue, setSearchValue ] = useState<string>('');
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ weatherForecasts, setWeatherForecasts ] = useState<WeatherForecast[]>([]);

  const getSearchData = async (
    searchTerm: string,
  ): Promise<void> => {
    const searchDataURL = `http://localhost:7777/weather-search?location=${searchTerm}`;
    const response = await axios.get(searchDataURL);

    setWeatherForecasts(response.data);
    setLoading(false);
  }

  const getSearchDataDebounce = useCallback(
    debounce(async (searchValueParam) => getSearchData(searchValueParam), 250),
    []
  );

  useEffect(() => {
    if (searchValue) {
      setLoading(true);
      getSearchDataDebounce(searchValue);
    } else {
      setWeatherForecasts([]);
      setLoading(false);
    }
  }, [getSearchDataDebounce, setWeatherForecasts, setLoading, searchValue]);

  const hasNotInputCityName = !loading && weatherForecasts.length === 0 && !searchValue;
  const hasFoundCity = !loading && weatherForecasts.length > 0;

  return (
    <div className='app'>
      <h1>Five Day Weather Forecast :D</h1>
      <input
        value={searchValue}
        placeholder='i.e. Sydney'
        className='weather__forecast__input'
        aria-label='city-input'
        onChange={(e) => setSearchValue(e.target.value) }
      />

      {loading && (
        <p>Searching forecasts...</p>
      )}
      {hasNotInputCityName && (
        <>
          <p>Please input a city name to discover it's forecast!</p>
          <p>i.e. London, New York etc.</p>
        </>
      )}
      {hasFoundCity && (
        <div className='weather__forecasts__list'>
          {weatherForecasts.map(
            (weatherForecast: WeatherForecast) => (
              <WeatherForecastItem key={weatherForecast.id} weatherForecast={weatherForecast} />
            )
          )}
        </div>
      )}
    </div>
  );
}

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const WeatherForecastItem: React.FC<{ weatherForecast: WeatherForecast }> = ({ weatherForecast }) => {
  const {
    applicable_date,
    min_temp,
    max_temp,
  } = weatherForecast;

  const weatherDay: number = new Date(applicable_date).getDay();
  const weatherDayName: string = days[weatherDay];
  const minTemp = Math.round(min_temp);
  const maxTemp = Math.round(max_temp);

  return (
    <div className='weather__forecast__item'>
      <h2>{weatherDayName}</h2>
      <div><span className='temp__label'>Min:</span> {minTemp} °C</div>
      <div><span className='temp__label'>Max:</span> {maxTemp} °C</div>
    </div>
  );
}

export default App;
