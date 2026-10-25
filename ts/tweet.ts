class Tweet {
	private text:string;
    private prompt:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
        this.prompt = this.text.toLowerCase();
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
		if(this.prompt.startsWith("just completed") || this.prompt.startsWith("just posted")){
			return "completed_event";
		} else if (this.prompt.startsWith("watch my")){
			return "live_event";
		} else if (this.prompt.startsWith("achieved")){
			return "achievement";
		} else {
			return "miscellaneous";
		}
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        console.log("text: "+ this.writtenText);
        return this.writtenText.length > 0;
    }

    get writtenText():string {
        let text = this.prompt;

        // remove URLs and hashtags
        text = text.replace(/https?:\/\/\S+/gi, '');
        text = text.replace(/#runkeeper/gi, '');

        // remove "just completed a [distance] [activity]" up to @runkeeper, "with", or "-"
        text = text.replace(/(?:just\s+)?(?:completed|posted)\s+a\s+.*?(?:@runkeeper|with|-)/gi, '');

        // clean up
        text = text.replace(/check\s+it\s+out!?/gi, '');
        text = text.replace(/@runkeeper/gi, '');
        
        // clean anything left over
        return text.replace(/^[.\s:-]+/, '').trim();
    }

    get activityType():string {
        if (this.source !== 'completed_event') {
            return "unknown";
        }
        // use regex to match
        const distanceMatch = /(?:completed|posted) a \d+(?:\.\d+)?\s*(?:km|mi)\s+([a-z\s]+?)(?=\s+(?:with|in|-|@|http|#|$))/i.exec(this.prompt);
        if (distanceMatch) {
            return distanceMatch[1].trim().toLowerCase();
        }
        return "unknown";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        // regex
        const match = /(?:completed|posted) a (\d+(?:\.\d+)?)\s*(km|mi)\b/i.exec(this.prompt);
        if (!match) {
            return 0;
        }

        const val = parseFloat(match[1]);
        const unit = match[2].toLowerCase();

        if (isNaN(val)) {
            return 0;
        }

        // convert or just return
        return unit === 'km' ? val / 1.609 : val;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        // make urls clickable
        let linkedText = this.prompt.replace(/(https?:\/\/\S+)/gi, '<a href="$1" target="_blank">$1</a>');

        // Return an HTML table row string
        return `
            <tr>
                <td>${rowNumber}</td>
                <td>${this.activityType}</td>
                <td>${linkedText}</td>
            </tr>
        `;    
    }
}