let storedCity = [];
let searchInput = "orlando";
function clearText() {
  $("#search-input").empty();
  $("#todays-date").empty();
  $("#today").empty();
  $("#city-name").empty();
}

function weather(searchInput) {
  var openWeatherMap = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&units=imperial&appid=ee9bce64f756f1741535654104805926`;
  $.ajax({
    url: openWeatherMap,
    type: "GET",
  }).then(function (response) {
    console.log(response);
    clearText();
    var card = $("<div>").addClass("card");
    var cardBody = $("<div>").addClass("card-body");
    $("#city-name").append("City: " + response.name);
    var wind = $("<p>")
      .addClass("card-text")
      .text("Wind Speed: " + response.wind.speed + " MPH");
    var humid = $("<p>")
      .addClass("card-text")
      .text("Humidity: " + response.main.humidity + "%");
    var temp = $("<p>")
      .addClass("card-text")
      .text("Temperature: " + response.main.temp + " °F");
    var img = $("<img>").attr(
      "src",
      "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
    );
    card.append(cardBody);
    $("#today").append(card);
    fiveDayForcast(response);
    cardBody.append(temp, humid, wind);
    var sameDay = new Date(response.dt * 1000).toLocaleDateString("en-US");
    $("#todays-date").append(sameDay);
  });
}

function cityList(searchInput) {
  if (storedCity.length == 5) {
    storedCity.splice(0, 1);
  }

  searchInput = searchInput.charAt(0).toUpperCase() + searchInput.slice(1);
  $("#city-list").empty();
  let cityObj = {
    name: searchInput,
  };
  storedCity.push(cityObj);

  for (let i = 0; i < storedCity.length; i++) {
    let cityButton = $("<button>");
    cityButton.attr("class", "list-group-item button");
    cityButton.attr("type", "click");
    cityButton.text(storedCity[i].name);
    $("#city-list").prepend(cityButton);
  }
  localStorage.setItem("storedCity", JSON.stringify(storedCity));

  $(".list-group-item").on("click", function () {
    let listClick = $(this).text();
    weather(listClick);
  });
}

function loadCity() {
  if (localStorage.getItem("storedCity") !== null) {
    let getCity = JSON.parse(localStorage.getItem("storedCity"));

    for (let i = 0; i < getCity.length; i++) {
      let cityButton = $("<button>");
      cityButton.attr("class", "list-group-item button");
      cityButton.attr("type", "click");
      cityButton.text(getCity[i].name);
      $("#city-list").prepend(cityButton);

      let cityObj = {
        name: getCity[i].name,
      };
      storedCity.push(cityObj);
    }
    let oldCity = storedCity[storedCity.length - 1];
    let lastCity = oldCity.name;
    weather(lastCity);
  }
}
loadCity();

function fiveDayForcast(apiResponse) {
  var lat = JSON.stringify(apiResponse.coord.lat);
  var lon = JSON.stringify(apiResponse.coord.lon);
  var newAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly&appid=ee9bce64f756f1741535654104805926`;

  $.ajax({
    url: newAPI,
    method: "Get",
  }).then(function (response) {
    console.log(response);
    JSON.stringify($("#uv-index").text("UV index: " + response.daily[0].uvi));

    for (var i = 1; i < 6; i++) {
      var date = response.daily[i].dt;
      var dailyDate = new Date(date * 1000).toLocaleDateString("en-US");
      $("#date-" + i).text(dailyDate);
      $("#forecast-" + i).empty();
      var weatherImg = response.daily[i].weather[0].icon;
      var dailyIcon =
        "https://openweathermap.org/img/wn/" + weatherImg + "@2x.png";
      var img = $("<img>").attr("src", dailyIcon);
      $("#forecast-" + i).append(img);
      JSON.stringify(
        $("#temp-" + i).text("Min Temp: " + response.daily[i].temp.min + " F")
      );
      JSON.stringify(
        $("#tempmax-" + i).text(
          "Max Temp: " + response.daily[i].temp.max + " F"
        )
      );
      JSON.stringify(
        $("#humid-" + i).text("Humidity: " + response.daily[i].humidity + " %")
      );
    }
  });
}

$("#search-button").on("click", function () {
  if (searchInput == " ") {
    return;
  } else {
    var searchInput = $("#search-input").val().trim();
    weather(searchInput);
    cityList(searchInput);
  }
});

$(".list-group-item").on("click", function () {
  let listClick = $(this).text().trim();
  weather(listClick);
});
