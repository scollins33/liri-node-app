var fs = require('fs');
var Twitter = require('twitter');
var keyChain = require('./keys');

var twitterClient = new Twitter(keyChain.twitterKeys);

var command = process.argv[2];

switch (command) {
    case 'my-tweets':
        // show last 20 tweets and their creation time
        getMyTweets();
        break;
    default:
        console.log('No matching command!');
        break;
}

function getMyTweets() {
    twitterClient.get('statuses/user_timeline.json', {count: 20},
        function (err, tweets, response) {
            if (err) throw err;

            tweets.forEach(function (t) {
                console.log(` > ${t.created_at} | ${t.text}`);
            });
    });
}