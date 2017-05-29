// User is a basic class that functions as the model representing a user of
// AKTVE.
// (TODO: Finish this class. Possibly add in methods that actually will pull
// data about the user from the server.)

class User {
    constructor(id, name, age, interests, tags, bio, images, matches, latitude, longitude, last_active) {
        // If no arguments were passed to this constructor, set the user up as
        // the default demo user

        //Need to pass in Facebook Arguments
        if (arguments.length === 0) {

            console.log(APIUserToken);

            $.ajax({
                type: 'GET',
                url: 'https://api.aktve-app.com/me?token=' + APIUserToken, //Change to actual facebook token
                dataType: 'json',
                context: this, // Make the callback function's `this` variable point to this User object
                success: function (data) {
                    console.log(data);
                    MyId = data.Data.id;
                    this._id = data.Data.id;
                    this._name = data.Data.name;

                    this._age = data.Data.age;

                    this._latitude = "";       //data.Data.user.latitude;
                    this._longitude = "";     //data.Data.user.longitude;
                    this._last_active = new Date(data.Data.last_active);

                    this._bio = "";    //data.Data.user.bio;

                    //var interestsArray = [];
                    //$.each(data.Data, function (key, value) {
                    //    $.each(value.interests, function (k, v) {
                    //        interestsArray.push(new PersonalInterest(k, v));
                    //    });
                    //});

                    this._interests = []; //interestsArray;


                    //var tagsArray = [];
                    //$.each(data.Data, function (key, value) {
                    //    $.each(value.tags, function (k, v) {
                    //        tagsArray.push(v);
                    //    });
                    //});

                    this._tags = []; //tagsArray;


                    var imagesArray = [];
                    $.each(data.Data, function (key, value) {
                        $.each(value.images, function (k, v) {
                            imagesArray.push(v);
                        });
                    });

                    this._images = imagesArray;

                }

            });

          
            //this._id = 0;
            //this._name = "Michelle";
            //this._age = 63;
            //this._interests = [new PersonalInterest("Hiking", 2), new PersonalInterest("Lifting", 4), new PersonalInterest("Skiing", 3)];
            //this._tags = ["friends_men", "friends_women", "dates_men"];
            //this._bio = "Just your average down to earth geeky girl!!!!! I love taking long walks on the beach, but I'm also really into video games! I also love drinking beer, and watching some good Seahawks football!!!!! #GoHawks";
            //this._images = [];
            //this._matches = [new Match(320, [null, 1], [new Message(4003, null, "Hey man!", new Date(), false), new Message(4293, 1, "Whatsup?", new Date(), false)]), new Match(344, [null, 2], [])];
            //this._latitude = 47.6062;
            //this._longitude = -122.3321;
            //this._last_active = new Date("3/4/2017");

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
        this._last_active = new Date(last_active);
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
        console.log(this._last_active);
        let time_diff = Math.abs(todays_date.getTime() - this._last_active.getTime());
        let days_diff = Math.ceil(time_diff / (1000 * 3600 * 24));

        let active_string = days_diff + " Day" + ((days_diff > 1) ? "s Ago" : " Ago");

        return active_string;
    }

    // Update() updates this User object from the server.
    Update() {

        
        //API call on Cached Users' info

        $.ajax({
            type: 'GET',
            url: 'https://api.aktve-app.com/users/' + this._id  + '?token=' + APIUserToken, //Change to actual facebook token
            dataType: 'json',
            context: this, // Make the callback function's `this` variable point to this User object

            success: function (data) {
                console.log(data);
                this._id = data.Data.user.id;
                this._name = data.Data.user.name;
                this._age = data.Data.user.age;
                this._latitude = data.Data.user.latitude;
                this._longitude = data.Data.user.longitude;
                this._last_active = new Date(data.Data.user.last_active);

                this._bio = data.Data.user.bio;

                var interestsArray = [];
                $.each(data.Data , function(key , value){ 
                    $.each(value.interests , function(k , v ){  
                        interestsArray.push(new PersonalInterest(k, v));
                    });        
                });

                this._interests = interestsArray;


                var tagsArray = [];
                $.each(data.Data, function (key, value) { 
                    $.each(value.tags, function (k, v) {  
                        tagsArray.push(v);
                    });
                });

                this._tags = tagsArray;
                

                var imagesArray = [];
                $.each(data.Data, function (key, value) { 
                    $.each(value.images, function (k, v) {  
                        imagesArray.push(v);
                    });
                });

                this._images = imagesArray;





            }

        });

        

    }
}
