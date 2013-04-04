var worker = function (trackedWords) {
    var twitter = require("ntwitter")
        , redis = require("redis")
        , credentials = require("./credentials.js");

    //create redis client                                                                                                                                                                                              
    var client = redis.createClient();

    // count trackers
    var totalHappySeen = 0
        , totalSadSeen = 0;

    var t = new twitter({
        consumer_key: credentials.consumer_key,
        consumer_secret: credentials.consumer_secret,
        access_token_key: credentials.access_token_key,
        access_token_secret: credentials.access_token_secret
    });

    t.stream(
        "statuses/filter",
        { track: trackedWords },
        function(stream) {
            stream.on("data", function(tweet) {
                trackedWords.forEach(function(word) {
                    if (word.sentiment === "happy") {
                        console.log(tweet);
                        if(tweet.text.indexOf(word) > -1) {
                            client.incr(word);
                            client.incr("totalHappySeen");
                        }
                    }
                });
                trackedSadWords.forEach(function(word) {
                    if (word.sentiment === "sad") {
                        console.log(tweet);
                        if(tweet.text.indexOf(word) > -1) {
                            client.incr(word);
                            client.incr("totalSadSeen");
                        }
                    }
                });
            });
        }
    );
};

module.exports = worker;