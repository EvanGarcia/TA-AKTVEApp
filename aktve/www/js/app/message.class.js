// Match is a basic class that functions as the model representing a message
// between two matched users of AKTVE.
class Message {
    constructor(id, author_id, message, date, read) {
        // If no arguments were passed to this constructor, set the object up as
        // the default
        if (arguments.length === 0) {
            this._id = 0;
            this._author_id = 0;
            this._message = "A blank message (not really).";
            this._date = new Date();
            this._read = false;

            return;
        }

        this._id = id;
        this._author_id = author_id;
        this._message = message;
        this._date = date;
        this._read = read;
    }

    get id() {
        return id;
    }

    get author() {
        return this._author_id;
    }

    get message() {
        return this._message;
    }
    set message(message) {
        this._message = message;
    }

    get date() {
        let date = (this._date.getMonth() + 1) + "/" + this._date.getDate() + "/" + this._date.getFullYear() + " @ " + this._date.getHours() + ":" + this._date.getMinutes();

        return date;
    }

    get read() {
        return this._read;
    }
    set read(state) {
        this._read = state;
    }
}
