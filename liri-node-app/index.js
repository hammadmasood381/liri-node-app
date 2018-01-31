var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var fs = require('file-system');

require("dotenv").config();

var keys = require("./keys.js");
var twitterkeys = keys.twitter;
var spotifykeys = keys.spotify;
var omdbkeys = keys.omdb;

var spotifyapi = new Spotify({
    id: spotifykeys.id,
    secret: spotifykeys.secret
})

var twitterapi = new Twitter({
    consumer_key: twitterkeys.consumer_key,
    consumer_secret: twitterkeys.consumer_secret,
    access_token_key: twitterkeys.access_token_key,
    access_token_secret: twitterkeys.access_token_secret
})

do_it(process.argv[2],process.argv[3]);

function do_it(com,arg) {
    if(com == "my-tweets") {
        my_tweets();
    }
    else if(com == "spotify-this-song") {
        spotify_this_song(arg);
    }
    else if(com == "movie-this") {
        movie_this(arg);
    }
    else if(com == "do-what-it-says") {
        do_what_it_says();
    }
    else {
        console.log("ERROR YOU DIDNT INPUT VALID OPTION");
        logger("ERROR YOU DIDNT INPUT VALID OPTION");
    }
}

function my_tweets() {
    logger("my-tweets");
    var params = {
        screen_name: "JustinRoiland",
        count: 20
    }
    twitterapi.get("statuses/user_timeline",params,function(err,tweets,responce) {
        if(err) {
            console.log("TWITTER ERROR");
            logger("TWITTER ERROR");
        }
        else {
            
            for (var i = 0; i < tweets.length; i++) {
                console.log("tweet " + (i+1) + ": " + tweets[i].text);
                logger("tweet " + (i+1) + ": " + tweets[i].text);
            }
        }
    })
}

function do_what_it_says() {
    logger("do-what-it-says");
    fs.readFile("./random.txt",function(err,data) {
        if(err) {
            console.log("FILE READING ERROR");
            logger("FILE READING ERROR");
        }
        else {
            var lines = data.toString().split("\n");

            for(var i = 0; i < lines.length; i++) {
                var line = lines[i].split(",");
                var com = line[0];
                var arg = line[1];
                console.log("Command: " + com,"Argument: " + arg);
                logger("Command: " + com,"Argument: " + arg);
                do_it(com,arg);
            }
        }
    });
}

function movie_this(arg) {
    var movie;

    if (arg == undefined) {
        movie = "Mr. Nobody";
        logger("movie-this");
    }
    else {
        movie = arg;
        logger("movie-this " + movie);
    }

    request({
        url: "http://www.omdbapi.com/?apikey="
            + omdbkeys.apikey
            + "&"
            + "t="
            + movie
            + "&r=json"
            + "&plot=full",
        method: "GET"
    }, function (err, res, body) {
        if (err) {
            console.log("OMDB ERROR");
            logger("OMDB ERROR");
        }
        else {
            var json = JSON.parse(body);
            console.log("Title: " + json.Title);
            logger("Title: " + json.Title);
            console.log("Year: " + json.Year);
            logger("Year: " + json.Year);
            console.log("IMDB Rating: " + json.Ratings[0].Value);
            logger("IMDB Rating: " + json.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + json.Ratings[1].Value);
            logger("Rotten Tomatoes Rating: " + json.Ratings[1].Value);
            console.log("Country/Countries Produced In: " + json.Country);
            logger("Country/Countries Produced In: " + json.Country);
            console.log("Languge/Languages: " + json.Language);
            logger("Languge/Languages: " + json.Language);
            console.log("Plot: " + json.Plot);
            logger("Plot: " + json.Plot);
            console.log("Actors/Actresses: " + json.Actors)
            logger("Actors/Actresses: " + json.Actors);
        }
    })
}

function spotify_this_song(arg) {
    var song;

    if (arg == undefined) {
        song = "The Sign Ace Of Base";
        logger("spotify-this-song");
    }
    else {
        song = arg;
        logger("spotify-this-song " +song);
    }

    spotifyapi.search({
        type: "track",
        query: song
    }, function (err, data) {
        if (err) {
            console.log("SPOTIFY ERROR")
            logger("SPOTIFY ERROR");
        }
        else {
            console.log("Song Name: "+ data.tracks.items[0].name);
            logger("Song Name: "+ data.tracks.items[0].name);
            console.log("Artist/s Name: "+ data.tracks.items[0].artists[0].name);
            logger("Artist/s Name: "+ data.tracks.items[0].artists[0].name);
            console.log("Spotify Link: "+ data.tracks.items[0].external_urls.spotify);
            logger("Spotify Link: "+ data.tracks.items[0].external_urls.spotify);
            console.log("Album Name: "+ data.tracks.items[0].album.name);
            logger("Album Name: "+ data.tracks.items[0].album.name);
        }
    });
}

function logger(logstring) {
    fs.appendFile("log.txt",logstring + "\n", function (err) {
        if (err) {
          console.log("couldnt write to log file");
        } else {

        }
      })
}


