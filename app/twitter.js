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
    
    var keys = []
        , i;
    for (i = 0; i < trackedWords.length; i += 1) {
        keys.push(trackedWords[i].word);
    }
    
    t.stream(
        "statuses/filter",
        { track: keys },
        function(stream) {
            stream.on("data", function(tweet) {
                trackedWords.forEach(function(wordObj) {
                    if (wordObj.sentiment === "happy") {
                        if(tweet.text.indexOf(wordObj.word) > -1) {
                            client.incr(wordObj.word);
                            client.incr("totalHappySeen");
                        }
                    }
                });
                trackedWords.forEach(function(wordObj) {
                    if (wordObj.sentiment === "sad") {
                        if(tweet.text.indexOf(wordObj.word) > -1) {
                            client.incr(wordObj.word);
                            client.incr("totalSadSeen");
                        }
                    }
                });
            });
        }
    );
};

module.exports = worker;