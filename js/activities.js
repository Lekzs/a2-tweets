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

	// Sort
	console.log(map);
	let sortedActivities = [...map.entries()].sort((a, b) => b[1] - a[1]);
	let top3 = sortedActivities.slice(0, 3);
	let top3Names = top3.map(entry => entry[0]);

	// Change document
	document.getElementById("firstMost").textContent = top3[0][0];
	document.getElementById("secondMost").textContent = top3[1][0];
	document.getElementById("thirdMost").textContent = top3[2][0];

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	let activityDistances = new Map();
    tweet_array.forEach(tweet => {
        if (tweet.source === 'completed_event' && tweet.distance > 0 && tweet.activityType !== 'unknown') {
            if (!activityDistances.has(tweet.activityType)) {
                activityDistances.set(tweet.activityType, []);
            }
            activityDistances.get(tweet.activityType).push(tweet.distance);
        }
    });

	let avgDistances = [];
	// Find mean of all distances
    activityDistances.forEach((distances, act) => {
        let mean = distances.reduce((a, b) => a + b, 0) / distances.length;
        avgDistances.push({ activity: act, meanDistance: mean });
    });
	avgDistances.sort((a, b) => b.meanDistance - a.meanDistance);
    
    if (avgDistances.length > 0) {
        document.getElementById("longestActivityType").textContent = avgDistances[0].activity;
        document.getElementById("shortestActivityType").textContent = avgDistances[avgDistances.length - 1].activity;
    }

	let activityCountsData = sortedActivities.map(([act, count]) => ({
        activityType: act,
        count: count
    }));

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityCountsData
	  },
	  //TODO: Add mark and encoding
	  "mark": "bar",
      "encoding": {
        "x": { "field": "activityType", "type": "nominal", "title": "Activity Type", "sort": "-y" },
        "y": { "field": "count", "type": "quantitative", "title": "Number of Tweets" }
      }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let top3TweetsData = tweet_array
        .filter(t => t.source === 'completed_event' && top3Names.includes(t.activityType) && t.distance > 0)
        .map(t => {
            return {
                activityType: t.activityType,
                distance: t.distance,
                day: daysOfWeek[t.time.getDay()]
            };
        });

    let distance_vis_spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Distances by day of the week for top 3 activities.",
        "data": { "values": top3TweetsData },
        "mark": "point",
        "encoding": {
            "x": {"field": "day", "type": "ordinal","sort": daysOfWeek, "title": "Day of the Week"},
            "y": {"field": "distance", "type": "quantitative", "title": "Distance (miles)"},
            "color": {"field": "activityType", "type": "nominal", "title": "Activity Type"
            }
        }
    };

    // plot mean dis
    let distance_vis_aggregated_spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Mean distance by day of week for top 3 activities.",
        "data": { "values": top3TweetsData },
        "mark": "line",
        "encoding": {
            "x": {"field": "day", "type": "ordinal", "sort": daysOfWeek, "title": "Day of the Week"},
            "y": {"aggregate": "mean", "field": "distance", "type": "quantitative", "title": "Mean Distance (miles)"},
            "color": {"field": "activityType", "type": "nominal", "title": "Activity Type"}
        }
    };

    // Render initial plot
    vegaEmbed('#distanceVis', distance_vis_spec, { actions: false });

	// Button handliong
    let isAggregated = false;
    let aggregateButton = document.getElementById("aggregate");

    if (aggregateButton) {
        aggregateButton.addEventListener("click", function () {
            if (isAggregated) {
                vegaEmbed('#distanceVis', distance_vis_spec, { actions: false });
                aggregateButton.textContent = "Show means";
            } else {
                vegaEmbed('#distanceVis', distance_vis_aggregated_spec, { actions: false });
                aggregateButton.textContent = "Show all points";
            }
            isAggregated = !isAggregated;
        });
    }

    document.getElementById("weekdayOrWeekendLonger").textContent = "weekends";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});