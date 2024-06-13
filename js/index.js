async function getWeatherData(city) {
  try {
    if (!city) {
      throw new Error("City name cannot be empty");
    }
    let apiKey = 'aefeda62809d4d44a4c231701241206';
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`
    );
    if (response.ok) {
      let weatherData = await response.json();
      return weatherData;
    } else {
      let errorText = await response.text();
      throw new Error(`Error fetching weather data for ${city}: ${errorText}`);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

function displayCurrentWeather(weatherData) {
  let { location, current } = weatherData;
  let { name } = location;
  let { temp_c, condition, humidity, wind_kph, wind_degree } = current;
  let { text, icon } = condition;

  let iconUrl = `https:${icon}`;

  let currentWeatherHtml = `
    <div class="col-lg-4 w-100">
      <div class="card bg-cards text-white mt-5">
        <div class="card-header cards-opacity">
          <div class="d-flex justify-content-between text-secondary" id="today">
            <div class="day">${new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
            <div class="date">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
        <div class="card-body">
          <div id="current">
            <div class="location">${name}</div>
            <div class="degree">
              <div class="fs-16 fw-bold">${temp_c.toFixed(1)}<sup>o</sup>C</div>
              <div>
                <img src="${iconUrl}" alt="" width="90">
              </div>
            </div>
            <div class="custom text-primary">${text}</div>
            <span class="pe-2 text-secondary"><i class="fa-solid fa-umbrella pe-1"></i>${humidity}%</span>
            <span class="pe-2 text-secondary"><i class="fa-solid fa-wind pe-1"></i>${wind_kph} km/h</span>
            <span class="pe-2 text-secondary"><i class="fa-solid fa-compass pe-1"></i>${wind_degree}°</span>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("current-weather").innerHTML = currentWeatherHtml;
}


function displayForecast(weatherData) {
  let { forecast } = weatherData;
  let { forecastday } = forecast;

  let { date: date1,
     day: dayData1 
    } = forecastday[1];
  displayForecastCard('forecast-1', date1, dayData1);

  let { date: date2,
     day: dayData2 
    } = forecastday[2];
  displayForecastCard('forecast-2', date2, dayData2);

  let { date: date3,
     day: dayData3 
    } = forecastday[3];
  displayForecastCard('forecast-3', date3, dayData3);
}

function displayForecast(weatherData) {
  let { forecast } = weatherData;
  let { forecastday } = forecast;


  for (let i = 1; i <= 2; i++) {
    let { date, day: dayData } = forecastday[i];
    let { condition, maxtemp_c, mintemp_c } = dayData;
    let { text, icon } = condition;


    let iconUrl = `https:${icon}`;

    let forecastHtml = `
      <div class="card bg-cards text-white mt-5">
        <div class="cards-opacity">
          <div class="card-header text-center text-secondary">${new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
        </div>
        <div class="text-center py-5">
          <div>
            <img src="${iconUrl}" alt="" width="48">
          </div>
          <div class="degree fs-4 fw-bold mt-3">${maxtemp_c.toFixed(1)}<sup>o</sup>C</div>
          <span class="nav-span-color">${mintemp_c.toFixed(1)}<sup>o</sup></span>
          <div class="custom text-primary my-4 pb-5">${text}</div>
        </div>
      </div>
    `;

    document.getElementById(`forecast-${i}`).innerHTML = forecastHtml;
  }
}



async function searchWeather(city) {
  let weatherData = await getWeatherData(city);
  if (weatherData) {
    displayCurrentWeather(weatherData);
    displayForecast(weatherData);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  searchWeather("Cairo");
});

document.getElementById("submit").addEventListener("click", function() {
  let city = document.getElementById("search").value.trim();
  if (city) {
    searchWeather(city);
  }
});


document.getElementById("submit").addEventListener("click", searchWeather);
