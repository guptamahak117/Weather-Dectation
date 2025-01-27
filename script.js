async function getWeather() {
  const city = document.getElementById('city').value;
  if (!city) {
    alert('Please enter a city name!');
    return;
  }

  const apiKey = '971ccb73b85d0f0814a3f030638bd168';
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
  try {
    // Step 1: Get Current Weather and Coordinates
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) throw new Error('City not found!');
    const weatherData = await weatherResponse.json();

    const { lat, lon } = weatherData.coord; // Get latitude and longitude
    const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`;
    
    // Update Current Weather Info
    document.getElementById('city-name').textContent = weatherData.name;
    document.getElementById('date').textContent = new Date().toDateString();
    document.getElementById('temperature').textContent = `${weatherData.main.temp}°C`;
    document.getElementById('description').textContent = weatherData.weather[0].description;
    document.getElementById('humidity').textContent = `Humidity: ${weatherData.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${weatherData.wind.speed} m/s`;

    // Step 2: Fetch 7-Day Forecast from One Call API
    const oneCallResponse = await fetch(oneCallUrl);
    const oneCallData = await oneCallResponse.json();

    // Update 3-Day Forecast (you can extend this to all 7 days)
    const forecastDays = oneCallData.daily.slice(1, 4); // Get the next 3 days
    forecastDays.forEach((forecast, index) => {
      const dayElement = document.getElementById(`day${index + 1}`);
      const dayName = new Date(forecast.dt * 1000).toDateString().split(' ')[0];
      dayElement.innerHTML = `
        <p>${dayName}</p>
        <p>${Math.round(forecast.temp.day)}°C</p>
        <p>${forecast.weather[0].main}</p>
      `;
    });
  } catch (error) {
    alert('Showing your searched result : )');
    console.error(error);
  }
}

  