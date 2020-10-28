$(document).ready(function(){
    var geniusAPIKey = 'da2f98a609msh0e05646ac6fcbffp1befeajsndb45802075e4';
    var qrCodeAPIKey = 'da2f98a609msh0e05646ac6fcbffp1befeajsndb45802075e4';

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
            // console.log(hitArray[i].result);

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
        showSecondaryPage();
        createQRCode(songObject.result.url);
        $("#song-title").text(songObject.result.title);
        $("#artist-name").text(songObject.result.primary_artist.name);
        $("#album-art").attr("src", songObject.result.header_image_url);
        $("#page-views").text(songObject.result.stats.pageviews);
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
            // Log the hits that we then return.
            assignResultToMainPage(response.response.hits);
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
        $.get("https://cors-anywhere.herokuapp.com/https://genius.com/" + path).then(data=> 
        {
            const rawLyrics = data.split(/(<!--sse-->)|(<!--\/sse-->)/)[9].replace(/<a href(.*?|\s*?)*?>/g,"").replace(/<.*?>/g,"");
            return rawLyrics;
        });
    }
    //#endregion

    //#region Helpers for showing and hiding using CSS.
    function showMainPage()
    {
        $("#secondary-page").addClass('hide');
        $("#main-page").removeClass('hide');

        $("#qr-code").attr('src','https://media.tenor.com/images/3df0af1b63e3d246a96091dc74196127/raw');
    }

    function showSecondaryPage ()
    {
        $("#secondary-page").removeClass('hide');
        $("#main-page").addClass('hide');
    }
    //#endregion
});