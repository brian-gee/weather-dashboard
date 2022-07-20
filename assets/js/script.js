// Defining constant variables
const OPEN_WEATHER_API_KEY = "49160125f6ab2cf7e612c72cdd9d0e00";
const CITY_SEARCH_TEXT_AREA = document.querySelector("#city-search");
const CITY_SEARCH_BUTTON = document.querySelector("#search-button");
const CITY_NAME = document.querySelector("#city-name");
const CITY_ICON = document.querySelector("#title-image");
const TEMP = document.querySelector("#temp");
const WIND = document.querySelector("#wind");
const HUMIDITY = document.querySelector("#humidity");
const UV_INDEX = document.querySelector("#uv-index");
const M = moment();

// Event listeners for search button and return key in search input
CITY_SEARCH_BUTTON.addEventListener("click", () => {
    fetchLatLon(CITY_SEARCH_TEXT_AREA.value);
})
CITY_SEARCH_TEXT_AREA.addEventListener("keyup", (e) => {
    if (e.keyCode == 13) {
        CITY_SEARCH_BUTTON.click();
    }
})

// Get json response from onecallapi
function fetchWeather(lat, lon) {
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&exclude=hourly,minutely&lat=" + lat + "&lon=" + lon + "&appid=" + OPEN_WEATHER_API_KEY;
    fetch(queryURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (data){
            TEMP.textContent = ("Temp: " + data.current.temp + "°F");
            WIND.textContent = ("Wind: " + data.current.wind_speed + " MPH");
            HUMIDITY.textContent = ("Humidity: " + data.current.humidity + "%")
            UV_INDEX.textContent = ("UV Index: " + data.current.uvi)
            console.log(data);

        })
}

// Get the cities lat and lon to use with onecallapi
function fetchLatLon(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + OPEN_WEATHER_API_KEY;
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            var lat = data.coord.lat;
            var long = data.coord.lon;
            var date = M.format("M[/]D[/]YYYY");
            var icon = ("http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
            CITY_NAME.textContent = (data.name + " (" + date + ")");
            CITY_ICON.src = (icon);
            fetchWeather(lat, long);
            // console.log(data);
        })
}