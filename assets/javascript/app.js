
$(document).ready(function(){
  var athletes = ["JOHN ELWAY", "MICHAEL JORDAN", "JERRY RICE", "WAYNE GRETZKY", "CAL RIPKEN JR",
                 "JACK NICKLAUS", "BARRY BONDS", "PATRICK ROY", "MAGIC JOHNSON", "DAN MARINO"];

  /** 
   * @function initialize 
   * @description Immediately invoked function which initializes application after document is loaded.
  */
  (function initialize() {
    renderButtons();
  })();

  /** 
   * @function renderErrorMessage 
   * @description Renders modal with error message when error is thrown/caught.
   * @param {error} string - Error message to display in modal.
  */
  function renderErrorMessage(error) {
    $("#error-modal-body").empty();
    $("#error-modal-body").append($("<p>").text(error));

    $("#error-modal").modal("show");
  }

  /** 
   * @function renderButtons 
   * @description Renders athlete buttons based on athletes array.
  */
  function renderButtons() {
    $("#athlete-buttons").empty();

    for (let i = 0; i < athletes.length; i++) {
      $("#athlete-buttons").append
        ($("<button>").attr("type", "button")
                      .addClass("btn btn-default btn-lg btn-athlete")    
                      .data("name", athletes[i])
                      .text(athletes[i]));
    }
  }

  /** 
   * @function renderImages 
   * @description Renders images based on chosen athlete name.
  */
  function renderImages() {
    const LIMIT = 10;
    var athleteName = $(this).data("name");

    var APIkey  = "u9qdX80ktrplgKRTTlkg4oihZ8LR1Wfq";
    var baseURL = "https://api.giphy.com/v1/gifs/search?";

    var queryURL = baseURL + $.param({
      "api_key": APIkey,
      "q"      : athleteName,
      "limit"  : LIMIT,
      "lang"   : "en"
    });

    console.log(queryURL);

    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
      console.log(response);

      $("#athlete-images").empty();

      /* Create image div and initialize source to still image. */
      for (let i = 0; i < LIMIT; i++) {
        var divathlete = $("<div>")
                      .addClass("div-athlete");

        var rating    = $("<label>")
                      .text("Rating: " + response.data[i].rating.toUpperCase());

        var imgathlete = $("<div>")
                      .addClass("img-athlete")
                      .css("background-image", "url(" + 
                            response.data[i].images.downsized_still.url + ")")
                      .data("isStill", true)
                      .data("still", 
                            response.data[i].images.downsized_still.url)
                      .data("move", 
                            response.data[i].images.downsized.url);

        $("#athlete-images").append(divathlete.append(rating).append(imgathlete)); 
      }
    }).fail(function(error) {
      /* Error message is automatically console logged. */
      renderErrorMessage("Fatal error. See your system administrator.");
    });
  }

  /** 
   * @function toggleImage 
   * @description Changes the image from still to moving or moving to still based on its current status.
  */
  function toggleImage() {
    if ($(this).data("isStill")) {
      $(this).data("isStill", false);
      $(this).css("background-image", "url(" + 
                  $(this).data("move") + ")");
    }
    else {
      $(this).data("isStill", true);
      $(this).css("background-image", "url(" + 
                  $(this).data("still") + ")");     
    }
  }

  /** 
   * @function doesExist 
   * @description Checks if athlete exists in athletes array.
   * @returns {boolean} Returns array index if athlete exists or -1 if athlete does not exist in athletes array.
  */
  function findathlete(athlete) {
    return athletes.indexOf(athlete);
  }

  /** 
   * @function clearInput 
   * @description Clears input field of the form.
  */
  function clearInput() {
    $("#athlete-input").val("");
  }

  /** 
   * @function addathlete 
   * @description Adds athlete to athletes array based on input from user.
   * @throws Error if athlete already exists in athletes array.
   * @throws Error when user inputs a blank name. At least one character is required.
  */
  function addathlete() {
    try {
      event.preventDefault();

      var athlete = $("#athlete-input").val().trim().toUpperCase();

      /* Have to input at least one character. Empty string is not allowed. Trim takes care of all blanks input. */
      if (athlete.length > 0) {
        if (findathlete(athlete) === -1) {
          athletes.push(athlete);
          renderButtons();
        }
        else {
         throw("Choose another athlete to add - " + athlete + " already exists.");
        }
      }
      else {
        throw("You need to enter an athlete name - blanks are not acceptable.");
      }
    }
    catch(error) {
      renderErrorMessage(error);
    }

    clearInput();
  }

  /** 
   * @function deleteathlete 
   * @description Deletes athlete from athletes array based on input from user.
   * @throws Error if athlete does not exist in athletes array.
   * @throws Error when user inputs a blank name. At least one character is required.
  */
  function deleteathlete() {
    try {
      // type = button (vs. submit), so no default behavior to compensate for.

      var athlete = $("#athlete-input").val().trim().toUpperCase();

      /* Have to input at least one character. Empty string is not allowed. Trim takes care of all blanks input. */
      if (athlete.length > 0) {
        var index = findathlete(athlete);
        if (index !== -1) {
          athletes.splice(index, 1); /* remove athlete from array based on found position. */
          renderButtons();
        }
        else {
          throw("Choose another athlete to delete - " + athlete + " does not exist.");
        }
      }
      else {
        throw("You need to enter an athlete name - blanks are not acceptable.");
      }
    }
    catch(error) {
      renderErrorMessage(error);
    }

    clearInput();
  }

  /** 
   * @event .on ("click") 
   * @listens .btn-athlete When athlete button to display gifs is chosen. 
   * @param {function} renderImages
  */
  $(document).on("click", ".btn-athlete", renderImages);

  /** 
   * @event .on ("click") 
   * @listens .img-athlete When athlete gif to toggle animation is chosen. 
   * @param {function} toggleImage
  */
  $(document).on("click", ".img-athlete", toggleImage);

  /** 
   * @event .on ("click") 
   * @listens #add-athlete When add/submit button to add an athlete is chosen. 
   * @param {function} addathlete
  */
  $("#add-athlete").on("click", addathlete);

  /** 
   * @event .on ("click") 
   * @listens #delete-athlete When delete button to delete an athlete is chosen. 
   * @param {function} deleteathlete
  */
  $("#delete-athlete").on("click", deleteathlete);

});