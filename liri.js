// ========== GLOBAL VARIABLES ==========
	// Import modules
	var request = require("request");
	var Twitter = require("twitter");
	var Spotify = require("node-spotify-api");
	var secretKeys = require("./keys.js");

	var passedArgs = [];
	var command = "";

	// Twitter keys and tokens
	var client = new Twitter({
		consumer_key: secretKeys.twitterKeys.consumer_key,
		consumer_secret: secretKeys.twitterKeys.consumer_secret,
		access_token_key: secretKeys.twitterKeys.access_token_key,
		access_token_secret: secretKeys.twitterKeys.access_token_secret
	});

// ========== FUNCTIONS ==========

	function tweetInfo() {
		// query url we will be using for our request
		var twitterURL = "statuses/user_timeline";

		// we include paramaters we will be using
			// screen_name is the username of the person's tweets we are looking for
			// count is the amount of tweets we want to grab
		var params = {
			screen_name: "coding_hw",
			count: 20
		};

		// Make api request
		client.get(twitterURL, params, function(twitterErr, tweet, response) {
			if (twitterErr) {
				console.log("Something went wrong");
				return;
			}

			// Loop through the tweet array and display each tweet
			tweet.forEach(function(item) {
				displayTweet(item);
			});

		});
	}

	// Display each tweet
	function displayTweet(tweetInfo) {
		console.log("-----------------");
		console.log(tweetInfo.text);
	}

// ========== MAIN PROCESSES ==========

// Store passed arguments by making an array of each arg, except node and file name
passedArgs = process.argv.slice(2);

// Store the command the user wants to run
command = passedArgs[0];

// Determine which command the user picked
switch (command) {

	// If the user entered my-tweets, display the last 20 tweets of the user
	case "my-tweets":
		console.log("These are the last 20 tweets: ");
		tweetInfo();
		break;
	case "spotify-this-song":
		console.log("grab song info");
		break;
	case "movie-this":
		console.log("grab movie info");
		break;
	case "do-what-it-says":
		console.log("perform random thing");
		break;
	default:
		console.log("oh no, try again!");
}
