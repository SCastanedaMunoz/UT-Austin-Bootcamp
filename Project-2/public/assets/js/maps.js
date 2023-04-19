let map;
const allCircles = [];
const allInfoWindows = [];

const colorSchemes = {
  infected: {
    status: "Infected",
    strokeColor: "#FF0000",
    fillColor: "#FF0000",
  },
  not_infected: {
    status: "Not Infected",
    strokeColor: "#00FF00",
    fillColor: "#00FF00",
  },
  prev_infected: {
    status: "Previously Infected",
    strokeColor: "#FF8000",
    fillColor: "#FF8000",
  },
};

const stylesArray = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#181818",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1b1b1b",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#2c2c2c",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8a8a8a",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#373737",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#3c3c3c",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#4e4e4e",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3d3d3d",
      },
    ],
  },
];
// eslint-disable-next-line no-unused-vars
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 30.266748,
      lng: -97.74176,
    },
    styles: stylesArray,
    zoom: 10,
  });

  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) return;

    markers.forEach((marker) => {
      marker.setMap(null);
    });

    markers = [];

    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

  $(function () {
    // Handle Functionality For When Users Submit a Query Request
    $(".btn-submit").on("click", function (event) {
      event.preventDefault();
      const status = $("#status").val().trim();

      let url = `/api/people/${status}`;

      const condition = $("#condition").val();
      const conditionValue = $("#condition-value").val();

      if (condition && !conditionValue) {
        // TODO add modal so users must select condition value
        return;
      }

      if (condition && conditionValue) {
        url += `/${condition}/${conditionValue}`;
      }

      $.get(url)
        .then(function (data) {
          clearCircles();

          data.forEach((cityInfo) => {
            const scheme =
              status == "Infected"
                ? colorSchemes.infected
                : status == "Not Infected"
                ? colorSchemes.not_infected
                : colorSchemes.prev_infected;

            createCircle(scheme, cityInfo);
          });
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    // Handle Functionality For When User Select a Filter
    $("#condition").on("change", function (event) {
      const selectedFilter = $(this).val();

      switch (selectedFilter) {
        case "age":
          fillConditions(["3 - 18", "19 - 30", "30 - 55", "55+"]);
          break;

        case "gender":
          fillConditions(["Male", "Female", "Non-binary"]);
          break;

        case "bloodType":
          fillConditions(["A-", "A+", "B-", "B+", "O-", "O+", "AB-", "AB+"]);
          break;

        default:
          $("#condition-value").empty();
          $("#condition-value").attr("readonly", "");
          break;
      }

      function fillConditions(options) {
        let conditionValues = $("#condition-value");

        $(conditionValues).attr("readonly", null);
        $(conditionValues).empty();
        $(conditionValues).prepend(
          $(`<option value="">Select a Filter Value</option>`)
        );

        options.forEach((element) => {
          $(conditionValues).append($(`<option>${element}</option>`));
        });
      }
    });
  });

  function createCircle(scheme, cityInfo) {
    const cityLocation = { lat: cityInfo.lat, lng: cityInfo.lng };
    const statusCount = cityInfo.count;

    // TODO: Different Colors based on Status or Query
    const cityCircle = new google.maps.Circle({
      strokeColor: scheme.strokeColor,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: scheme.fillColor,
      fillOpacity: 0.35,
      map,
      center: cityLocation,
      radius: Math.sqrt(statusCount) * 100,
    });

    // // TODO: Polish COntent Inside Info Window
    const infowindow = new google.maps.InfoWindow({
      content: `<h3>${cityInfo.city}</h3>
    <p> ${scheme.status} People:${statusCount}</p>`,
    });

    cityCircle.addListener("click", () => {
      infowindow.setPosition(cityLocation);
      infowindow.open(map);
    });

    allInfoWindows.push(infowindow);
    allCircles.push(cityCircle);
  }

  function clearCircles() {
    allCircles.forEach((circle) => circle.setMap(null));
    allInfoWindows.forEach((infoWindow) => infoWindow.setMap(null));
  }
}
