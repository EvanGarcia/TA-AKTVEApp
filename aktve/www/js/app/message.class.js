// Match is a basic class that functions as the model representing a message
// between two matched users of AKTVE.
class Message {
    constructor(id, author_id, message) {
        // If no arguments were passed to this constructor, set the object up as
        // the default
        if (arguments.length === 0) {
            this._id = 0;
            this._author_id = 0;
            this._message = "A blank message (not really).";

            return;
        }

        this._id = id;
        this._author_id = author_id;
        this._message = message;
    }

    get message() {
        return this._message;
    }
    set message(message) {
        this._message = message;
    }
}
