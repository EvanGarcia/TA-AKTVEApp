// User is a basic class that functions as the model representing a user of
// AKTVE.
// (TODO: Finish this class. Possibly add in methods that actually will pull
// data about the user from the server.)
class User {
    constructor(name, age, interests, bio, latitude, longitude, last_active, is_me) {
        // If no arguments were passed to this constructor, set the user up as
        // the default demo user
        if (arguments.length === 0) {
            this._name = "Michelle";
            this._age = 63;
            this._interests = [new PersonalInterest("Hiking", 2.5), new PersonalInterest("Lifting", 2.5), new PersonalInterest("Skiing", 2.5)];
            this._bio = "Just your average down to earth geeky girl!!!!! I love taking long walks on the beach, but I'm also really into video games! I also love drinking beer, and watching some good Seahawks football!!!!! #GoHawks";
            this._latitude = 19.8968;
            this._longitude = 155.5828;
            this._last_active = new Date("3/4/2017");
            this._is_me = false;

            return;
        }

        this._name = name;
        this._age = age;
        this._interests = interests;
        this._bio = bio;
        this._latitude = latitude;
        this._longitude = longitude;
        this._last_active = last_active;
        this._is_me = is_me;
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

    get bio() {
        return this._bio;
    }

    get latitude() {
        return this._latitude;
    }

    get longitude() {
        return this._longitude;
    }

    get last_active() {
        let todays_date = new Date();
        let time_diff = Math.abs(todays_date.getTime() - this._last_active.getTime());
        let days_diff = Math.ceil(time_diff / (1000 * 3600 * 24));

        let active_string = days_diff + " Day" + ((days_diff > 1) ? "s Ago" : " Ago");

        return active_string;
    }

    get is_me() {
        return this._is_me;
    }
    set is_me(value) {
        if (value === true || value === false) {
            this._is_me = value;
        }
    }
}
