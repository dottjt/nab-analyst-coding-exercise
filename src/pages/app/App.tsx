import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import './App.css';
import debounce from 'lodash.debounce';

import { WeatherForecast } from '../../util/types';

enum FetchStatus {
  NOT_YET_FETCHED="NOT_YET_FETCHED",
  IS_FETCHING="IS_FETCHING",
  FETCH_SUCCESS="FETCH_SUCCESS",
  FETCH_FAILED="FETCH_FAILED",
}

const App: React.FC = () => {
  const [ searchValue, setSearchValue ] = useState<string>('');
  const [ fetchStatus, setFetchStatus ] = useState<FetchStatus>(FetchStatus.NOT_YET_FETCHED);
  const [ weatherForecasts, setWeatherForecasts ] = useState<WeatherForecast[]>([]);

  const getSearchData = async (
    searchTerm: string,
  ): Promise<void> => {
    console.log(searchTerm);
    const searchDataURL = `http://localhost:7777/weather-search?location=${searchTerm}`;
    const response = await axios.get(searchDataURL);

    if (response.data.length > 0) {
      setWeatherForecasts(response.data);
      setFetchStatus(FetchStatus.FETCH_SUCCESS);
    } else {
      setFetchStatus(FetchStatus.FETCH_FAILED);
    }
  }

  const getSearchDataDebounce = useCallback(
    debounce(async (searchValueParam) => getSearchData(searchValueParam), 250),
    []
  );

  useEffect(() => {
    if (searchValue) {
      setFetchStatus(FetchStatus.IS_FETCHING);

      getSearchDataDebounce(searchValue);
    } else {
      setWeatherForecasts([]);
    }
  }, [getSearchDataDebounce, setWeatherForecasts, setFetchStatus, searchValue]);

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

      {fetchStatus === FetchStatus.IS_FETCHING && (
        <p>Searching forecasts...</p>
      )}
      {(fetchStatus === FetchStatus.NOT_YET_FETCHED) && (
        <>
          <p>Please input a city name to discover it's forecast!</p>
          <p>i.e. London, New York etc.</p>
        </>
      )}
      {fetchStatus === FetchStatus.FETCH_FAILED && (
        <p>No city found with that query.</p>
      )}
      {fetchStatus === FetchStatus.FETCH_SUCCESS && (
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
