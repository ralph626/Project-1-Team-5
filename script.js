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
    // TODO:Make sure to clear the QR Code.

    // On Click Functions
    $("#user-input-button").click(function()
    {
        var userInput = $("#user-input").val();
        searchGenius(userInput);
    });

    $("#back-button").click(function()
    {
        showMainPage();
    });


    // Callback function once we get all the results.
    function assignResultToMainPage(hitArray)
    {
        resultsSection.empty();
        for (var i = 0; i < hitArray.length; i++) 
        {
            // console.log(hitArray[i].result);

            var resultDiv = $("<div>");
            var albumArt = $(`<img src="${hitArray[i].result.header_image_url}" width="200px" height="200px">`);
            var songName = $("<h4>").text(hitArray[i].result.full_title);
            var selectButton = $("<button>").text("Select this song.");

            selectButton.on('click', {songObject: hitArray[i]}, function (event)
            {
                assignSelectedSongToSecondaryPage(event.data.songObject);
            });

            resultDiv.append(songName);
            resultDiv.append(albumArt);
            resultDiv.append(selectButton);
            resultsSection.append(resultDiv);
        }
    }

    function assignSelectedSongToSecondaryPage (songObject)
    {
        console.log(songObject);
        $("#main-page").addClass('hide');
        $("#secondary-page").removeClass('hide');
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
        console.log("Here");
        $("#secondary-page").addClass('hide');
        $("#main-page").removeClass('hide');
    }

    function showSecondaryPage ()
    {
        $("#secondary-page").removeClass('hide');
        $("#main-page").addClass('hide');
    }
    //#endregion
});