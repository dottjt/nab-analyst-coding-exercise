import React from 'react';
import {
  waitFor,
  fireEvent,
  render,
  screen
} from '@testing-library/react';
import axios from 'axios';

import App from './App';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('App', () => {
  test('should show generic loading state when no input has been entered, or if not city has been found.', async () => {
    const response = {
      data: [],
    };
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve(response));

    render(<App />);

    expect(screen.getByText("Please input a city name to discover it's forecast!")).toBeInTheDocument();

    const cityInputNode = screen.getByLabelText('city-input');
    expect(cityInputNode).toBeInTheDocument();

    fireEvent.change(cityInputNode, { target: { value: 'random city' } });
    await waitFor(() => expect(screen.getByText('Searching forecasts...')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('No city found with that name!')).toBeInTheDocument());

    fireEvent.change(cityInputNode, { target: { value: '' } });
    await waitFor(() => expect(screen.getByText("Please input a city name to discover it's forecast!")).toBeInTheDocument());
  });

  test('should show data if city is discovered', async () => {
    const response = {
      data: [
        {
          id: 2234231,
          applicable_date: '2021-01-21',
          min_temp: 124,
          max_temp: 240,
        },
        {
          id: 111,
          applicable_date: '2021-01-22',
          min_temp: 125,
          max_temp: 241,
        }
      ],
    };
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve(response));

    render(<App />);

    expect(screen.getByText(/Please input a city name to discover it's forecast!/i)).toBeInTheDocument();

    const cityInputNode = screen.getByLabelText('city-input');
    expect(cityInputNode).toBeInTheDocument();

    fireEvent.change(cityInputNode, { target: { value: 'london' } });
    await waitFor(() => expect(screen.getByText('Searching forecasts...')).toBeInTheDocument());
    await waitFor(() => {
      expect(screen.getByText('Thursday')).toBeInTheDocument();
      expect(screen.getByText('Friday')).toBeInTheDocument();

      expect(screen.getByText('Min: 124')).toBeInTheDocument();
      expect(screen.getByText('Min: 125')).toBeInTheDocument();

      expect(screen.getByText('Max: 240')).toBeInTheDocument();
      expect(screen.getByText('Max: 241')).toBeInTheDocument();
    });
  });
})
