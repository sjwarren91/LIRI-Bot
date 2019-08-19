require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];

var variable = process.argv.splice(3).join(" ");

switch(command) {
    case "spotify-this-song":
        spotifyThisSong(variable);
        break;
    case "concert-this":
        concertThis(variable);
        break;
};

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
                for (let i = 0; i < 5; i++) {
                    var venue = response.data[i].venue.name;
                    var location = response.data[i].venue.city + ", " + response.data[i].venue.region;
                    var date = moment(response.data[i].datetime.split("T")[0], "YYYY-MM-DD").format("DD/MM/YYYY");

                    console.log("=================================================================");
                    console.log("Venue: " + venue + "\n");
                    console.log("Location: " + location + "\n");
                    console.log("Date: " + date + "\n");
                }
            } else {console.log("No info found.")}
        })
        .catch(function(err) {
            console.log(err);
        });
}
