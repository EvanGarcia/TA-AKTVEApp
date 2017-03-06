// Match is a basic class that functions as the model representing a match
// between two users of AKTVE.
class Match {
    constructor(id, like_one, like_two, messages) {
        // If no arguments were passed to this constructor, set the object up as
        // the default
        if (arguments.length === 0) {
            this._id = 0;
            this._like_one = null;
            this._like_two = null;
            this._messages = [];

            return;
        }

        this._id = id;
        this._like_one = like_one;
        this._like_two = like_two;
        this._messages = messages;
    }

    get messages() {
        return this._messages;
    }

    addMessage(message) {
        this._messages.push(message);
    }
}
