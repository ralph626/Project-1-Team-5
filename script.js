$(document).ready(function(){
    var geniusAPIKey = 'da2f98a609msh0e05646ac6fcbffp1befeajsndb45802075e4';
    var qrCodeAPIKey = 'da2f98a609msh0e05646ac6fcbffp1befeajsndb45802075e4';
    var history = localStorage.getItem("searchHistory") ? JSON.parse(localStorage.getItem("searchHistory")) : [];
    
    autocomplete(document.getElementById("user-input"), history)
    // References
    var resultsSection = $("#results");


    // -TODO: Get the string from the input.
    // -TODO: Call the function with that input.
    // -TODO: Display results.
    // -TODO: Make the results clickable.
    // -TODO: Function for assigning things to second page.
    // -TODO: Make sure to clear the QR Code.
    // -TODO: Make the whole card a button.
    // -TODO: Center into columns.

    showMainPage();

    // On Click Functions
    $("#inputForm").on("submit", function(e)
    {
        e.preventDefault();
        var userInput = $("#user-input").val();
        searchGenius(userInput);
    });

    $("#back-button").click(showMainPage);


    // Callback function once we get all the results.
    function assignResultToMainPage(hitArray)
    {
        resultsSection.empty();
        for (var i = 0; i < hitArray.length; i++) 
        {
            var cardContainer = $("<button>");
            cardContainer.addClass("card mx-auto m-4 p-2");
            var albumArt = $(`<img src="${hitArray[i].result.header_image_thumbnail_url}">`);
            albumArt.addClass("album-art card-img-top");
            var songName = $("<h4>").text(hitArray[i].result.full_title);
            songName.addClass("mt-2");

            cardContainer.on('click', {songObject: hitArray[i]}, function (event)
            {
                assignSelectedSongToSecondaryPage(event.data.songObject);
            });

            cardContainer.append(albumArt);
            cardContainer.append(songName);
            resultsSection.append(cardContainer);
        }
    }

    function assignSelectedSongToSecondaryPage (songObject)
    {
        createQRCode(songObject.result.url);
        scrapeLyrics(songObject.result.path);

        $("#song-title").text(songObject.result.title);
        $("#artist-name").text(songObject.result.primary_artist.name);
        $("#album-art").attr("src", songObject.result.header_image_url);
        $("#page-views").text((songObject.result.stats.pageviews).toLocaleString('en'));
        $("#full-url").attr('href', songObject.result.url);
        $("#full-url").text("View song on Genius.");
        $("#full-title").text(songObject.result.full_title);
        
        showSecondaryPage();
    }

    //#region API Functions
    // Returns an array of 10 results.
    // EXAMPLE: searchGenius("Summer Love Trevor Something");
    function searchGenius(searchString)
    {
        var escapedSearch = encodeURI(searchString);
        const settings = 
        {
            "async": true,
            "crossDomain": true,
            "url": "https://rapidapi.p.rapidapi.com/search?q=" + escapedSearch,
            "method": "GET",
            "headers": 
            {
                "x-rapidapi-host": "genius.p.rapidapi.com",
                "x-rapidapi-key": geniusAPIKey
            }
        };
        // Log the escaped search string.
        $.ajax(settings).done(function (response) 
        {
            storeSomeShit(searchString)
            // Log the hits that we then return.
            assignResultToMainPage(response.response.hits);
            console.log(response.response.hits[0]);
        });
    }

    // Returns a url for the jpg asset.
    // EXAMPLE: createQRCode('https://bootcampspot.com/');
    function createQRCode(contentsString)
    {
        var escapedSearch = encodeURI(contentsString);
        const settings = 
        {
            "async": true,
            "crossDomain": true,
            "url": "https://rapidapi.p.rapidapi.com/getQrcode?type=url&value=" + escapedSearch,
            "method": "GET",
            "headers": 
            {
                "x-rapidapi-host": "codzz-qr-cods.p.rapidapi.com",
                "x-rapidapi-key": qrCodeAPIKey
            }
        };
        
        $.ajax(settings).done(function (response) 
        {
            
            $("#qr-code").attr("src", response.url);
        });
    }
    //#endregion
    
    //#region Lyrics function
    // Experimental function for scraping lyrics.
    function scrapeLyrics (path)
    {
        $.get("https://hide-the-payne.herokuapp.com/https://genius.com/" + path).then(data=> 
        {
            var rawLyrics = data.split(/(<!--sse-->)|(<!--\/sse-->)/)[9].replace(/<a href(.*?|\s*?)*?>/g,"").replace(/<.*?>/g,"");
            // rawLyrics = rawLyrics.replace(/(?:\r\n|\r|\n)/g, '<br>');
            $("#lyrics-container").text(rawLyrics);
        });
    }
    //#endregion

    //#region Helpers for showing and hiding using CSS.
    function showMainPage()
    {
        $("#secondary-page").addClass('hide');
        $("#main-page").removeClass('hide');

        $("#qr-code").attr('src','https://media.tenor.com/images/3df0af1b63e3d246a96091dc74196127/raw');
        $("#lyrics-container").text("Loading lyrics...");
    }

    function showSecondaryPage ()
    {
        $("#secondary-page").removeClass('hide');
        $("#main-page").addClass('hide');
    }
    //#endregion

    //Store users past searches
    function storeSomeShit(str){
        if(!history.includes(str)){
            history.push(str);
            localStorage.setItem("searchHistory", JSON.stringify(history))
        }
    }


    //this is autocomplete shit
    function autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
              /*check if the item starts with the same letters as the text field value:*/
              if (arr[i].toUpperCase().includes(val.toUpperCase())) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML += arr[i]
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += `<input type='hidden' value="${arr[i]}">`;
                /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
              }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
              /*If the arrow DOWN key is pressed,
              increase the currentFocus variable:*/
              currentFocus++;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 38) { //up
              /*If the arrow UP key is pressed,
              decrease the currentFocus variable:*/
              currentFocus--;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 13) {
              /*If the ENTER key is pressed, prevent the form from being submitted,*/
              e.preventDefault();
              if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
              }
            }
        });
        function addActive(x) {
          /*a function to classify an item as "active":*/
          if (!x) return false;
          /*start by removing the "active" class on all items:*/
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = (x.length - 1);
          /*add class "autocomplete-active":*/
          x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
          /*a function to remove the "active" class from all autocomplete items:*/
          for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
          }
        }
        function closeAllLists(el) {
          /*close all autocomplete lists in the document,
          except the one passed as an argument:*/
          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
            if (el != x[i] && el != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }
      /*execute a function when someone clicks in the document:*/
      document.addEventListener("click", function (e) {
          closeAllLists(e.target);
      });
      }
});

