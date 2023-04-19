var map, infoWindow;

var appData = {
    lastCityName: "",
    lastRestCount: 0,
    lastMileCount: 0,
    lastQueryWord: "",
    lastCuisines: "",
    lastType: "",
};

var lastPos = {
    lat: 30.266748,
    lng: -97.74176
};

var lastRestaurantSearch = [];
var lastEntityId = 0;
var mapMarkers = [];
var userPosition;
var storageKey = "project_1_last_city_name";

const zomatoApiKey = "f0ebb130a10a55db4fc869102e19af66";

function initMap() {

    var tempData = localStorage.getItem(storageKey);

    if (tempData) {
        appData = JSON.parse(tempData);
    }

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: lastPos.lat,
            lng: lastPos.lng
        },
        zoom: 12
    });

    createUserMarker();

    infoWindow = new google.maps.InfoWindow;
}

function createUserMarker() {
    userPosition = new google.maps.Marker({
        position: lastPos,
        map: map,
        icon: "assets/user-marker.png",
        title: "You!",
    })

    userPosition.setZIndex(100);
}

$(document).ready(function() {

    initialize();

    function initialize() {

        if (appData.lastCityName) {
            $("#city_name").val(appData.lastCityName);
            $("#query_word").val(appData.lastQueryWord);
            $("#distance").val(appData.lastMileCount);
            $("#cuisines").val(appData.lastCuisines);
            $("#food_type").val(appData.lastType);
            $("#food_count").val(appData.lastRestCount);
            getCityByName(appData.lastCityName);
        }

        $('.modal').modal();
        $('select').formSelect();
        $('.tooltipped').tooltip();

        $("#btn-search").on("click ", function(event) {
            event.preventDefault();

            var cityName = $("#city_name").val();

            if (cityName == undefined || cityName == "") {
                showModal("Unable to Conduct Search", "A city name must be provided to conduct a search!");
                return;
            }

            getCityByName(cityName);
        });
    }

    function getCityByName(cityName) {

        var parsedCityName = encodeURIComponent(cityName);

        var queryURL = `https://developers.zomato.com/api/v2.1/locations?query=${parsedCityName}`

        $.ajax({
            method: "GET",
            crossDomain: true,
            url: queryURL,
            dataType: "json",
            async: true,
            headers: {
                "user-key": zomatoApiKey
            }
        }).then(function(response) {
            appData.lastCityName = cityName;

            var locationSuggestions = response.location_suggestions.length;

            if (locationSuggestions == 0) {
                showModal("No Results Found!", "We were unable to find good results for your search, try adding more descriptive parameters to the search as well as writting a clear city name.");
                return;
            }

            clearMarkers();

            var mainSuggestion = response.location_suggestions[0];

            lastPos = {
                lat: mainSuggestion.latitude,
                lng: mainSuggestion.longitude
            };

            lastEntityId = mainSuggestion.entity_id;

            createUserMarker();

            map.setCenter(lastPos);

            getPopularRestaurants();
        });
    }

    function getPopularRestaurants() {

        appData.lastQueryWord = $("#query_word").val();

        appData.lastMileCount = $("#distance").val();

        var distanceInMeters = (appData.lastMileCount * 1.609344) * 1000;

        appData.lastCuisines = $("#cuisines").val();

        appData.lastType = $("#food_type").val();

        appData.lastRestCount = $("#food_count").val();

        localStorage.setItem(storageKey, JSON.stringify(appData));

        var queryURL = encodeURI(`https://developers.zomato.com/api/v2.1/search?entity_id=${lastEntityId}&count=${appData.lastRestCount}&entity_type=city&q=${appData.lastQueryWord}&radius=${distanceInMeters}&cuisines=${appData.lastCuisines}&establishment_type=${appData.lastType}&sort=rating&order=desc`);

        $.ajax({
            method: "GET",
            crossDomain: true,
            url: queryURL,
            dataType: "json",
            async: true,
            headers: {
                "user-key": zomatoApiKey
            }
        }).then(function(response) {
            lastRestaurantSearch = response.restaurants;
            createRestaurantList();
            createRestaurantMarkers();
        });
    }

    function createRestaurantMarkers() {

        for (var i = 0; i < lastRestaurantSearch.length; i++) {

            var restaurant = lastRestaurantSearch[i].restaurant;

            var foodLocation = restaurant.location;

            var foodPos = {
                lat: parseFloat(foodLocation.latitude),
                lng: parseFloat(foodLocation.longitude)
            };

            var foodMarker = new google.maps.Marker({
                position: foodPos,
                map: map,
                animation: google.maps.Animation.DROP,
                title: restaurant.name,
            });

            foodMarker.addListener("click", function(event) {
                createRestaurantInfo(this.title);
            });

            mapMarkers.push(foodMarker);
        }
    }

    function createRestaurantList() {

        if (!lastRestaurantSearch)
            return;

        var foodListElem = $("#info-rest");

        $(foodListElem).empty();

        for (var i = 0; i < lastRestaurantSearch.length; i++) {
            var restaurant = lastRestaurantSearch[i].restaurant;

            var newRow = $("<div>");

            $(newRow).addClass("row");

            var cardElement = $("<div>");

            $(cardElement).addClass("card s12");

            var cardImage = $("<div>");

            $(cardImage).addClass("card-image");

            var image = $("<img>");

            $(image).addClass("thumbnail");

            var thumbNail = restaurant.thumb;

            if (!thumbNail)
                thumbNail = "assets/projectplaceholder.png";

            $(image).attr("src", thumbNail);
            $(image).attr("alt", `thumb-for-${restaurant.name}`);

            var titleElement = $("<h6>");

            $(titleElement).addClass("card-title");

            $(titleElement).append(restaurant.name);
            $(titleElement).append(" ");
            $(titleElement).append(createIcon("star"));
            $(titleElement).append(`${restaurant.user_rating.aggregate_rating}`);

            $(cardImage).append(image, titleElement);

            var stackElement = $("<div>");

            $(stackElement).addClass("card-stacked");
            $(stackElement).append(createCardElement("map-marker", restaurant.location.address));
            $(stackElement).append(createCardElement("phone", restaurant.phone_numbers));
            $(stackElement).append(createCardElement("cutlery", restaurant.cuisines));

            var priceRange = $("<p>");

            for (var j = 0; j < restaurant.price_range; j++)
                $(priceRange).append(createIcon("usd"));

            $(stackElement).append(priceRange);

            var actionElement = $("<div>");

            $(actionElement).addClass("card-action");

            var visitLink = $("<a>");

            $(visitLink).attr("href", restaurant.url);
            $(visitLink).attr("target", "_blank");
            $(visitLink).text("Visit!");

            var seeMoreLink = $("<a>");

            $(seeMoreLink).addClass("see-more");
            $(seeMoreLink).data("rest-name", restaurant.name);

            $(seeMoreLink).text("See More");

            $(actionElement).append(visitLink, seeMoreLink);

            $(stackElement).append(actionElement);

            $(cardElement).append(cardImage, stackElement);

            $(newRow).append(cardElement);

            $(foodListElem).append(newRow);
        }

        $(".see-more").on("click", function(event) {
            event.preventDefault();
            var restaurantName = $(this).data("rest-name");
            createRestaurantInfo(restaurantName);
        });
    }

    function createRestaurantInfo(restaurantName) {

        var restaurant = lastRestaurantSearch.find(rest => rest.restaurant.name == restaurantName).restaurant;

        var foodListElem = $("#info-rest");

        $(foodListElem).empty();

        var newRow = $("<div>");

        $(newRow).addClass("row");

        var cardElement = $("<div>");

        $(cardElement).addClass("card s12");

        var cardImage = $("<div>");

        $(cardImage).addClass("card-image");

        var image = $("<img>");

        $(image).addClass("thumbnail");

        var thumbNail = restaurant.thumb;

        if (!thumbNail)
            thumbNail = "assets/projectplaceholder.png";

        $(image).attr("src", thumbNail);
        $(image).attr("alt", `thumb-for-${restaurant.name}`);

        var titleElement = $("<h6>");

        $(titleElement).addClass("card-title");

        $(titleElement).append(restaurant.name);
        $(titleElement).append(" ");
        $(titleElement).append(createIcon("star"));
        $(titleElement).append(`${restaurant.user_rating.aggregate_rating}`);

        $(cardImage).append(image, titleElement);

        var stackElement = $("<div>");

        $(stackElement).addClass("card-stacked");

        $(stackElement).append(createCardElement("map-marker", restaurant.location.address));
        var priceRange = $("<p>");

        for (var j = 0; j < restaurant.price_range; j++)
            $(priceRange).append(createIcon("usd"));

        $(stackElement).append(priceRange);

        $(stackElement).append(createCardElement("phone", restaurant.phone_numbers));
        $(stackElement).append(createCardElement("cutlery", restaurant.cuisines));
        $(stackElement).append(createCardElement("clock-o", restaurant.timings));

        var imagesLinkHolder = $("<p>");
        var imagesLink = $("<a>");
        $(imagesLink).attr("href", restaurant.photos_url);
        $(imagesLink).attr("target", "_blank");
        $(imagesLink).text("Photo Gallery");
        $(imagesLinkHolder).append(imagesLink);

        var menuLinkHolder = $("<p>");
        var menuLink = $("<a>");
        $(menuLink).attr("href", restaurant.menu_url);
        $(menuLink).attr("target", "_blank");
        $(menuLink).text("Online Menu");
        $(menuLinkHolder).append(menuLink);

        $(stackElement).append(imagesLinkHolder, menuLinkHolder);

        var highlightsHolder = $("<p>");

        var highlightsContent = restaurant.highlights.join(", ");

        $(highlightsHolder).text(highlightsContent);
        $(stackElement).append(highlightsHolder);

        var actionElement = $("<div>");

        $(actionElement).addClass("card-action");

        var visitLink = $("<a>");

        $(visitLink).attr("href", restaurant.url);
        $(visitLink).attr("target", "_blank");
        $(visitLink).text("Visit!");

        var goBackLink = $("<a>");

        $(goBackLink).text("Go Back");

        $(goBackLink).on("click", function(event) {
            createRestaurantList();
        });

        $(actionElement).append(visitLink, goBackLink);

        $(stackElement).append(actionElement);

        $(cardElement).append(cardImage, stackElement);

        $(newRow).append(cardElement);

        $(foodListElem).append(newRow);
    }

    function clearMarkers() {
        for (var i = 0; i < mapMarkers.length; i++)
            mapMarkers[i].setMap(null);

        mapMarkers = [];

        userPosition.setMap(null);

        userPosition = null;
    }

    function createCardElement(iconName, value) {
        var newCardElement = $("<p>");
        $(newCardElement).append(createIcon(iconName));
        $(newCardElement).append(" ");
        $(newCardElement).append(value);

        return newCardElement;
    }

    function createIcon(iconName) {
        var newIcon = $("<i>");
        $(newIcon).addClass(`fa fa-${iconName}`);
        $(newIcon).attr("aria-hidden", true);
        return newIcon;
    }

    function showModal(header, content) {
        $("#modal-header").text(header);
        $("#modal-content").text(content);
        $("#modal-message").modal('open');
    }

    $(document).ready(function() {
        $('.parallax').parallax();
    });

});