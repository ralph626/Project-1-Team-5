$(document).ready(function(){
    var geniusAPIKey = 'da2f98a609msh0e05646ac6fcbffp1befeajsndb45802075e4';
    var qrCodeAPIKey = 'da2f98a609msh0e05646ac6fcbffp1befeajsndb45802075e4';

    // References
    var resultsSection = $("#results");
    
    


    // -TODO: Get the string from the input
    // -TODO: Call the function with that input
    // TODO: Display results.
    // TODO: Make the results clickable.
    // TODO: Function for assigning things to second page.

    // On Click Functions
    $("#user-input-button").click(function(){
        var userInput = $("#user-input").val();
        searchGenius(userInput);
    });


    // Callback function once we get all the results.
    function assignResultToPage(hitArray)
    {
        resultsSection.empty();
        for (var i = 0; i < hitArray.length; i++) 
        {
            console.log(hitArray[i].result);

            var resultDiv = $("<div>");
            var songName = $("<h4>").text(hitArray[i].result.full_title);

            var albumArt = $(`<img src="${hitArray[i].result.header_image_url}" width="200px" height="200px">`)

            resultDiv.append(albumArt);
            resultDiv.append(songName);
            resultsSection.append(resultDiv);
        }
    }


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
        // console.log(escapedSearch);
        $.ajax(settings).done(function (response) 
        {
            // Log the hits that we then return.
            // console.log(response.response.hits);
            assignResultToPage(response.response.hits);
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
        
        $.ajax(settings).done(function (response) {
            // console.log(response.url);
            return response.url;
        });
    }
});