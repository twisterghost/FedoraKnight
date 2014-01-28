// Require dependencies.
var request = require("request");
var argv = require("optimist").argv;
var colors = require("colors");

// Store the most recent timestamp.
var latest = 0;

// Get the desired subreddit, if any.
var subreddit = argv.subreddit || "all";

// Fetches the latest page of posts, printing out the posts if they were posted
// after the most recently seen post.
function fetchNew() {
	request("http://www.reddit.com/r/" + subreddit + "/new/.json", function(err, body, resp) {
		if (err) {
			throw err;
			return;
		}

		var data = JSON.parse(resp);
		var posts = data.data.children;

		// Loop through posts chronologically.
		for (var i = posts.length-1; i >= 0; i--) {
			var thisPost = posts[i].data;

			// If this post is new since the last check, display it.
			if (thisPost.created_utc > latest) {
				latest = thisPost.created_utc;
				printPost(thisPost);
			}
		}


	});
}

// Given a reddit post object, prints the post, formatted for the command line.
function printPost(thisPost) {
	var thisUrl = thisPost.url;
	var external = !thisPost.selftext;
	
	console.log(thisPost.title.bold);
	console.log(("Posted by: " + thisPost.author).italic);
	if (external) {
		console.log("\nLink: " + thisPost.url);
	} else {
		console.log("\n-> " + thisPost.selftext);
	}
	console.log("");
	console.log(("http://reddit.com" + thisPost.permalink).underline);
	console.log("================================");
}

console.log("Watching over /r/" + subreddit + "...");
fetchNew();
setInterval(fetchNew, 20000);