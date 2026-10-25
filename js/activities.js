function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// Create dict of all activity types and count
	let map = new Map();
	for(let i = 0; i < tweet_array.length; i++){
		let activity = tweet_array[i].activityType;
		if(activity != "unknown"){
			let currcount = map.get(activity) || 0;
			map.set(activity, currcount + 1);
		}
	}
	// Sort array

	// let arr = []
	// map.forEach((val, key) => {
	// 	arr.push([key, val]);
	// 	arr.sort((a, b) => b[1] - a[1]);
	// 	if(arr.length > 3){
	// 		arr.pop();
	// 	}
	// })

	console.log(map);
	let top3 = [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

	// Change document
	document.getElementById("firstMost").textContent = top3[0][0];
	document.getElementById("secondMost").textContent = top3[1][0];
	document.getElementById("thirdMost").textContent = top3[2][0];

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});