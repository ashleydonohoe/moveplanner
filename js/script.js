
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $('#street').val();
    var city = $('#city').val();
    $greeting.text('So, you want to live at ' + street + ' in ' + city + '?');
    $body.append('<img class="bgimg" src="https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + street + ',' + city + '">');

    // NYTimes -> API KEY is a70870151d8f4c6cd36a888674d06f9f:18:63302611
    var nytURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?" +city+ "&api-key=a70870151d8f4c6cd36a888674d06f9f:18:63302611";
    $.getJSON(nytURL, function (data) {
        var articles = data.response.docs;
        for(var i = 0; i < articles.length; i++) {
            var articleURL = articles[i].web_url;
            var headline = '<a href="' +articleURL+'">' + articles[i].headline.main + '</a>';
            var snippet = '<p>' + articles[i].snippet + '</p>';
            var newItem = '<li class="article">' + headline + snippet + '</li>';
            $('#nytimes-articles').append(newItem);
        };
    }).error(function(e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    // Loads Wikipedia article links
    var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search="+city+"&format=json&callback=wikiCallback";
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("Failed to Get Wikipedia Resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        //jsonp: "callback",
        success: function( response ) {
            var articleList = response[1];
            console.log(articleList.length);
            if(articleList.length === 0) {
                $wikiElem.text("Sorry, no Wikipedia articles were found for your query.");
            } else {
                for(var i = 0; i < articleList.length; i++) {
                    var articleStr = articleList[i];
                    var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                    $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
                 };
            }

            clearTimeout(wikiRequestTimeout);
        }

    });

    return false;
};

$('#form-container').submit(loadData);
