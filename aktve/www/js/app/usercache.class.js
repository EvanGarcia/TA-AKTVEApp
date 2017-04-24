// UserCache is a class responsible for caching User's locally on the device so
// that the app doesn't have to constantly hit the server. It should be updated
// at a (relatively) slow interval.
class UserCache {
    // If no arguments were passed to this constructor, an empty user cache is
    // set up.
    constructor(users) {
        if (arguments.length === 0) {
            this._users = {};
        }

        this._users = {};
    }

    // RetrieveUser(id) first checks the cache for the User with the given ID
    // and returns them if they are found. Otherwise, it attempts to download
    // the User from the server and then return them.
    // (TODO: Actually download Users that aren't found from the server and
    // store them in the cache.)
    RetrieveUser(id) {
        let id_as_string = id.toString();

        //If the passed in user id is not already in the cache, create a User object and put them in the cache
        if (this._users[id_as_string] == null) {

            $.ajax({
                type: 'GET',
                url: 'https://api.aktve-app.com/users/' + id_as_string + '?token=' + APITestToken, //Change to actual facebook token
                dataType: 'json',
                context: this, // Make the callaback function's `this` variable point to this User object
                success: function (data) {
                    console.log(data);
                    
                    var interestsArray = [];
                    $.each(data.Data, function (key, value) { 
                        $.each(value.interests, function (k, v) {  
                            interestsArray.push(new PersonalInterest(k, v));
                        });
                    });

                    var tagsArray = [];
                    $.each(data.Data, function (key, value) { 
                        $.each(value.tags, function (k, v) {  
                            tagsArray.push(v);
                        });
                    });

                    


                    var imagesArray = [];
                    $.each(data.Data, function (key, value) { 
                        $.each(value.images, function (k, v) {  
                            imagesArray.push(v);
                        });
                    });

                    


                    //Add New User to Cache
                    this._users[id_as_string] = new User(data.Data.user.id, data.Data.user.name, data.Data.user.age, interestsArray, tagsArray, data.Data.user.bio, imagesArray, [], data.Data.user.latitude, data.Data.user.longitude, data.Data.user.last_active );
                    


                }

            });
        }

        return this._users[id_as_string];
    }

    // AddUser(user) adds the provided User object to the cache of Users.
    AddUser(user) {
        this._users[user.id.toString()] = user;
    }

    // UpdateCache() attempts to update all of the users in the cache from the
    // server.
    // (NOTE: This can be a very heavy task and should not be done at a regular
    // interval.)
    Update() {
        for (var key in this._users) {
            
            this._users[key].Update();
        }
    }
}
