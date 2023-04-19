$(function() {
    console.log("JQuery loaded");

    $(".btn-submit").on("click", function(event) {
        event.preventDefault();

        let burger = {
            name: $("#burger_name").val().trim()
        }

        $.ajax("/api/burgers", {
            type: "POST",
            data: burger
        }).then(function() {
            location.reload();
        });
    });

    $(".btn-devour").on("click", function(event) {
        event.preventDefault();

        let id = $(this).data("burger-id");

        $.ajax(`/api/burgers/${id}`, {
            type: "PUT",
            data: id,
        }).then(function() {
            location.reload();
        });
    });
});