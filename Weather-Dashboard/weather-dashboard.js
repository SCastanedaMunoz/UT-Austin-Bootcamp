$(document).ready(function() {

    var dashboardData = {
        cityHistory : ["Austin", "Chicago", "New York", "Orlando", "San Francisco", "Seattle", "Denver", "Atlanta"],
        lastSearchedCity : "Austin",
    }

    const dashboardSaved = "weather-dashboard-saved";
    const apiKey = "43b58455665ab44ce81cff40a4aa69d9";

    initialize();

    function initialize() {

        var savedDash = localStorage.getItem(dashboardSaved);

        if (savedDash) {
            dashboardData = JSON.parse(savedDash);
        }

        fillOutCityHistory();
        fetchCityWeather(dashboardData.lastSearchedCity);

        $("#button-search").on("click", function(event) {

            var inputCity = $("#city-input").val();

            if (inputCity == "") {
                $('#errorModal').modal("show");
                return;
            }

            fetchCityWeather(inputCity);
        });
    }

    function fillOutCityHistory() {

        var cityHistoryList = $("#city-history");

        $(cityHistoryList).empty();

        for (var i = 0; i < dashboardData.cityHistory.length; i ++) {
            var liElement = $("<li>");
            $(liElement).addClass("list-group-item history-item");

            if(dashboardData.cityHistory[i] === dashboardData.lastSearchedCity)
                $(liElement).addClass("active");

            $(liElement).text(dashboardData.cityHistory[i]);
            $(cityHistoryList).append(liElement);
        }

        $(".history-item").on("click", function(event) {
            var cityName = $(this).text();

            fetchCityWeather(cityName);
        });
    }

    function fetchCityWeather(cityName) {
        
        var parsedCityName = encodeURIComponent(cityName);

        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${parsedCityName}&appid=${apiKey}`;

        $.ajax({
            url : queryURL,
            method : "GET"
        }).then(function(response){

            if(dashboardData.cityHistory.indexOf(cityName) < 0) {

                $("#city-history").empty();
                dashboardData.cityHistory.pop();
                dashboardData.cityHistory.splice(0, 0, cityName);
            }
 
            dashboardData.lastSearchedCity = cityName;

            localStorage.setItem(dashboardSaved, JSON.stringify(dashboardData));

            fillOutCityHistory();

            var date = new Date();

            $("#city-name").text(`${response.name} (${date.getMonth()}/${date.getDate()}/${date.getFullYear()})`);
            var icon = $(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png", alt="city-icon" class="city-icon"/>`);
            $("#city-name").append(icon);

            var tempK = response.main.temp;
            var tempF = (tempK - 273.15) * 9/5 + 32;

            $("#city-temp").html(`Temperature: ${tempF.toFixed(0)} &deg;F`);
            $("#city-humd").html(`Humidity: ${response.main.humidity}%`);
            $("#city-wind").html(`Wind Speed: ${response.wind.speed} MPH`);

            fetchUVIndex(response.coord.lat, response.coord.lon);

            fetchCity5DayForecast(cityName);
        }).fail(function(xhr, status, error) {
            $('#errorModal').modal("show");
        });

        function fetchUVIndex(lat, lon){
            var queryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;

            $.ajax({
                url : queryURL,
                method : "GET"
            }).then(function(response){

                var uvIndex = response.value;
                var color = "uv-low";
                
                if(uvIndex >= 0 && uvIndex <= 3)
                    color = "uv-low";
                else if(uvIndex > 3 && uvIndex <= 5)
                    color = "uv-medium";
                else if (uvIndex > 5 && uvIndex <= 7)
                    color = "uv-high";
                else if (uvIndex > 7 && uvIndex <= 10)
                    color = "uv-very-high";
                else
                    color = "uv-extreme";

                $("#city-uvin").html(`UV Index: <button class="btn ${color}">${uvIndex}</button>` );
            });
        }

        function fetchCity5DayForecast(cityName) {

            var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

            $.ajax({
                url : queryURL,
                method : "GET"
            }).then(function(response){
                var fiveDays6Am = [];

                for (var i = 4; i < response.list.length && i < response.list.length; i += 8)
                    fiveDays6Am.push(response.list[i]);

                var cityForecast = $(".city-forecast");
                $(cityForecast).empty();

                for (var i = 0; i < fiveDays6Am.length; i++)
                {
                    var dayDate = new Date(fiveDays6Am[i].dt_txt);
                    var cityCard = $("<div>");
                    $(cityCard).addClass("card fluid bg-primary city-forecast-day");
                    var cityBody = $("<div>");
                    $(cityBody).addClass("card-body forecast-body");

                    var forecastDate = $("<h4>");

                    $(forecastDate).html(`${(dayDate.getMonth() + 1)}/${dayDate.getDate()}/${dayDate.getFullYear()}`);

                    var imgIcon = $("<img>");
                    $(imgIcon).addClass("forecast-icon");
                    $(imgIcon).attr("src", `https://openweathermap.org/img/wn/${fiveDays6Am[i].weather[0].icon}@2x.png`);
                    $(imgIcon).attr("alt", `city-forecast-icon-${(i + 1)}`);

                    var forecastTemp = $("<div>");

                    var tempK = fiveDays6Am[i].main.temp;
                    var tempF = (tempK - 273.15) * 9/5 + 32;

                    $(forecastTemp).addClass("forecast-item");
                    $(forecastTemp).html(`Temp: ${tempF.toFixed(2)} &deg;F`);

                    var forecastHumd = $("<div>");

                    $(forecastHumd).html(`Humidity: ${fiveDays6Am[i].main.humidity}%`);

                    $(cityBody).append(forecastDate, imgIcon, forecastTemp, forecastHumd);

                    $(cityCard).append(cityBody);

                    $(cityForecast).append(cityCard);
                }
            });
        }
    }
});