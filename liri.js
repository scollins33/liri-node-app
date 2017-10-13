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
        searchSong(process.argv[3]);
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

function searchSong(pSong) {
    spotifyClient
        .search({type: 'track', query: pSong})
        .then(function (response) {
            console.log(response.tracks.items[0]);
        })
        .catch(function (err) {
            console.log(err);
        });
}