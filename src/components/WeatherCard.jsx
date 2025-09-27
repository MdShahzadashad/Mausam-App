import React, { useState, useEffect } from 'react';


const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const backgroundChange = () => {
    if (!weather) return 'bg-gradient-to-br from-sky-400 to-white';

    const temp = weather.main.temp;
    const localTime = new Date((weather.dt + weather.timezone) * 1000);
    const hours = localTime.getUTCHours();

    if (hours >= 18 || hours < 5) {
      return 'bg-gradient-to-br from-gray-800 to-gray-900';
    }


    if (temp > 30) {
      return 'bg-gradient-to-br from-yellow-600 to-white';
    } else {
      return 'bg-gradient-to-br from-sky-400 to-white';
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=e33fc3f4b07d3de57d4f0d5be336ba33&units=metric`);
      const data = await res.json();
      setWeather(data);
    });
  }, []);


  const isNight = () => {
    if (!weather) return false;
    const localTime = new Date((weather.dt + weather.timezone) * 1000);
    const hours = localTime.getUTCHours();
    return hours >= 18 || hours < 6;
  };

  const heatAlert = () => {
    if (!weather) return 'bg-gradient-to-br from-sky-400 to-white';

    const temp = weather.main.temp;

    if (temp > 30) {
      return "It's so hot outside, stay inside and hydrate yourself.";
    } else {
      return "Good weather, explore the world, but stay hydrated and experience less sun exposure.";
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city) return;

    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e33fc3f4b07d3de57d4f0d5be336ba33&units=metric`
      );
      const data = await res.json();
      console.log('API response:', data);
      if (data.cod === 200) {
        setWeather(data);
      } else {
        alert('City not found!');
        alert(`Error: ${data.message}`);
        setWeather(null);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={` min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden ${backgroundChange()}`}>
      <form onSubmit={handleSearch} className="mb-6 w-full max-w-md flex gap-2 z-10">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={`flex-grow px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 
    ${isNight() ? 'bg-gray-800 text-white placeholder-gray-300 border-gray-600' : ''}
  `}
        />
        <button
          type="submit"
          className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600 transition"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {weather && (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center z-10">
          {weather && weather.main.temp > 30 && (
            <img
              src='./src/assets/sunny.webp'
              alt="Sunny Weather"
              className="mx-auto mb-4 rounded-lg w-full h-48 object-cover"
            />
          )}
          {weather && weather.main.temp < 10 && (
            <img src='/src/assets/snow.webp'
              alt='Snow weather'
              className='mx-auto mb-4 rounded-lg w-full h-48 object-cover'
            />
          )}
          {weather && weather.weather[0].main ==="Rain" &&(
            <img src='/src/assets/rain.webp' alt='Rainy day'
            className='mx-auto mb-4 rounded-lg w-full h-48 object-cover' />
          )}

          <h1 className="text-2xl font-bold mb-2">
            {weather.name}, {weather.sys.country}
          </h1>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="mx-auto"
          />
          <h2 className="text-4xl font-semibold">
            {Math.round(weather.main.temp)}°C
          </h2>
          <p className="text-gray-600">
            {weather.weather[0].main} - {weather.weather[0].description}
          </p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind: {weather.wind.speed} m/s</p>
          <p>Local Time: {
            new Date((weather.dt + weather.timezone) * 1000 - 19500000).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
          }</p>
          <p className={weather.main.temp > 30 ? 'text-red-600 font-semibold' : 'text-green-700'}>
            {heatAlert()}
          </p>
        </div>
      )
      }
    </div >
  );
};

export default WeatherCard;