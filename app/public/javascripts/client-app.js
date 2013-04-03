var main = function () {
    var happyCount = 0
        , sadCount = 0;
        
    setInterval(function() {
        $("body").empty();
        // happy words
        $.getJSON("/counts.json", function (happyResponse) {
            $("body").append("<div class='happy-words'><h1>happy words<h1>");
            happyResponse.forEach(function(elt) {
                // tallies up the total happy count
                //happyCount = happyCount + elt.count;
                console.log(elt.count);
                $("body").append("<p>" + elt.key + ": " + elt.count + "</p>");
            });
            $("body").append("<p>total happy word count: " + happyCount + "</p></div>");
        });
        // sad words
        $.getJSON("/counts.json", function (sadResponse) {
            $("body").append("<div class='sad-words'><h1>sad words<h1>");
            sadResponse.forEach(function(elt) {
                // tallies up the total sad count
                //sadCount = sadCount + elt.count;
                console.log(elt.count);
                $("body").append("<p>" + elt.key + ": " + elt.count + "</p>");
            });
            $("body").append("<p>total sad word count: " + sadCount + "</p></div>");
        });
    }, 500);
};

$(document).ready(main);