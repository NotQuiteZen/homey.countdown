// Fetch Homey
// noinspection NpmUsedModulesInstalled
const Homey = require('homey');

// Fetch and instance an eventEmitter
const eventEmitter = require('events');
const timerEvents = new eventEmitter;

// Register triggers
const triggerCountdownStopped = require('./triggers/countdown_stopped');
const triggerSpecificCountdownStopped = require('./triggers/specific_countdown_stopped');
const triggerSpecificCountdownStarted = require('./triggers/specific_countdown_started');

// Holds all timers
let timers = {};

// Holds all tick intervals
let intervals = {};

/**
 * class Timers
 */
class Timers extends Homey.App {

    onInit() {
        this.log('Countdown timers is running...');

        // Connect the Timers class to Homey's triggers through timerEvents

        // timer.start
        timerEvents.on('timer.start', (data) => {
            this.log(`event: timer.start => ${data.name}, ${data.remaining}`);
            let triggerTokens = {name: data.name};
            triggerSpecificCountdownStarted.trigger(triggerTokens);
        });

        // timer.empty
        timerEvents.on('timer.empty', (data) => {
            this.log(`event: timer.empty => ${data.name}`);
            let triggerTokens = {name: data.name};
            triggerCountdownStopped.trigger(triggerTokens);
            triggerSpecificCountdownStopped.trigger({}, triggerTokens);
        });

        timerEvents.on('timer.tick', (data) => {
            this.log(`event: timer.tick => ${data.name}, ${data.remaining}`);
        });

        timerEvents.on('timer.remove', (data) => {
            this.log(`event: timer.remove => ${data.name}, ${data.remaining}`);
        });
    }

    /**
     *
     * @param name
     * @param time
     * @returns {boolean}
     */
    static add(name, time) {
        if (!Timers.validateName(name)) {
            this.log('Invalid name, only use a-z and 0-9');
            return false;
        }

        // Add or overwrite it
        timers[name] = time ? time : 0;

        return true;
    }

    /**
     *
     * @param name
     */
    static remove(name) {

        if (!Timers.exists(name)) {
            return false;
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
            this.log(`setTime called but timer with name ${name} doesn't exist!`);
            return false;
        }

        //
        timers[name] = time;

        timerEvents.emit('timer.time-set', {name: name, time: time});

    }

    static start(name) {

        // Exist check
        if (!Timers.exists(name)) {
            this.log(`start called but timer with name ${name} doesn't exist!`);
            return false;
        }

        // Remove the previous countdown for this timer
        Timers.clear(name);

        // Fetch the remaining time
        let remaining = Timers.remaining(name);

        // Event: timer.start
        timerEvents.emit('timer.start', {name: name, remaining: remaining});

        // Create a new interval
        intervals[name] = setInterval(() => {

            // Tick the timer, e.g. - 1 second
            Timers.tick(name);

            // Fetch the remaining time
            let remaining = Timers.remaining(name);

            // Event: timer.tick
            timerEvents.emit('timer.tick', {name: name, remaining: remaining});

            // Timer done
            if (remaining <= 0) {

                // Clear and delete the interval
                Timers.clear(name);

                // Event: timer.empty
                timerEvents.emit('timer.empty', {name: name});
            }


            // Tick every second
        }, 1e3);

    }


    static names() {
        return Object.keys(timers);
    }

    static isCounting(name) {

        // Exist check
        if (!Timers.exists(name)) {
            this.log(`isCounting called but timer with name ${name} doesn't exist!`);
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

        timerEvents.emit('timer.clear', {name: name});

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


// Export the Timers class and the events
module.exports = {Timers, timerEvents};

// # TODO SOME CODE FOR AUTOCOMPLETE, WILL USE LATER
//
// let fetchTimers = (err, values) => {
//     if (!err) {
//         values.map((timer) => {
//             let name = 'name' in timer ? timer.name : false;
//             if (name) {
//                 let seconds = 'seconds' in timer ? timer.seconds : 0;
//                 Timers.add(name, seconds);
//             }
//         });
//     }
//     return Promise.resolve(true);
// };
//
// triggerSpecificCountdownStopped.getArgumentValues(fetchTimers);
// triggerSpecificCountdownStarted.getArgumentValues(fetchTimers);
// actionCountdownStop.getArgumentValues(fetchTimers);
// actionCountdownStopAll.getArgumentValues(fetchTimers);
// actionCountdownUpdate.getArgumentValues(fetchTimers);
// conditionActive.getArgumentValues(fetchTimers);
// triggerCountdownStopped.getArgumentValues(fetchTimers);
