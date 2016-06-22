/* eslint no-unused-expressions:0 */
/* globals describe, it */

'use strict';

import chai from 'chai';
import Events from '../lib/events';

var expect = chai.expect;

chai.config.includeStack = true;

function fireEvent(eventName){
	var event = new Events(eventName);
	return event.resolve();
}

var testNumber = 0;

describe('Events API', function () {


	it('should use on() methods', (done) => {
		testNumber++;

		Events.on('test' + testNumber, function(data){
			done();

		});

		fireEvent('test' + testNumber);

	});


	it('should fire then()', (done) => {
		testNumber++;
		var fired = false;

		Events.on('test' + testNumber, function(){
			fired = true;
		});

		fireEvent('test' + testNumber).then(() => {
			try{
				expect(fired).to.equal(true);
			}catch(err){
				done(err);
			}

			done();
		});

	});


	it('should allow for callbacks before then()', (done) => {
		testNumber++;
		var fired = false;

		Events.on('test' + testNumber, function(data, cb){
			try{
				expect(cb).to.exist;
			}catch(err){
				done(err);
				throw err;
			}
			cb.resolve();
			fired = true;
		});

		fireEvent('test' + testNumber).then(() => {
			try{
				expect(fired).to.equal(true);
			}catch(err){
				done(err);
				return;
			}

			done();
		});

	});


	it('should catch exceptions', (done) => {
		testNumber++;
		var fired = false;

		Events.on('test' + testNumber, function(){
			fired = true;
			throw new Error("!Ignore!");
		});

		fireEvent('test' + testNumber).catch((err) => {
			try{
				expect(fired).to.equal(true);
				expect(err).to.exist;
			}catch(err){
				done(err);
				return;
			}
			done();
		});

	});
});