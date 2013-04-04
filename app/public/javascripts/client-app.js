var main = function () {
    var happyCount = 0
        , sadCount = 0;

    //setInterval(function() {
        $("div > happy-words").empty();
        // happy words
        $.getJSON("/happyCounts.json", function (happyResponse) {
            $(".happy-words").append("<h1>happy words</h1>");
            happyResponse.forEach(function(elt) {
                // tallies up the total happy count
                //happyCount = happyCount + parseInt(elt.count, 10);
                $(".happy-words").append("<p>" + elt.key + ": " + elt.count + "</p>");
            });
            $(".happy-words").append("<p>total happy word count: " + happyCount + "</p>");

        });
        $("div > sad-words").empty();
        // sad words
        $.getJSON("/sadCounts.json", function (sadResponse) {
            $(".sad-words").append("<h1>sad words<h1>");
            sadResponse.forEach(function(elt) {
                // tallies up the total sad count
                //sadCount = sadCount + parseInt(elt.count, 10);
                $(".sad-words").append("<p>" + elt.key + ": " + elt.count + "</p>");
            });
            $(".sad-words").append("<p>total sad word count: " + sadCount + "</p>");
        });
    //}, 500);
};

$(document).ready(main);