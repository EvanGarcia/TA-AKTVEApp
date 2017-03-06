// PersonalInterest is a basic class that functions as the model representing an
// interest of a user of AKTVE.
class PersonalInterest {
    constructor(name, experience) {
        // If no arguments were passed to this constructor, set the object up as
        // the default
        if (arguments.length === 0) {
            this._name = "Using AKTVE";
            this._experience = 2.5;

            return;
        }

        this._name = name;
        this._experience = experience;
    }

    get name() {
        return this._name;
    }

    get experience() {
        return this._experience;
    }
}
