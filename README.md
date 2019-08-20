# LIRI-Bot
What is LIRI? LIRI is like iPhone's SIRI, However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a _Language_ Interpretation and Recognition Interface. LIRI is a command line node app that takes in parameters and gives you back data.

## How does it work?
LIRI-bot takes in either of the following commands.
* 'concert-this'
* 'spotify-this-song'
* 'movie-this'
* 'do-what-it-says'

## What does each command do?
1. 'node liri.js concert-this <artist/band name here'
* This command searches the Bands in Town Artist Events API for an artist and renders the name of the venue, the venue location, and the date of the event, for each event to the terminal. 

2. 'node liri.js spotify-this-song <song name here>'
This will show the following information in the terminal.
  * Artist
  * The song's name
  * A preview link of the song from Spotify
  * The album that the song is from
  If no song is provided then the bot will default to "The Sign" by Ace of Base.
