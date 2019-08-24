require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var br = "=================================================================\n";

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];

var variable = process.argv.splice(3).join(" ");

saveFile("\nCommand: " + command + "\n");

switch (command) {
    case "spotify-this-song":
        if (variable) {
            spotifyThisSong(variable);
        } else {
            variable = "The Sign";
            spotifyThisSong(variable);
        }
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
}

function spotifyThisSong(song) {
    spotify
        .search({ type: "track", query: song, limit: 20 })
        .then(function(response) {
            if (song === "The Sign") {
                for(let i = 0; i < 20; i++){
                    if (response.tracks.items[i].artists[0].name === "Ace of Base") {
                        var album = response.tracks.items[i].album.name;
                        var name = response.tracks.items[i].name;
                        var artist = response.tracks.items[i].artists[0].name;
                        var link = response.tracks.items[i].external_urls.spotify;
                        var output =
                            "Artist: " +
                            artist +
                            "\n" +
                            "Song: " +
                            name +
                            "\n" +
                            "Album: " +
                            album +
                            "\n" +
                            "link: " +
                            link +
                            "\n";
                        console.log(br + output);
                        saveFile(output);
                        return;
                    }
                }
            } else {
                response.tracks.items.forEach(element => {
                    var album = element.album.name;
                    var name = element.name;
                    var artist = element.artists[0].name;
                    var link = element.external_urls.spotify;
                    var output =
                        "Artist: " +
                        artist +
                        "\n" +
                        "Song: " +
                        name +
                        "\n" +
                        "Album: " +
                        album +
                        "\n" +
                        "link: " +
                        link +
                        "\n";
                    console.log(br + output);
                    saveFile(output);
                });
            }
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
                console.log("Events for " + artist + "\n" + br);
                for (let i = 0; i < response.data.length; i++) {
                    var venue, location, date;

                    if (response.data[i].venue) {
                        venue = response.data[i].venue.name;
                        location = response.data[i].venue.city + ", " + response.data[i].venue.country;
                    }

                    if (response.data[i].datetime) {
                        date = moment(response.data[i].datetime.split("T")[0], "YYYY-MM-DD").format("DD/MM/YYYY");
                    }

                    var output = venue + " in " + location + " on the " + date;
                    console.log(output);
                    saveFile(output);
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
                var output =
                    "Title: " +
                    response.data.Title +
                    "\n" +
                    "Year: " +
                    response.data.Year +
                    "\n" +
                    "Rating: " +
                    response.data.Rated +
                    "\n" +
                    "Rotten Tomatoes: " +
                    response.data.Ratings[1].Value +
                    "\n" +
                    "Country of Production: " +
                    response.data.Country +
                    "\n" +
                    "Language(s): " +
                    response.data.Language +
                    "\n" +
                    "Plot: \n" +
                    response.data.Plot +
                    "\n" +
                    "Actors: \n" +
                    response.data.Actors +
                    "\n";
                console.log(br + output);
                saveFile(output);
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

function saveFile(text) {
    fs.appendFile("log.txt", text, function(err) {
        if (err) throw err;
    });
}
