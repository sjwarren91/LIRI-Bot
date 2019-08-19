require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];

var variable = process.argv.splice(3).join(" ");

switch (command) {
    case "spotify-this-song":
        spotifyThisSong(variable);
        break;
    case "concert-this":
        concertThis(variable);
        break;
    case "movie-this":
        if (variable) {
            movieThis(variable);
        } else {
            movieThis("Mr. Nobody");
        }
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
}

function spotifyThisSong(song) {
    spotify
        .search({ type: "track", query: song, limit: 1 })
        .then(function(response) {
            var album = response.tracks.items[0].album.name;
            var name = response.tracks.items[0].name;
            var artist = response.tracks.items[0].artists[0].name;
            var link = response.tracks.items[0].external_urls.spotify;

            console.log("=================================================================");
            console.log("Artist: " + artist + "\n");
            console.log("Song: " + name + "\n");
            console.log("Album: " + album + "\n");
            console.log("link: " + link + "\n");
        })
        .catch(function(err) {
            console.log(err);
        });
}

function concertThis(artist) {
    axios
        .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function(response) {

            if (response.data.length > 0) {
                for (let i = 0; i < response.data.length; i++) {
                    var venue, location, date;
                    
                    if(response.data[i].venue){
                        venue = response.data[i].venue.name;
                        location = response.data[i].venue.city + ", " + response.data[i].venue.region;
                    }

                    if(response.data[i].datetime){
                        date = moment(response.data[i].datetime.split("T")[0], "YYYY-MM-DD").format("DD/MM/YYYY");
                    }

                    console.log("=================================================================");
                    console.log("Venue: " + venue + "\n");
                    console.log("Location: " + location + "\n");
                    console.log("Date: " + date + "\n");
                }
            } else {
                console.log("No info found.");
            }
        })
        .catch(function(err) {
            console.log(err);
        });
}

function movieThis(movie) {
    axios
        .get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy")
        .then(function(response) {
            if (response.data.Response === "True") {
                console.log("=================================================================");
                console.log("Title: " + response.data.Title + "\n");
                console.log("Year: " + response.data.Year + "\n");
                console.log("Rating: " + response.data.Rated + "\n");
                console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value + "\n");
                console.log("Country of Production: " + response.data.Country + "\n");
                console.log("Language(s): " + response.data.Language + "\n");
                console.log("Plot: \n" + response.data.Plot + "\n");
                console.log("Actors: \n" + response.data.Actors + "\n");
            } else {
                console.log("Movie not found.");
            }
        })
        .catch(function(err) {
            console.log(err);
        });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) throw error;

        var dataArr = data.split(",");
        console.log(dataArr);

        switch (dataArr[0]) {
            case "movie-this":
                movieThis(dataArr[1]);
                break;
            case "concert-this":
                concertThis(dataArr[1]);
                break;
            case "spotify-this-song":
                spotifyThisSong(dataArr[1]);
                break;
        }
    });
}
