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
  {
    method : 'POST',
    path   : '/pause_timer/',
    fn     : async (args, callback) => {
      try {
        
        let timerName = args.body.timername;
        
        // Remove a timer
        if (Timers.pause_resume(timerName)) {
          return callback(null, true);
        }

        return callback(null, false);
      } catch(err) {
        return callback(err);
      }
    }
  },
  {
    method : 'POST',
    path   : '/update_timer/',
    fn     : async (args, callback) => {
      try {
        
        let timerName = args.body.timername;
        let timerSeconds = args.body.seconds;
        
        // Add a new timer
        if (Timers.add(timerName) && Timers.setTime(timerName, timerSeconds) && Timers.start(timerName)) {
          return callback(null, true);
        }

        return callback(null, false);
      } catch(err) {
        return callback(err);
      }
    }
  },
];