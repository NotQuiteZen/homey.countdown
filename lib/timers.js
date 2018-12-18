// Fetch Homey
// noinspection NpmUsedModulesInstalled
const Homey = require('homey');

// Fetch and instance an eventEmitter
const eventEmitter = require('events');
const timerEvents = new eventEmitter;

// Register triggers
// TODO MOVE TRIGGERS TO THE FILE
// Holds all timers
let timers = {};

// Holds all tick intervals
let intervals = {};


let cards = [];

/**
 * class Timers
 */
class Timers extends Homey.App {

    onInit() {

        this.log(`All systems up, let's go!`);

        // Event logging

        // timer.start
        timerEvents.on('timer.start', (data) => {
            this.log(`event: timer.start => ${data.name}, ${data.remaining}`);
        });

        // timer.empty
        timerEvents.on('timer.empty', (data) => {
            this.log(`event: timer.empty => ${data.name}`);
        });

        // timer.tick
        timerEvents.on('timer.tick', (data) => {
            this.log(`event: timer.tick => ${data.name}, ${data.remaining}`);
        });

        // timer.time-set
        timerEvents.on('timer.time-set', (data) => {
            this.log(`event: timer.time-set => ${data.name}, ${data.time}`);
        });

        // timer.clear
        timerEvents.on('timer.clear', (data) => {
            this.log(`event: timer.clear => ${data.name}`);
        });

        // timer.remove
        timerEvents.on('timer.remove', (data) => {
            this.log(`event: timer.remove => ${data.name}, ${data.remaining}`);
        });

        Timers.reAddTimers();
    }

    /**
     *
     * @param flowCards
     */
    static setCards(flowCards) {
        cards = flowCards;
    }

    /**
     *
     * @param name
     * @param time
     * @returns {boolean}
     */
    static add(name, time) {

        name = Timers.normalizeName(name);

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

        name = Timers.normalizeName(name);

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

        name = Timers.normalizeName(name);

        return name in timers;
    }


    /**
     *
     * @param name
     * @param time in seconds
     */
    static setTime(name, time) {

        name = Timers.normalizeName(name);

        // Exist check
        if (!Timers.exists(name)) {
            return false;
        }

        //
        timers[name] = time;

        timerEvents.emit('timer.time-set', {name: name, time: time});

        return true;
    }

    /**
     *
     * @param name
     * @returns {boolean}
     */
    static start(name) {

        name = Timers.normalizeName(name);

        // Exist check
        if (!Timers.exists(name)) {
            this.log(`Start called but timer with name ${name} doesn't exist!`);
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
            if (remaining <= 0 || isNaN(remaining)) {

                // Clear and delete the interval
                Timers.clear(name);

                // Event: timer.empty
                timerEvents.emit('timer.empty', {name: name});
            }


            // Tick every second
        }, 1e3);

        return true;
    }

    /**
     *
     * @returns {string[]}
     */
    static names() {
        return Object.keys(timers);
    }

    /**
     *
     * @param name
     * @returns {boolean}
     */
    static isCounting(name) {
        return intervals.hasOwnProperty(Timers.normalizeName(name));
    }

    /**
     *
     * @param name
     * @returns {*}
     */
    static normalizeName(name) {
        if (!name) {
            return name;
        }
        return name.trim().toLowerCase();
    }

    /**
     *
     */
    static stopAll() {
        for (let name in timers) {
            if (timers.hasOwnProperty(name)) {
                Timers.clear(name);
                Timers.setTime(name, 0);
            }

        }
    }

    /**
     *
     * @param name
     */
    static clear(name) {

        name = Timers.normalizeName(name);

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
        name = Timers.normalizeName(name);
        return timers[name];
    }

    /**
     *
     * @param name
     */
    static tick(name) {
        name = Timers.normalizeName(name);
        timers[name]--;
    }


    /**
     *
     * @param name
     * @returns {boolean}
     */
    static validateName(name) {
        name = Timers.normalizeName(name);

        return /^[a-zA-Z0-9 ]+$/.test(name);
    }

    /**
     *
     */
    static reAddTimers() {
        cards.forEach(function (card) {
            card.getArgumentValues(Timers.addFlowTimers);
        });
    }

    /**
     *
     * @param err
     * @param values
     * @returns {Promise<boolean>}
     */
    static addFlowTimers(err, values) {
        if (!err) {
            values.forEach((timer) => {
                if (timer) {
                    let name = 'name' in timer && timer.hasOwnProperty('name') ? timer.name : false;
                    if (name) {
                        let seconds = 'seconds' in timer ? timer.seconds : 0;
                        Timers.add(name, seconds);
                    }
                }
            });
        }
        return Promise.resolve(true);
    }

    /**
     *
     * @param query
     * @param args
     * @returns {Promise<Array>}
     */
    static autocomplete(query, args) {

        let timerNames = Timers.names();
        let autoCompleteResult = [];

        timerNames.map(function (timerName) {
            if (!query) {
                autoCompleteResult.push({name: timerName});
            } else {
                if (timerName.toLowerCase().includes(query.toLowerCase())) {
                    autoCompleteResult.push({name: timerName});
                }
            }
        });

        return Promise.resolve(autoCompleteResult);
    }
}


// Export
module.exports = {
    Timers: Timers,
    timerEvents: timerEvents
};
