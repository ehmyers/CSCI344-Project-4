var main = function () {

    setInterval(function() {
        $(".happy-words").empty();
        // happy words
        $.getJSON("/happyCounts.json", function (response) {
            $(".happy-words").append("<h1>happy words</h1>");
            response.happySack.forEach(function(elt) {
                $(".happy-words").append("<p>" + elt.key.word + ": " + elt.count + "</p>");
            });
            $(".happy-words").append("<p>total happy word count: " + response.happyCount + "</p>");

        });
        $(".sad-words").empty();
        // sad words
        $.getJSON("/sadCounts.json", function (response) {
            $(".sad-words").append("<h1>sad words<h1>");
            response.sadSack.forEach(function(elt) {
                $(".sad-words").append("<p>" + elt.key.word + ": " + elt.count + "</p>");
            });
            $(".sad-words").append("<p>total sad word count: " + response.sadCount + "</p>");
        });
    }, 2000);
};

$(document).ready(main);