// ========== GLOBAL VARIABLES ==========
// Import modules
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");


var passedArgs = [];
var command = "";

// ========== FUNCTIONS ==========

// ========== MAIN PROCESSES ==========

// Store passed arguments by making an array of each arg, except node and file name
passedArgs = process.argv.slice(2);

// Store the command the user wants to run
command = passedArgs[0];

switch (command) {
	case "my-tweets":
		console.log("grab tweets");
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
