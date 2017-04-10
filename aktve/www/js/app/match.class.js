// Match is a basic class that functions as the model representing a match
// between two users of AKTVE.
class Match {
    constructor(id, participants, messages) {
        // If no arguments were passed to this constructor, set the object up as
        // the default
        if (arguments.length === 0) {
            this._id = 0;
            this._participants = [];
            this._messages = [];

            return;
        }

        this._id = id;
        this._participants = participants;
        this._messages = messages;
    }

    get id() {
        return this._id;
    }

    get participants() {
        return this._participants;
    }

    get messages() {
        return this._messages;
    }

    addMessage(message) {
        this._messages.push(message);
    }
}
