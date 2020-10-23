$(document).ready(function(){



    var geniusAPIKey = 'da2f98a609msh0e05646ac6fcbffp1befeajsndb45802075e4';
    var qrCodeAPIKey = 'da2f98a609msh0e05646ac6fcbffp1befeajsndb45802075e4';


    // TODO: Get the string from the input
    // TODO: Call the function with that input
    // TODO: Display results.
    // TODO: Make the results clickable.
    // TODO: Function for assigning things to second page.


    searchGenius("Phil Collins");


    // Called once we get all the results back.
    function assignResultToPage(hitArray)
    {
        console.log(hitArray[0]);
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