function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	const tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	if(tweet_array.length === 0) {
		window.alert('No tweets returned');
		return;
	}

	// Loop through tweet array, find earliest/latest time
	let earliest = new Date(tweet_array[0].time);
	let latest = new Date(tweet_array[0].time);

	let completed = 0;
	let live = 0;
	let achieve = 0;
	let misc = 0;
	let written = 0;
	for(let i = 0; i < tweet_array.length; i++){
		// Check dates
		let date = new Date(tweet_array[i].time);
		if(date < earliest){
			earliest = date;
		} 
		if (date > latest){
			latest = date;
		}
		switch (tweet_array[i].source) {
			case "completed_event":
				completed++;

				if (tweet_array[i].written) {
					written++;
				}
				break;

			case "live_event":
				live++;
				break;

			case "achievement":
				achieve++;
				break;

			default:
				misc++;
		}
	}
	for(let i = 5; i < tweet_array.length; i++){
		console.log(tweet_array[i].text);
		console.log(tweet_array[i].activityType);
	}
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	// Set earliest/latest dates
	document.getElementById('firstDate').innerText = earliest.toLocaleDateString();
	document.getElementById('lastDate').innerText = latest.toLocaleDateString();
	// Set rest of info
	document.getElementsByClassName('completedEvents')[0].innerText = completed;
	document.getElementsByClassName('completedEvents')[1].innerText = completed;
	document.getElementsByClassName('completedEventsPct')[0].innerText = ((completed / tweet_array.length) * 100).toFixed(2) + '%';
	document.getElementsByClassName('liveEvents')[0].innerText = live;
	document.getElementsByClassName('liveEventsPct')[0].innerText = ((live / tweet_array.length) * 100).toFixed(2) + '%';
	document.getElementsByClassName('achievements')[0].innerText = achieve;
	document.getElementsByClassName('achievementsPct')[0].innerText = ((achieve / tweet_array.length) * 100).toFixed(2) + '%';
	document.getElementsByClassName('miscellaneous')[0].innerText = misc;
	document.getElementsByClassName('miscellaneousPct')[0].innerText = ((misc / tweet_array.length) * 100).toFixed(2) + '%';
	document.getElementsByClassName('written')[0].innerText = written;
	document.getElementsByClassName('writtenPct')[0].innerText = ((written / completed) * 100).toFixed(2) + '%';

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
