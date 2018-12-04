// Fetch Homey
const Homey = require('homey');
const timerEvents = require('events');

let timers = {};
let intervals = {};

/**
 * class Timers
 */
class Timers extends Homey.App {

    onInit() {
        this._timers = {};
        this._intervals = {};

        this.log('Countdown timers is running...');
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

        // Fetch how long this timer had remaining
        let remaining = this._remaining(name);

        // Delete the timer
        delete this._timers[name];

        // Clear the countdown if its going
        this._clearCountdown(name);

        // Emit: timer.remove
        timerEvents.emit('timer.remove', {name: name, remaining: remaining});

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

        //
        this._timers[name] = time;

        timerEvents.emit('timer.time-set', {name: name, time: time});

    }

    start(name) {

        // Exist check
        if (!this.exists(name)) {
            console.log(`start called but timer with name ${name} doesn't exist!`);
            return false;
        }

        // Remove the previous countdown for this timer
        this._clearCountdown(name);

        // Fetch the remaining time
        let remaining = this._remaining(name);

        // Emit the countdown.started event
        timerEvents.emit('timer.countdown-started', {name: name, remaining: remaining});

        // Create a new interval
        this._intervals[name] = setInterval(() => {

            // Tick the timer, e.g. - 1 second
            this._tick(name);

            // Fetch the remaining time
            let remaining = this._remaining(name);

            // event: timer.tick
            timerEvents.emit('timer.tick', {name: name, remaining: remaining});

            // Timer done
            if (remaining <= 0) {

                // Clear and delete the interval
                this._clearCountdown(name);

                // event: countdown.finished
                timerEvents.emit('timer.finished', {name: name});
            }


            // Tick every second
        }, 1e3);

    }


    isCounting(name) {

        // Exist check
        if (!this.exists(name)) {
            console.log(`isCounting called but timer with name ${name} doesn't exist!`);
        }

        return name in this._intervals;

    }

    stopAll() {
        for (let name in this._timers) {
            if (this._timers.hasOwnProperty(name)) {
                this.setTime(name, 0);
            }

        }
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


// Export
module.exports = {timerEvents: timerEvents, Timers: Timers};
