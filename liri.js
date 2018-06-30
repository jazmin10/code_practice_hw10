// ========== GLOBAL VARIABLES ==========
	// Import modules
	var request = require("request");
	var Twitter = require("twitter");
	var Spotify = require("node-spotify-api");
	var secretKeys = require("./keys.js");
	var fs = require("fs");

	var passedArgs = [];
	var command = "";

	// Twitter keys and tokens information
	var client = new Twitter({
		consumer_key: secretKeys.twitterKeys.consumer_key,
		consumer_secret: secretKeys.twitterKeys.consumer_secret,
		access_token_key: secretKeys.twitterKeys.access_token_key,
		access_token_secret: secretKeys.twitterKeys.access_token_secret
	});

	// Spotify id and secret information
	var spotify = new Spotify({
		id: secretKeys.spotifyKeys.client_id,
		secret: secretKeys.spotifyKeys.client_secret
	});

// ========== FUNCTIONS ==========

	// Grabs tweets
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

		// Make api request and then...
		client.get(twitterURL, params, function(twitterErr, tweet, response) {
			
			// if request is not succesful
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

	// Grabs song information
	function songInfo(songSelected) {

		// Store song passed to the function
		var song = songSelected;

		// If no song is given, then search for "The sign"
		if (song === "") {
			song = "The sign";
		}

		// Object holds parameters that will be used for the api request
		var queryObj = {
			type: "track",
			query: song,
			limit: 5
		};

		// Make api request and then...
		spotify.search(queryObj).then(function(response) {

			// Holds top 5 search results
			var results = response.tracks.items;

			// Loop through the results and display each song result
			for (var i = 0; i < results.length; i++) {

				// Since we want to say "Search result #1-5"
				var rank = i + 1;
				console.log("SEARCH RESULT #" + rank);

				displaySongInfo(results[i]);
			}

		}).catch(function(spotifyErr) {
			console.log(spotifyErr);
		});
	}

	// Displays a song's information
	function displaySongInfo(song) {
		console.log("Artist: " + song.artists[0].name);
		console.log("Song: " + song.name);
		console.log("Preview: " + song.album.external_urls.spotify);
		console.log("Album name: " + song.album.name);
		console.log("------------");
	}

	// Grab movie's information
	function movieInfo() {

		// Store movie entered by user by removing node, file name, 
		// and command. Then turning arr into a string with "+" in between
		var movie = passedArgs.slice(1).join("+");

		if (movie === "") {
			movie = "mr+nobody";
		}
		
		var queryURL = "http://www.omdbapi.com/?i=tt3896198&apikey=4b1d9a31&";
		queryURL += "plot=short&r=json&t=" + movie;

		request(queryURL, function(movieErr, response, body) {

			// If request is not successful...
			if (movieErr || response.statusCode !== 200) {
				console.log("Oops! something went wrong");
				return;
			}

			// Display movie information (body is a string which is why we JSON.parse it)
			displayMovieInfo(JSON.parse(body));

		});
	}

	// Displays movie's information
	function displayMovieInfo(movieResults) {
		console.log("TITLE: " + movieResults.Title);
		console.log("YEAR: " + movieResults.Year);
		console.log("IMDB RATING: " + movieResults.Ratings[0].Value);
		console.log("COUNTRY WHERE FILM WAS PRODUCED: " + movieResults.Country);
		console.log("LANGUAGE: " + movieResults.Language);
		console.log("PLOT: " + movieResults.Plot);
		console.log("ACTORS: " + movieResults.Actors);
		console.log("AWARDS: " + movieResults.Awards);
	}

	// Reads random.txt and performs the random command in the file
	function randomCommand() {
	
		// Reads data stored in random.txt
		fs.readFile("./random.txt", "utf8", function(readErr, data) {
			// Stop execution is there was a reading error
			if (readErr) {
				console.log("Oops! something went wrong");
				return;
			}

			// Turn string into an array and separate data wherever there is a comma
			var dataArr = data.split(",");

			// Store the random command
			var randomAction = dataArr[0];

			// Store the rest of data in random.txt as a string
			var randomValue = dataArr.slice(1).join(" ");

			// Execute the random command in random.txt
			switch (randomAction) {
				case "my-tweets":
					tweetInfo();
					break;
				case "spotify-this-song":
					songInfo(randomValue);
					break;
				case "movie-this":
					break;
				default:
					console.log("A wrong command was writtin in random.txt");
			}

		});
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
	// If the user entered spotify-this-song, display the top 5 song results
	case "spotify-this-song":
		console.log("TOP 5 SEARCH RESULTS");
		console.log("------------");

		var songEntered = passedArgs.slice(1).join(" ");
		songInfo(songEntered);
		break;
	case "movie-this":
		console.log("MOVIE SEARCH RESULTS:");
		movieInfo();
		break;
	case "do-what-it-says":
		randomCommand();
		break;
	default:
		console.log("oh no, try again!");
}
