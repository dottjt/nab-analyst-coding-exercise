import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [ searchValue, setSearchValue ] = useState('');
  const [ weatherResults, setWeatherResults ] = useState(null);

  useEffect(() => {
    const getSearchData = async () => {
      const response = await axios.get(`http://localhost:7777/weather-search?query=${searchValue}`);

      console.log(response);
    }

    getSearchData();
  });

  return (
    <div className="App">
      <input value={searchValue} onChange={(e) => setSearchValue(e.target.value) }/>

      <div>
        {/* {.map()} */}

      </div>
    </div>
  );
}

export default App;
