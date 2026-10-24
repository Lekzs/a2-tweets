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
        if(!this.prompt.includes("@runkeeper")){
			return true;
		}
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        let ind = Math.max(
            this.prompt.lastIndexOf("km"),
            this.prompt.lastIndexOf("mi")
        );
        if(ind == -1){
            return "unknown";
        }
        let next_space = this.prompt.substring(ind + 3).indexOf(" ");
        return this.prompt.substring(ind+3, next_space+ind+3);
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        let kms = this.prompt.lastIndexOf("km");
        let mi = this.prompt.lastIndexOf("mi")
        let end = this.prompt.length;
        if(kms == -1){
            end = mi;
        } else {
            end = kms;
        }
        let distance_string = this.prompt.substring(this.prompt.lastIndexOf("just completed a") + 16, end);
        let real_dist = 0;
        if(kms != -1){
            real_dist = parseFloat(distance_string)/1.609
        }
        return real_dist;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}