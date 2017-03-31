// User is a basic class that functions as the model representing a user of
// AKTVE.
// (TODO: Finish this class. Possibly add in methods that actually will pull
// data about the user from the server.)
class User {
    constructor(id, name, age, interests, tags, bio, images, matches, latitude, longitude, last_active) {
        // If no arguments were passed to this constructor, set the user up as
        // the default demo user
        if (arguments.length === 0) {
            this._id = 0;
            this._name = "Michelle";
            this._age = 63;
            this._interests = [new PersonalInterest("Hiking", 2), new PersonalInterest("Lifting", 4), new PersonalInterest("Skiing", 3)];
            this._tags = ["friends_men", "friends_women", "dates_men"];
            this._bio = "Just your average down to earth geeky girl!!!!! I love taking long walks on the beach, but I'm also really into video games! I also love drinking beer, and watching some good Seahawks football!!!!! #GoHawks";
            this._images = ["img/samples/sam1.jpg", "img/samples/sam2.jpg", "img/samples/sam3.jpg"];
            this._matches = [new Match(320, [null, 3], [new Message(4003, null, "Hey man!"), new Message(4293, 3, "Whatsup?")]), new Match(344, [null, 7], [])];
            this._latitude = 47.6062;
            this._longitude = -122.3321;
            this._last_active = new Date("3/4/2017");

            return;
        }

        this._id = id;
        this._name = name;
        this._age = age;
        this._interests = interests;
        this._tags = tags;
        this._bio = bio;
        this._images = images;
        this._matches = matches;
        this._latitude = latitude;
        this._longitude = longitude;
        this._last_active = last_active;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get age() {
        return this._age;
    }

    get interests() {
        return this._interests;
    }

    get tags() {
        return this._tags;
    }

    get bio() {
        return this._bio;
    }

    get images() {
        return this._images;
    }

    get matches() {
        return this._matches;
    }

    get latitude() {
        return this._latitude;
    }
    set latitude(latitude) {
        if (!isNaN(latitude)) {
            this._latitude = latitude;
        }
    }

    get longitude() {
        return this._longitude;
    }
    set longitude(longitude) {
        if (!isNaN(longitude)) {
            this._longitude = longitude;
        }
    }

    get last_active() {
        let todays_date = new Date();
        let time_diff = Math.abs(todays_date.getTime() - this._last_active.getTime());
        let days_diff = Math.ceil(time_diff / (1000 * 3600 * 24));

        let active_string = days_diff + " Day" + ((days_diff > 1) ? "s Ago" : " Ago");

        return active_string;
    }

    // Update() updates this User object from the server.
    // (TODO: Actually implement this function.)
    Update() {
        // (TODO: See above.)
    }
}
