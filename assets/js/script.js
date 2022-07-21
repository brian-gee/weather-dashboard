// Defining constant variables
const OPEN_WEATHER_API_KEY = "49160125f6ab2cf7e612c72cdd9d0e00";
const CITY_SEARCH_INPUT = document.querySelector("#city-search");
const CITY_SEARCH_BUTTON = document.querySelector("#search-button");
const CITY_NAME = document.querySelector("#city-name");
const CITY_ICON = document.querySelector("#title-img");
const TEMP = document.querySelector("#temp");
const WIND = document.querySelector("#wind");
const HUMIDITY = document.querySelector("#humidity");
const UV_INDEX = document.querySelector("#uv-index");
const RECENT_SEARCHES = document.querySelector("#recent-searches");
const FIVE_DAY_CONTAINER = document.querySelector("#five-day-container")
const M = moment();

// Event listeners for search button and return key in search input
CITY_SEARCH_BUTTON.addEventListener("click", () => {
    fetchLatLon(CITY_SEARCH_INPUT.value);
})
CITY_SEARCH_INPUT.addEventListener("keyup", (e) => {
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

            // 5-Day Forecast loop
            for(var i = 0; i < 5; i++){
                var day = data.daily[i];
                var futureDate = new moment().add(i+1,"day");
                var date = futureDate.format("M[/]D[/]YYYY");
                createFiveDayForecast(
                    date,
                    ("http://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png"),
                    (day.temp.day + "°F"),
                    (day.wind_speed + " MPH"),
                    (day.humidity + "%"));
            }
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
            CITY_ICON.classList.remove("hidden");
            CITY_ICON.src = (icon);
            fetchWeather(lat, long);
            createRecentSearchButton();

            // console.log(data);
        })
}

function createRecentSearchButton() {
    var div = document.createElement("div");
    var btn = document.createElement("button");
    div.classList.add("row");
    btn.textContent = CITY_SEARCH_INPUT.value;
    btn.classList.add("recent-search-btn");
    div.appendChild(btn);
    RECENT_SEARCHES.appendChild(div);
    localStorage[CITY_SEARCH_INPUT.value] = CITY_SEARCH_INPUT.value;
}

function createFiveDayForecast(date, icon, temp, wind, humidity) {
    var colDiv = document.createElement("div");
    var rowDivDate = document.createElement("div");
    var rowDivIcon = document.createElement("div");
    var rowDivIconImage = document.createElement("img");
    var rowDivTemp = document.createElement("div");
    var rowDivWind = document.createElement("div");
    var rowDivHumidity = document.createElement("div");

    colDiv.classList.add("col", "five-day-item");
    rowDivDate.classList.add("row", "pl-1", "pt-1");
    rowDivIcon.classList.add("row", "pl-1");
    rowDivIconImage.classList.add("five-day-icon");
    rowDivTemp.classList.add("row", "pl-1");
    rowDivWind.classList.add("row", "pl-1");
    rowDivHumidity.classList.add("row", "pl-1");

    rowDivDate.textContent = (date);
    rowDivIconImage.src = (icon);
    rowDivTemp.textContent = ("Temp: " + temp);
    rowDivWind.textContent = ("Wind: " + wind);
    rowDivHumidity.textContent = ("Humidity: " + humidity);

    colDiv.appendChild(rowDivDate);
    colDiv.appendChild(rowDivIcon);
    rowDivIcon.appendChild(rowDivIconImage);
    colDiv.appendChild(rowDivTemp);
    colDiv.appendChild(rowDivWind);
    colDiv.appendChild(rowDivHumidity);

    FIVE_DAY_CONTAINER.appendChild(colDiv);
}