var express = require("express"),
    http = require("http"),
    path = require("path"),
    redis = require("redis"),
    redisClient = redis.createClient(),
    app = express(),
    twitterWorker = require("./twitter.js"),

    trackedWords = [
        {"word": "awesome", "sentiment": "happy"},
        {"word": "cool", "sentiment": "happy"},
        {"word": "rad", "sentiment": "happy"},
        {"word": "banana", "sentiment": "happy"},
        {"word": "swell", "sentiment": "happy"},
        {"word": "bummer", "sentiment": "sad"},
        {"word": "unhappy", "sentiment": "sad"},
        {"word": "morose", "sentiment": "sad"},
        {"word": "plum", "sentiment": "sad"},
        {"word": "pain", "sentiment": "sad"}
    ];

// basic configuration
app.configure(function () {                                                                                  
    app.use(express.static(path.join(__dirname, "public")));
});

// create twitter worker
twitterWorker(trackedWords);

// create the http server, have it listen on 3000
http.createServer(app).listen(3000, function() {
    console.log("Express server listening on port 3000");
});

// send hello world to the client as html
app.get("/", function (req, res) {
    res.send("Hello World!");
});

app.get("/happyCounts.json", function (req, res) {
    // array of strings to pass to mget
    var keys = [],
        i;
    for (i = 0; i < trackedWords.length; i += 1) {
        keys.push(trackedWords[i].word);
    }
    redisClient.mget(keys, function (error, count) {
        if (error !== null) {
            // handle error here                                                                                                                       
            console.log("ERROR: " + error);
        } else {
            // happy words
            var happyResult = []
                , i;

            for (i = 0; i < trackedWords.length; i = i + 1) {
                console.log[trackedWords[i]];
                if (trackedWords[i].sentiment === "happy") {
                    //console.log(trackedWords[i]);
                    happyResult.push({
                        "key": trackedWords[i],
                        "count": count[i]
                    });
                }
            }
            redisClient.get("totalHappySeen", function(error, totalHappy) {
                res.json({
                    "happySack": happyResult,
                    "happyCount": totalHappy
                });
            });
        }
    });
});

app.get("/sadCounts.json", function (req, res) {
    // array of strings to pass to mget
    var keys = [],
        i;
    for (i = 0; i < trackedWords.length; i += 1) {
        keys.push(trackedWords[i].word);
    }
    console.log(keys);
    redisClient.mget(keys, function (error, count) {
        console.log(count);
        if (error !== null) {
            // handle error here                                                                                                                       
            console.log("ERROR: " + error);
        } else {
            // sad words
            var sadResult = [],
                i;

            for (i = 0; i < trackedWords.length; i = i + 1) {
                if (trackedWords[i].sentiment === "sad") {
                    sadResult.push({
                        "key": trackedWords[i],
                        "count": count[i]
                    });
                }
            }

            redisClient.get("totalSadSeen", function(error, totalSad) {
                res.json({
                    "sadSack": sadResult,
                    "sadCount": totalSad
                });
            });
        }
    });
});