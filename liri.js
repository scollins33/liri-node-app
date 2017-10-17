var fs = require('fs');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keyChain = require('./keys');

var twitterClient = new Twitter(keyChain.twitterKeys);
var spotifyClient = new Spotify(keyChain.spotifyKeys);

var command = process.argv[2];

switch (command) {
    case 'my-tweets':
        // show last 20 tweets and their creation time
        getMyTweets();
        break;
    case 'post-tweet':
        // post new status based on passed argument
        postMyTweet(process.argv[3]);
        break;
    case 'spotify-this-song':
        searchSongAPI(process.argv[3]);
        break;
    default:
        console.log('No matching command!');
        break;
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

                    console.log('-------'+  +'-------');
                    console.log('Artist(s): ' + allArtists);
                    console.log('Song Name: ' + pEach.name);
                    console.log('Preview URL: ' + pEach.preview_url);
                    console.log('Album Name: ' + pEach.album.name);
                    console.log('--------------');
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