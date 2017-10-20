var fs = require('fs');
var requests = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keyChain = require('./keys');

var twitterClient = new Twitter(keyChain.twitterKeys);
var spotifyClient = new Spotify(keyChain.spotifyKeys);

function processCommand(pCommand, pInput) {
    switch (pCommand) {
        case 'my-tweets':
            // show last 20 tweets and their creation time
            getMyTweets();
            break;
        case 'post-tweet':
            // post new status based on passed argument
            postMyTweet(pInput);
            break;
        case 'spotify-this-song':
            searchSongAPI(pInput);
            break;
        case 'movie-this':
            searchIMDB(pInput);
            break;
        case 'do-what-it-says':
            doThaThang();
            break;
        default:
            console.log('No matching command!');
            break;
    }
}

function getMyTweets() {
    twitterClient.get('statuses/user_timeline.json', {count: 20},
        function (err, tweets, response) {
            if (err) throw err;

            if (response.statusCode === 200) {
                console.log('--------------');
                tweets.forEach(function (t) {
                    console.log(` > ${t.created_at} | ${t.text}`);
                });
                console.log('--------------');
            }
    });
}

function postMyTweet(pTweet) {
    if (process.argv[3]) {
        twitterClient.post('statuses/update', {status: pTweet},
            function (err, tweet, response) {
                if (err) { console.log(JSON.stringify(err));}

                if (response.statusCode === 200) {
                    console.log('--------------');
                    console.log('Posted: ' + pTweet);
                    console.log('--------------');
                }
            });
    }
    else {
        console.log('Please enter a String after post-tweet command!')
    }
}

function searchSongAPI(pSong) {
    var apiURL = 'https://api.spotify.com/v1/search?limit=3&type=track&q=';
    var query = pSong.replace(/ /g, '%20');

    spotifyClient
        .request(apiURL + query)
        .then(function (response) {
            var responseItems = response.tracks.items;

            if (responseItems.length > 0) {
                responseItems.forEach(function (pEach) {
                    var responseArtists = pEach.artists;
                    var allArtists = '';

                    responseArtists.forEach(function (pArtist) {
                        allArtists += (pArtist.name + ', ');
                    });

                    console.log('--------------');
                    console.log('Artist(s): ' + allArtists);
                    console.log('Song Name: ' + pEach.name);
                    console.log('Preview URL: ' + pEach.preview_url);
                    console.log('Album Name: ' + pEach.album.name);
                });
            }
            else {
                searchSongAPI('The Sign Ace of Base');
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function searchIMDB(pMovie) {
    if (pMovie === undefined) {pMovie = 'Mr. Nobody'}

    var query = pMovie.replace(/ /g, '%20');
    var apiURL = 'http://www.omdbapi.com/?apikey=' + keyChain.imdbKeys.key
        + '&type=movie&t=' + query;

    requests(apiURL, function (err, response, body) {
        if (err) {
            console.log(err);
            return;
        } else {
            var data = JSON.parse(body);

            console.log('--------------');
            //title
            console.log('Title: ' + data["Title"]);
            //year
            console.log('Released: ' + data["Released"]);
            //rating
            console.log('IMDB Rating: ' + data["Ratings"][0].Value);
            //rotten tomatoes
            console.log('Rotten Tomatoes Rating: ' + data["Ratings"][1].Value);
            //country produced
            console.log('Country: ' + data["Country"]);
            //language
            console.log('Language: ' + data["Language"]);
            //plot
            console.log('Plot: ' + data["Plot"]);
            //actors
            console.log('Actors: ' + data["Actors"]);
        }
    });
}

function doThaThang() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) {
            console.log(err);
            return;
        } else {
            var command = data.split(',');

            processCommand(command[0], command[1]);
        }
    })
}

processCommand(process.argv[2], process.argv[3]);