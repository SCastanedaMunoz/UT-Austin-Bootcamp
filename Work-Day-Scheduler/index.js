$(document).ready(function() {

    // Storage Key
    const SVD_CLNDR_KEY = "work-day-schedule";

    var calendar = {
      lastSavedDay : "",
      timeSlots : []
    };

    // Get Current Day
    var currentDay = moment().format("dddd, MMMM Do");
    calendar.lastSavedDay = currentDay;

    $("#currentDay").text(currentDay);

    // Get Last Saved Day
    var savedCalendar = localStorage.getItem(SVD_CLNDR_KEY);

    // Did We Find Anything?
    if (savedCalendar) {
      var tempCalendar = JSON.parse(savedCalendar);
      if(currentDay === tempCalendar.lastSavedDay)
        calendar = tempCalendar;
    }

    // Get Current Hour
    var currentHour = moment().hour();
    
    for (var i = 0; i < 9; i ++) {
        let index = i + 9;
        var timeTense;

        // Get Time According to Hour
        if (moment(index).isBefore(currentHour))
          timeTense = "past";
        else if (moment(index).isSame(currentHour))
          timeTense = "present";
        else if (moment(index).isAfter(currentHour))
          timeTense = "future";

        var textContents = "";
        var textIndex = -1;

        // Find Text For Current Hour
        if (calendar.timeSlots)
          textIndex= calendar.timeSlots.findIndex(timeSlot => timeSlot.id == index);

        // Did We Find Anything?
        if (textIndex >= 0)
          textContents = calendar.timeSlots[textIndex].text;

        // Parse Time into Readable Hour
        var time = moment(index, ["HH.mm"]).format("hA");

        // Create Row
        createDayRow(index, time, timeTense, textContents);
    }

    function createDayRow(index, time, state, textContent)
    {
      var row = $(`<div class="row time-block">`);
      $(row).append(`<div class="col-1">`);
      $(row).append(`<div class="col-1 hour">${time}</div>`);
      var textArea = $(`<textarea class="col-8 ${state} description" id="text-${index}"></textarea>`);
      textArea.val(textContent);
      $(row).append(textArea);
      $(row).append(`<button class="col-1 btn saveBtn fas fa-save" data-hour="${index}"></button>`);

      $(".container").append(row);
    }

    // Save Button Event
    $(".saveBtn").on("click", function(event){
      var hourId = $(this).attr("data-hour");
      var textContents = $(`#text-${hourId}`).val();
      var hourEntry = {
        id : hourId,
        text : textContents
      }

      var wasFound = calendar.timeSlots.findIndex(timeSlot => timeSlot.id == hourId);
    
      if(wasFound >= 0)
        calendar.timeSlots.splice(wasFound, 1);
      
      calendar.timeSlots.push(hourEntry);

      localStorage.setItem(SVD_CLNDR_KEY, JSON.stringify(calendar));
    });
  });