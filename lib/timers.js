// Fetch Homey
const Homey = require('homey');

/**
 * class Timers
 */
class Timers extends Homey.App {

    /**
     *
     */
    constructor() {
        super();
        this._timers = {};
        this._intervals = {};
    }

    /**
     *
     * @param name
     * @returns {boolean}
     */
    add(name) {
        if (!Timers.validateName(name)) {
            console.log('Invalid name, only use a-z and 0-9');
            return false;
        }

        // If it doesnt exists, make and return
        if (!this.exists(name)) {
            this._timers[name] = 0;
            return true;
        }

        // It already existed, so we return true with a console msg
        console.log(`Adding timer with name ${name}, but it already exists!`);
        return true;
    }

    /**
     *
     * @param name
     */
    remove(name) {
        if (!this.exists(name)) {
            console.log(`Removing timer with name ${name}, but it doesn't exist!`);
        }

        // Delete the timer
        delete this._timers[name];

        // Clear the interval if its going
        this._clearCountdown(name);

        return true;
    }

    /**
     *
     * @param name
     * @returns {boolean}
     */
    get(name) {
        return this.exists(name) ? this._timers[name] : false;
    }

    /**
     *
     * @param name
     * @returns {boolean}
     */
    exists(name) {
        return name in this._timers;
    }


    /**
     *
     * @param name
     * @param time in seconds
     */
    setTime(name, time) {

        // Exist check
        if (!this.exists(name)) {
            console.log(`setTime called but timer with name ${name} doesn't exist!`);
            return false;
        }

        this._timers[name] = time;

        this._startCountdown(name);
    }

    _startCountdown(name) {

        // Exist check
        if (!this.exists(name)) {
            console.log(`startCountdown called but timer with name ${name} doesn't exist!`);
            return false;
        }

        // Remove the previous countdown for this timer
        this._clearCountdown(name);

        // Emit the countdown.started event
        this.emit('countdown.started', {timer: name});

        // Create a new interval
        this._intervals[name] = setInterval(() => {

            // Tick the timer, e.g. - 1 second
            this._tick(name);

            // Fetch the remaining time
            let remaining = this._remaining(name);

            // event: countdown.remaining
            this.emit('countdown.remaining', {timer: name, remaining: remaining});

            if (remaining === 0) {


                // Clear and delete the interval
                this._clearCountdown(name);

                // event: countdown.finished
                this.emit('countdown.finished', {timer: name});
            }


            // Every second
        }, 1e3);

    }

    isCounting(name) {

        // Exist check
        if (!this.exists(name)) {
            console.log(`isCounting called but timer with name ${name} doesn't exist!`);
            return null;
        }

        return name in this._intervals;

    }

    stopAll() {
        for (let name in this._timers) {
            if (this._timers.hasOwnProperty(name)) {
                this.setTime(name, 0);
            }
        }
        return true;
    }

    _clearCountdown(name) {
        // Clear the interval and delete it from the holder
        clearInterval(this._intervals[name]);
        delete this._intervals[name];

    }

    /**
     *
     * @param name
     * @returns {*}
     * @private
     */
    _remaining(name) {
        return this._timers[name];
    }

    _tick(name) {
        this._timers[name]--;
    }


    /**
     *
     * @param name
     * @returns {boolean}
     */
    static validateName(name) {
        return /^[a-zA-Z0-9 ]+$/.test(name);
    }
}


// Export an instanced Timers object
module.exports = Timers;
