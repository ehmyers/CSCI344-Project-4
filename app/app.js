var express = require("express")
    , http = require("http")
    , path = require("path")
    , redisClient = require("redis").createClient()
    , app = express()
    , twitterWorker = require("./twitter.js");

trackedHappyWords = ["awesome", "cool", "rad", "banana", "swell"];
trackedSadWords = ["sad", "unhappy", "morose", "hurtful", "pain"];

// basic configuration
app.configure(function () {                                                                                           
    app.use(express.static(path.join(__dirname, "public")));
});

// create twitter worker
twitterWorker(trackedHappyWords);

// create the http server, have it listen on 3000
http.createServer(app).listen(3000, function(){
    console.log("Express server listening on port 3000");
});

// send hello world to the client as html
app.get("/", function (req, res) {
    res.send("Hello World!");
});

app.get("/counts.json", function (req, res) {
    redisClient.mget(trackedHappyWords, function (error, count) {
        if (error !== null) {
                // handle error here                                                                                                                       
                console.log("ERROR: " + error);
        }
        else {
            // happy words
            var happyResult = []
                , i;

            for (i = 0; i < trackedHappyWords.length; i = i + 1) {
                happyResult.push({
                    "key":trackedHappyWords[i],
                    "count":count[i]
                });
            }
            res.json(happyResult);
        }
    });
    redisClient.mget(trackedSadWords, function (error, count) {
        if (error !== null) {
                // handle error here                                                                                                                       
                console.log("ERROR: " + error);
        }
        else {
            // sad words
            var sadResult = []
                , i;

            for (i = 0; i < trackedSadWords.length; i = i + 1) {
                sadResult.push({
                    "key":trackedSadWords[i],
                    "count":count[i]
                });
            }
            res.json(sadResult);
        }
    });
});