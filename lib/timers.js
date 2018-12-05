// Fetch Homey
const Homey = require('homey');
const eventEmitter = require('events');
const timerEvents = new eventEmitter;

let timers = {};
let intervals = {};

/**
 * class Timers
 */
class Timers extends Homey.App {

    onInit() {
        this.log('Countdown timers is running...');
    }

    /**
     *
     * @param name
     * @returns {boolean}
     */
    static add(name) {
        if (!Timers.validateName(name)) {
            console.log('Invalid name, only use a-z and 0-9');
            return false;
        }

        // If it doesnt exists, make and return
        if (!Timers.exists(name)) {
            timers[name] = 0;
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
    static remove(name) {
        if (!Timers.exists(name)) {
            console.log(`Removing timer with name ${name}, but it doesn't exist!`);
        }

        // Fetch how long this timer had remaining
        let remaining = Timers.remaining(name);

        // Delete the timer
        delete timers[name];

        // Clear the countdown if its going
        Timers.clear(name);

        // Emit: timer.remove
        timerEvents.emit('timer.remove', {name: name, remaining: remaining});

        return true;
    }

    /**
     *
     * @param name
     * @returns {boolean}
     */
    static get(name) {
        return Timers.exists(name) ? timers[name] : false;
    }

    /**
     *
     * @param name
     * @returns {boolean}
     */
    static exists(name) {
        return name in timers;
    }


    /**
     *
     * @param name
     * @param time in seconds
     */
    static setTime(name, time) {

        // Exist check
        if (!Timers.exists(name)) {
            console.log(`setTime called but timer with name ${name} doesn't exist!`);
            return false;
        }

        //
        timers[name] = time;

        timerEvents.emit('timer.time-set', {name: name, time: time});

    }

    static start(name) {

        // Exist check
        if (!Timers.exists(name)) {
            console.log(`start called but timer with name ${name} doesn't exist!`);
            return false;
        }

        // Remove the previous countdown for this timer
        Timers.clear(name);

        // Fetch the remaining time
        let remaining = Timers.remaining(name);

        // Emit the countdown.started event
        timerEvents.emit('timer.started', {name: name, remaining: remaining});

        // Create a new interval
        intervals[name] = setInterval(() => {

            // Tick the timer, e.g. - 1 second
            Timers.tick(name);

            // Fetch the remaining time
            let remaining = Timers.remaining(name);

            // event: timer.tick
            timerEvents.emit('timer.tick', {name: name, remaining: remaining});

            // Timer done
            if (remaining <= 0) {

                // Clear and delete the interval
                Timers.clear(name);

                // event: countdown.finished
                timerEvents.emit('timer.finished', {name: name});
            }


            // Tick every second
        }, 1e3);

    }


    static isCounting(name) {

        // Exist check
        if (!Timers.exists(name)) {
            console.log(`isCounting called but timer with name ${name} doesn't exist!`);
        }

        return name in intervals;

    }

    static stopAll() {
        for (let name in timers) {
            if (timers.hasOwnProperty(name)) {
                Timers.setTime(name, 0);
            }

        }
    }

    static clear(name) {
        // Clear the interval and delete it from the holder
        clearInterval(intervals[name]);
        delete intervals[name];

    }

    /**
     *
     * @param name
     * @returns {*}
     * @private
     */
    static remaining(name) {
        return timers[name];
    }

    static tick(name) {
        timers[name]--;
        console.log(`Ticking ${name}, now remaining: ${Timers.remaining(name)} seconds`);
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
