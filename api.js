const {Timers, timerEvents} = require('./lib/timers');

module.exports = [
  {
    method : 'GET',
    path   : '/timers/',
    fn     : async (args, callback) => {
      try {
        return callback(null, Timers.getAllTimers());
      } catch(err) {
        return callback(err);
      }
    }
  },
];