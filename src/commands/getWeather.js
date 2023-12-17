require("dotenv").config();

const openWeatherAPIKey = process.env.OPEN_WEATHER_API_KEY;

async function getWeather(region) {
  if (!region) return "Region Not Provided";

  //get latitude of the city
  try {
    const res = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${region}&appid=${openWeatherAPIKey}&limit=1`
    );

    const resData = await res.json();
    const lat = resData[0].lat;
    const lon = resData[0].lon;

    //use lat to find actual weather of the city
    const weatherObj = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherAPIKey}`
    );

    const weatherData = await weatherObj.json();

    const weather = weatherData.weather[0].description;

    return weather;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getWeather };
