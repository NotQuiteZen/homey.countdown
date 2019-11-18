// Fetch Homey
// noinspection NpmUsedModulesInstalled
const Homey = require('homey');

// Fetch and instance an eventEmitter
const eventEmitter = require('events');
const timerEvents = new eventEmitter();

// Register triggers
// TODO MOVE TRIGGERS TO THE FILE
// Holds all timers
let timers = {};

// Holds all tick intervals
let intervals = {};

// Holds all timers
let led_timer_name = '';
let led_start_time = 0;

let cards = [];

// ledring stuff below
let frames = [];
let frame = [];

// Set every pixel off
for (let pixelIndex = 0; pixelIndex < 24; pixelIndex++) {
    let colors = {
        r: 0,
        g: 0,
        b: 0
    };
    frame.push(colors);
}
frames.push(frame);

let LedringAnimate = new Homey.LedringAnimation({
    options: {
        fps: 1,     // real frames per second
        tfps: 60,     // target frames per second. this means that every frame will be interpolated 60 times
        rpm: 30,    // rotations per minute
    },
    frames: frames,
    priority: 'FEEDBACK',
});
LedringAnimate.register();

/**
 * class Timers
 */
class Timers extends Homey.App {

    // noinspection JSUnusedGlobalSymbols
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

        // timer.pause
        timerEvents.on('timer.pause', (data) => {
            this.log(`event: timer.pause => ${data.name}, ${data.remaining}`);
        });

        // timer.resume
        timerEvents.on('timer.resume', (data) => {
            this.log(`event: timer.resume => ${data.name}, ${data.remaining}`);
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
            return false;
        }

        // Add or overwrite it
        timers[name] = time ? time : -1;

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

        // Set new time
        timers[name] = time;    
        
        timerEvents.emit('timer.time-set', {name: name, time: time});

        return true;
    }

    /**
     *
     * @param name
     */
    static startLedring(name) {

        led_timer_name = Timers.normalizeName(name);

        // Exist check
        if (!Timers.exists(led_timer_name)) {
            return false;
        }

        // Fetch how long this timer had remaining
        led_start_time = Timers.remaining(led_timer_name);

        if (led_start_time > 0) {
            // Set every pixel to green
            frames = [];
            frame = [];
            for (let pixelIndex = 0; pixelIndex < 24; pixelIndex++) {
                let colors = {
                    r: 0,
                    g: 255,
                    b: 0
                };
                frame.push(colors);
            }
            frames.push(frame);
            LedringAnimate.updateFrames(frames);
            LedringAnimate.start();

            return true;
        }

        return false;
    }

    static updateLedring() {

        // Exist check
        if (!Timers.exists(led_timer_name)) {
            return false;
        }

        // Fetch how long this timer had remaining
        let led_remaining_time = Timers.remaining(led_timer_name);

        if (led_remaining_time > 0) {
            let factor = (led_remaining_time / led_start_time);

            let pixelsToLit = Math.floor(24 * factor);

            // for every pixel...
            frames = [];
            frame = [];
            for (let pixelIndex = 0; pixelIndex < 24; pixelIndex++) {

                let amount_green = Math.floor(255 * factor);

                // Default this pixel to off
                let colors = {
                    r: 0,
                    g: 0,
                    b: 0
                };

                // If pixel needs to be lit, calculate the color
                if (pixelIndex < pixelsToLit) {
                    colors = {
                        r: (255 - amount_green),
                        g: amount_green,
                        b: 0
                    };
                }
                frame.push(colors);
            }
            frames.push(frame);
            LedringAnimate.updateFrames(frames);

            return true;
        } else {
            Timers.stopLedring();
        }

        return false;
    }

    /**
     *
     */
    static stopLedring() {

        led_timer_name = '';
        led_start_time = 0;
        LedringAnimate.stop();

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
            return false;
        }

        // Remove the previous countdown for this timer
        Timers.clear(name);

        // Fetch the remaining time
        let remaining = Timers.remaining(name);

        // Event: timer.start
        timerEvents.emit('timer.start', {name: name, remaining: remaining});

        if (led_timer_name === name) {
            Timers.startLedring(name);
        }

        Timers._startInterval(name);

        return true;
    }

    static _startInterval(name) {

        // Create a new interval
        intervals[name] = setInterval(() => {

            // Tick the timer, e.g. - 1 second
            Timers.tick(name);

            // Fetch the remaining time
            let remaining = Timers.remaining(name);

            // Event: timer.tick
            timerEvents.emit('timer.tick', {name: name, remaining: remaining});

            // Update ledring
            if (led_timer_name === name) {
                Timers.updateLedring();
            }

            // Timer done
            if (remaining == 0 || isNaN(remaining)) {

                // Clear and delete the interval
                Timers.clear(name);

                // Event: timer.empty
                timerEvents.emit('timer.empty', {name: name});
            }


            // Tick every second
        }, 1e3);
    }

    /**
     * Pause a timer
     *
     * @param name
     * @returns {boolean}
     */
    static pause(name) {

        name = Timers.normalizeName(name);

        // Exist check and counting check
        if (!Timers.exists(name) || !Timers.isCounting(name)) {
            return false;
        }

        // Clear the interval, this way it stops counting
        clearInterval(intervals[name]);
        delete intervals[name];

        timerEvents.emit('timer.pause', {name: name, remaining: Timers.remaining(name)});

        return true;

    }
    
    /**
     * Resume a timer
     *
     * @param name
     * @returns {boolean}
     */
    static resume(name) {

        name = Timers.normalizeName(name);

        // Exist, counting and remaining check
        if (!Timers.exists(name) || Timers.isCounting(name) || Timers.remaining(name) <= 0) {
            return false;
        }

        Timers._startInterval(name);

        timerEvents.emit('timer.resume', {name: name, remaining: Timers.remaining(name)});

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
     * @returns {boolean}
     */
    static stopAll() {
        for (let name in timers) {
            if (timers.hasOwnProperty(name)) {
                Timers.setTime(name, -1);
            }
        }

        return true;
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
        if (timers[name] > -1) {
            timers[name]--;   
        } else {
            Timers.clear(name);
        }
    }


    /**
     *
     * @param name
     * @returns {boolean}
     */
    static validateName(name) {
        name = Timers.normalizeName(name);

        return /^[a-zA-Z0-9 _-]+$/.test(name);
        //return /^[\w-]+$/.test(name);
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
                    if (name && typeof name === 'string') {
                        let seconds = 'seconds' in timer ? timer.seconds : -1;
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

    static getAllTimers() {
        return timers;
    }
}


// Export
module.exports = {
    Timers: Timers,
    timerEvents: timerEvents
};
