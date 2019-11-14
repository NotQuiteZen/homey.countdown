The Countdown timers app for Athom's Homey provides hourglass-like timer cards in your Flows.

Version log

1.2.7

  - Added flowcards to pause / resume timers
  - Bugfix: Timers are now directly available in autocomplete cards after adding
  - Bugfix: Manually stopping a timer will not trigger the "timer is empty" trigger

1.2.5

  - Added app settingspage to start / edit / pause / resume / stop timers and give an overview of timers

1.2.3

  - Fixed a few bugs that would let the app crash


1.2.1

  - Added ledring-support, make a timer visible using the ledring

1.2.0

  - Restructured most of the code to make more sense and is more future-proof
  - Fixes some triggers not properly triggering 
  - Adds autocomplete to certain Flow cards
      - **WARNING: Old Flow cards will still work for now, but have been marked as deprecated and will be removed in a future version. Please change your Flows to use the new autocomplete cards.**


Flowcards:

Triggers

- A specific timer has started
- A specific timer has stopped
- A timer started
- A timer stopped

Conditions

- A specific timer is active / inactive
    
Actions

- Start / update a timer
- Pause a timer
- Resume a timer
- Stop a timer
- Stop all timers


Development

Want to help? Awesome!
Just make a fork, clone it and start contributing.
We use Husky for a pre-commit Unit Test hook, so make sure to run `npm install` after your `git clone` so all depencies get installed and set. Need help? Scroll down to the `Contact` part of this readme.

Roadmap

 - Write MORE tests
 - Mock Homey npm module
 - Add adding or substracting a fixed or random number of seconds
 - Ability to pause a timer
 
Contact

Have a question or a bug report? Please file an issue on the Github repo. 
You can also hit us up on Athom's Slack community at @jeroenbos22 or @milanzor, see you there!

Acknowledgement

The Countdown timers app is inspired by the original CountDown timer app by Ralf van Dooren. 