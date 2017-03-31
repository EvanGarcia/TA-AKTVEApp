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

        if (this._users[id_as_string] == null) {
            // (TODO: See above. Retrieve user from server and cache them.)
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
        for (key in this._users) {
          this._users[key].Update();
        }
    }
}
