$(function () {
  $(".btn-submit").on("click", function (event) {
    const country = $("#countryId").val().trim();
    const state = $("#stateId").val().trim();
    const city = $("#cityId").val().trim();

    if (!country || !state || !city) {
      return;
    }

    event.preventDefault();

    let service = new google.maps.places.PlacesService(
      $("#places-service").get(0)
    );

    $.get(`/api/location/${country}/${state}/${city}`).then((data) => {
      if (data.id == null) {
        const request = {
          query: `${country}, ${city}, ${state}`,
          fields: ["name", "geometry"],
        };

        // TODO: Add Loading Info so Users Know their Info is being processed.
        service.findPlaceFromQuery(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < results.length; i++) {
              let placeLocation = results[i].geometry.location;

              const userLocation = {
                country: country,
                state: state,
                city: city,
                lat: placeLocation.lat(),
                lng: placeLocation.lng(),
              };

              $.post("/api/location", userLocation).then((data) => {
                const { id } = data;
                createPerson(id);
              });
            }
          }
        });
      } else {
        createPerson(data.id);
      }
    });

    function createPerson(locationId) {
      let person = {
        status: $("#status").val().trim(),
        bloodType: $("#blood-type").val().trim(),
        gender: $("#gender").val().trim(),
        age: $("#age").val().trim(),
        LocationId: parseInt(locationId),
      };

      $.post("/api/people", person).then(function () {
        window.location.href = "/maps";
      });
    }
  });
});
