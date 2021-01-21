import Koa, { Context } from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import axios from 'axios';
import bodyParser from 'koa-body';

import {
  WeatherForecast,
  WeatherForecastRaw,
  WeatherLocation
} from './serverTypes';

const doesCityMatch = (queryStringLocation: string, responseLocations: WeatherLocation[]) => (
  responseLocations.find((location: WeatherLocation) => location.title.toLowerCase() === queryStringLocation)
);

const sanitiseWeather = (consolidatedWeather: WeatherForecastRaw[]): WeatherForecast[]  => (
  consolidatedWeather.map((weather: WeatherForecastRaw) => ({
    id: weather.id,
    applicable_date: weather.applicable_date,
    min_temp: weather.min_temp,
    max_temp: weather.max_temp,
  }))
);

const app = new Koa();
const router = new Router();

const META_WEATHER_API_BASE_URL = 'https://www.metaweather.com/api';

router.get('/weather-search', async (ctx: Context) => {
  try {
    const queryStringLocation: string = ctx.query.location || '';

    const locationSearchURL: string = `${META_WEATHER_API_BASE_URL}/location/search/?query=${queryStringLocation}`;
    const locationResponse = await axios.get(locationSearchURL);

    const relevantCity: WeatherLocation = doesCityMatch(queryStringLocation, locationResponse.data);

    if (relevantCity) {
      const cityWoeid: number = relevantCity.woeid;

      const weatherLocationURL: string = `${META_WEATHER_API_BASE_URL}/location/${cityWoeid}`;
      const weatherResponse = await axios.get(weatherLocationURL);

      const weatherForecast: WeatherForecast[] = sanitiseWeather(weatherResponse.data.consolidated_weather);

      console.log(weatherForecast);

      ctx.body = weatherForecast;
    } else {
      ctx.body = [];
    }
  } catch(e) {
    ctx.status = 404;
  }
});

const main = async () => {
  app
    .use(bodyParser())
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(7777)
};

main();
