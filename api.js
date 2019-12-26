const {Timers, timerEvents} = require('./lib/timers');

module.exports = [
    {
        method: 'GET',
        path: '/timers/',
        fn: async (args, callback) => {
            try {
                return callback(null, Timers.getAllTimers());
            } catch (err) {
                return callback(err);
            }
        }
    },
    {
        method: 'POST',
        path: '/toggle_timer/',
        fn: async (args, callback) => {
            try {
                let timerName = args.body.timername;

                // If counting
                if (Timers.isCounting(timerName)) {

                    // Pause it
                    if (Timers.pause(timerName)) {
                        return callback(null, true);
                    }
                } else {

                    // Not counting, start it
                    if (Timers.resume(timerName)) {
                        return callback(null, true);
                    }
                }

                return callback(null, false);
            } catch (err) {
                return callback(err);
            }
        }
    },
    {
        method: 'POST',
        path: '/pause_timer/',
        fn: async (args, callback) => {
            try {
                let timerName = args.body.timername;

                // If counting
                if (Timers.isCounting(timerName)) {
                    // Pause it
                    if (Timers.pause(timerName)) {
                        return callback(null, true);
                    }
                }

                return callback(null, false);
            } catch (err) {
                return callback(err);
            }
        }
    },
    {
        method: 'POST',
        path: '/resume_timer/',
        fn: async (args, callback) => {
            try {
                let timerName = args.body.timername;

                // If counting
                if (!Timers.isCounting(timerName)) {
                    // Not counting, start it
                    if (Timers.resume(timerName)) {
                        return callback(null, true);
                    }
                }

                return callback(null, false);
            } catch (err) {
                return callback(err);
            }
        }
    },
    {
        method: 'POST',
        path: '/update_timer/',
        fn: async (args, callback) => {
            try {

                let timerName = args.body.timername;
                let timerSeconds = args.body.seconds;

                if (!Timers.validateName(timerName)) {
                    return callback('Invalid timername, use: a-z, 0-9, space, min or underscore');
                }

                // Add a new timer
                if (Timers.add(timerName) && Timers.setTime(timerName, timerSeconds) && Timers.start(timerName)) {
                    return callback(null, true);
                }

                return callback('Someting went wrong when adding the timer');
            } catch (err) {
                return callback(err);
            }
        }
    },
];
