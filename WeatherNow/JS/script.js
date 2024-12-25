const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("city");
const weatherContainer = document.querySelector(".weather-container");
const todayWeather = document.querySelector(".today-weather");
const forecast = document.querySelector(".forecast");
const searchContainer = document.getElementById("search-container");


weatherContainer.style.display = "none";


const API_KEY = "168771779c71f3d64106d8a88376808a";


searchBtn.addEventListener("click", () => {
  const cityName = cityInput.value.trim();

  if (cityName) {
    
    fetchWeatherData(cityName);
   
    searchContainer.style.position = "absolute";
    searchContainer.style.top = "20px";
    searchContainer.style.left = "50%";
    searchContainer.style.transform = "translateX(-50%)";
   
    document.getElementById("headline").style.display = "none";
  } else {
    alert("Please enter a city name!");
  }
});


async function fetchWeatherData(city) {
  try {
    
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!currentWeatherResponse.ok) {
      throw new Error("City not found!");
    }

    const currentWeatherData = await currentWeatherResponse.json();

    
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!forecastResponse.ok) {
      throw new Error("Error fetching forecast data!");
    }

    const forecastData = await forecastResponse.json();

    
    updateTodayWeather(currentWeatherData);

    
    updateForecast(forecastData);

    
    weatherContainer.style.display = "flex";
  } catch (error) {
    alert(error.message);
  }
}


function updateTodayWeather(data) {
  document.getElementById("city-name").textContent = data.name;
  document.getElementById("date").textContent = `Date: ${new Date().toLocaleDateString()}`;
  document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}°C`;
  document.getElementById("description").textContent = data.weather[0].description;
  document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById("wind-speed").textContent = `Wind Speed: ${data.wind.speed} m/s`;
  document.getElementById("today-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}


function updateForecast(data) {
 
  const dailyForecasts = [];

  for (let i = 0; i < data.list.length; i += 8) {
    dailyForecasts.push(data.list[i]);
  }

  const forecastDays = document.querySelectorAll(".forecast .day");

  dailyForecasts.slice(1, 5).forEach((day, index) => {
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    forecastDays[index].querySelector(".day-name").textContent = dayName;
    forecastDays[index].querySelector(".day-icon").src = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    forecastDays[index].querySelector(".day-temp").textContent = `Temp: ${day.main.temp}°C`;
    forecastDays[index].querySelector(".day-desc").textContent = `Sky: ${day.weather[0].description}`;
  });
}
