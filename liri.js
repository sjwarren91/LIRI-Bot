require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require('node-spotify-api');

var axios = require('axios');

var spotify = new Spotify(keys.spotify);

var command = process.argv[2]

var variable = process.argv.splice(3).join(" ")

switch(command) {
    case "spotify-this-song":
        spotifyThisSong(variable);
        break;
};


function spotifyThisSong(song){
    
    spotify.search({ type: 'track', query:song, limit:1})
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
    .catch(function(err){
        console.log(err);
    })
}