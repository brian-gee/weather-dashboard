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
});
CITY_SEARCH_INPUT.addEventListener("keyup", (e) => {
    if (e.keyCode == 13) {
        CITY_SEARCH_BUTTON.click();
    }
});

// Get json response from onecallapi
function fetchWeather(lat, lon) {
    // Remove existing 5-Day Forecast if it exists
    if (FIVE_DAY_CONTAINER.children.length > 0) {
        removeChildren(FIVE_DAY_CONTAINER);
    }
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&exclude=hourly,minutely&lat=" + lat + "&lon=" + lon + "&appid=" + OPEN_WEATHER_API_KEY;
    // Get openweatherapi onecall data
    fetch(queryURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (data){
            // Display fetched info to their appropriate element
            TEMP.textContent = ("Temp: " + data.current.temp + "°F");
            WIND.textContent = ("Wind: " + data.current.wind_speed + " MPH");
            HUMIDITY.textContent = ("Humidity: " + data.current.humidity + "%")
            UV_INDEX.textContent = (data.current.uvi);
            // Add colors to uv index depending on level
            if(data.current.uvi <= 2){
                UV_INDEX.className = ""
                UV_INDEX.classList.add("favorable");
            } else if(data.current.uvi >= 2 && data.current.uvi <= 5) {
                UV_INDEX.className = ""
                UV_INDEX.classList.add("moderate");
            } else {
                UV_INDEX.className = ""
                UV_INDEX.classList.add("severe");
            }

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
    // Get openweatherapi weather data
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            // Assign values to be used for display
            var lat = data.coord.lat;
            var long = data.coord.lon;
            var date = M.format("M[/]D[/]YYYY");
            var icon = ("http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
            // Display fetched info to appropriate element
            CITY_NAME.textContent = (data.name + " (" + date + ")");
            CITY_ICON.classList.remove("hidden");
            CITY_ICON.src = (icon);
            fetchWeather(lat, long);
            createRecentSearchButton(CITY_SEARCH_INPUT.value);
        })
}

// Create a button for recent searches using the provided city name
function createRecentSearchButton(city) {
    // Format search or else there will be issues with cites with spaces
    var formattedSearch = city.replace(/ /g,"-");
    // If button already exists do nothing, otherwise create button
    if(document.querySelector("." + formattedSearch)) {
    } else {

        // Create necessary elements
        var div = document.createElement("div");
        var btn = document.createElement("button");
        // Assign necessary classes
        div.classList.add("row");
        btn.textContent = city;
        btn.classList.add("recent-search-btn", formattedSearch);
        // Add button to newly created div
        div.appendChild(btn);
        // Add event listener to button to search city again when clicked
        btn.addEventListener("click", (e) => {
            CITY_SEARCH_INPUT.value = e.target.innerHTML;
            fetchLatLon(e.target.innerHTML);
        });
        RECENT_SEARCHES.appendChild(div);
        // Add city name to localStorage
        localStorage[formattedSearch] = formattedSearch;
        }
}

// Display forecast for the next five days
function createFiveDayForecast(date, icon, temp, wind, humidity) {

    // Create all necessary elements
    var colDiv = document.createElement("div");
    var rowDivDate = document.createElement("div");
    var rowDivIcon = document.createElement("div");
    var rowDivIconImage = document.createElement("img");
    var rowDivTemp = document.createElement("div");
    var rowDivWind = document.createElement("div");
    var rowDivHumidity = document.createElement("div");

    // Add necessary classes to each element
    colDiv.classList.add("col", "five-day-item");
    rowDivDate.classList.add("row", "pl-1", "pt-1");
    rowDivIcon.classList.add("row", "pl-1");
    rowDivIconImage.classList.add("five-day-icon");
    rowDivTemp.classList.add("row", "pl-1");
    rowDivWind.classList.add("row", "pl-1");
    rowDivHumidity.classList.add("row", "pl-1");

    // Assign expected values to each element
    rowDivDate.textContent = (date);
    rowDivIconImage.src = (icon);
    rowDivTemp.textContent = ("Temp: " + temp);
    rowDivWind.textContent = ("Wind: " + wind);
    rowDivHumidity.textContent = ("Humidity: " + humidity);

    // Add each element to be displayed in container
    colDiv.appendChild(rowDivDate);
    colDiv.appendChild(rowDivIcon);
    rowDivIcon.appendChild(rowDivIconImage);
    colDiv.appendChild(rowDivTemp);
    colDiv.appendChild(rowDivWind);
    colDiv.appendChild(rowDivHumidity);

    // Add main element to 5-Day Forecast container for display
    FIVE_DAY_CONTAINER.appendChild(colDiv);
}

// Removes all children from a parent element
function removeChildren(parent){
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
}

// Return all localStorage values
function getAllLocalStorage() {
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;
    while ( i-- ) {
        values.push( localStorage.getItem(keys[i]) );
    }
    return values;
}

// Display recent searches by using localStorage whenever app is run
function loadRecentSearches() {
    var recentSearches = getAllLocalStorage();
    recentSearches.forEach( e => {
        var formattedElement = e.replace(/-/g," ")
        createRecentSearchButton(formattedElement);
    });
}
loadRecentSearches();