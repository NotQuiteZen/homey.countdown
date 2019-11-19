// Fetch assert
const assert = require('assert');

// Fetch moch
const mock = require('mock-require');

// Fetch 'homey' ;)
const Homey = require('@milanzor/homey-mock');

// Mock homey
mock('homey', Homey);

// Fetch our timers
const {Timers, timerEvents} = require('../lib/timers');

describe('Timers', () => {

    it('must be instance-able', () => {
        let timerInstance = new Timers;
        assert.equal(typeof timerInstance, 'object');
    });

    it('must be an instance of Homey.App', () => {
        let timerInstance = new Timers;
        assert.equal(timerInstance instanceof Homey.App, true);
    });

    it('must be able to add a timer', () => {
        let addResult = Timers.add('testtimer');
        Timers.stopAll();
        assert.equal(addResult, true);
    });

    it('must be able to remove a timer', () => {
        Timers.add('testtimer');
        let removeResult = Timers.remove('testtimer');
        assert.equal(removeResult, true);
    });

    it('must allow a well formatted timername', () => {
        let validateResult = Timers.validateName('wellformattedname');
        assert.equal(validateResult, true);
    });

    it('must deny a malformed timername', () => {
        let validateResult = Timers.validateName('not\'allowed%^&*(characters');
        assert.equal(validateResult, false);
    });

    it('must be able to start a countdown', () => {
        Timers.add('startcountdown', 5);
        let startResult = Timers.start('startcountdown');
        Timers.stopAll();
        assert.equal(startResult, true);
    });

    it('must be able to see if a timer is running', () => {
        Timers.add('isitrunning', 5);
        Timers.start('isitrunning');
        let isCounting = Timers.isCounting('isitrunning');
        Timers.stopAll();
        assert.equal(isCounting, true);
    });

    it('must be able to detect when user starts a timer that has not properly been added', () => {
        let startResult = Timers.start('isitstartedwithoutbeingadded');
        assert.equal(startResult, false);
    });


    it('must be able to emit events', () => {
        // Fetch eventEmitter
        const eventEmitter = require('events');
        assert.equal(timerEvents instanceof eventEmitter, true);
    });

    it('must emit event timer.start', (done) => {

        Timers.stopAll();

        timerEvents.once('timer.start', function (data) {
            Timers.stopAll();
            assert.equal(data.name === 'eventteststart', true);
            done();
        });

        Timers.add('eventteststart', 1);
        Timers.start('eventteststart');
    });

    it('must emit event timer.empty', (done) => {

        Timers.stopAll();

        timerEvents.once('timer.empty', function (data) {
            Timers.stopAll();
            assert.equal(data.name === 'eventtesttimerempty', true);
            done();
        });

        Timers.add('eventtesttimerempty', 1);
        Timers.start('eventtesttimerempty');
    });

    it('must emit event timer.tick', (done) => {

        Timers.stopAll();

        timerEvents.once('timer.tick', function (data) {
            Timers.stopAll();
            assert.equal(data.name === 'eventtesttimetick', true);
            done();
        });

        Timers.add('eventtesttimetick', 1);
        Timers.start('eventtesttimetick');
    });

    it('must emit event timer.pause', (done) => {

        Timers.stopAll();

        timerEvents.once('timer.pause', function (data) {
            Timers.stopAll();
            assert.equal(data.name === 'testpausetimer', true);
            done();
        });

        Timers.add('testpausetimer', 15);
        Timers.start('testpausetimer');
        Timers.pause('testpausetimer');
    });


    it('must emit event timer.resume', (done) => {

        Timers.stopAll();

        timerEvents.once('timer.resume', function (data) {
            Timers.stopAll();
            assert.equal(data.name === 'testresumetimer', true);
            done();
        });

        Timers.add('testresumetimer', 15);
        Timers.start('testresumetimer');
        Timers.pause('testresumetimer');
        Timers.resume('testresumetimer');
    });

    it('must emit event timer.clear', (done) => {

        Timers.stopAll();

        timerEvents.once('timer.clear', function (data) {
            Timers.stopAll();
            assert.equal(data.name === 'eventtesttimeclear', true);
            done();
        });

        Timers.add('eventtesttimeclear', 1);
        Timers.clear('eventtesttimeclear');
    });


});

