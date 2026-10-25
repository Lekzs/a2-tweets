function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	const tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	if(tweet_array.length === 0) {
		window.alert('No tweets returned');
		return;
	}
	writtenTweets = tweet_array.filter(tweet => tweet.written);

}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	let searchBox = document.getElementById("textFilter");
    let searchCountSpan = document.getElementById("searchCount");
    let searchTextSpan = document.getElementById("searchText");
    let tweetTable = document.getElementById("tweetTable");

    // listen for any input event
    searchBox.addEventListener("input", function() {
        let query = searchBox.value.toLowerCase();
        
        searchTextSpan.textContent = searchBox.value;

        // if search box is empty, clear the table and count
        if (query.trim() === "") {
            searchCountSpan.textContent = 0;
            tweetTable.innerHTML = "";
            return;
        }

        // filter correct tweets
        let matchedTweets = writtenTweets.filter(tweet => 
            tweet.writtenText.toLowerCase().includes(query)
        );

        // update count
        searchCountSpan.textContent = matchedTweets.length;

        // populate table with matches
        let tableHTML = "";
        matchedTweets.forEach((tweet, index) => {
            tableHTML += tweet.getHTMLTableRow(index + 1); 
        });
        
        tweetTable.innerHTML = tableHTML;
    });
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});