const API_KEY = '19da24d35a01b3785899a0aa92531e82'; // Replace with your OpenWeatherMap API key
const searchForm = document.getElementById("two");
const searchInput = document.getElementById("search");

function searchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
      getForecast(data.coord.lat, data.coord.lon);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      displayError();
    });
}

function displayWeather(data) {
  const weatherInfo = document.getElementById('weather-info');

  if (data.sys && data.sys.country) {
    weatherInfo.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>Temperature: ${data.main.temp}°C</p>
      <p>Weather: ${data.weather[0].main}</p>
    `;
  } else {
    displayError();
  }
}

function getForecast(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayForecast(data.list);
    })
    .catch(error => {
      console.error('Error fetching forecast data:', error);
    });
}

function displayForecast(forecastData) {
  const forecastTable = document.getElementById('forecast-table');
  forecastTable.innerHTML = ""; // Clear existing content
  
  // Loop through the forecast data and display each day's forecast
  for (let i = 0; i < forecastData.length; i += 8) {
    const forecast = forecastData[i];
    const date = new Date(forecast.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const temperature = forecast.main.temp;
    const weather = forecast.weather[0].main;

    // Create table row and cells
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${day}</td>
      <td>${temperature}°C</td>
      <td>${weather}</td>
    `;
    
    // Append row to the table
    forecastTable.appendChild(row);
  }
}

function displayError() {
  const weatherInfo = document.getElementById('weather-info');
  weatherInfo.innerHTML = '<p>Weather information not available. Please try again.</p>';
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = searchInput.value.trim();
  if (input.length == 0) {
    alert("Please enter something");
  } else {
    searchWeather(input);
  }
});
