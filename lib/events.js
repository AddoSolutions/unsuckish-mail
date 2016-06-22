import async from 'async';
import Q from 'Q';
import logger from './logger';

export default class Events{

	/**
	 * When you are ready to emit your event, you will create a new instance of Events
	 * @param event The name of the event you want to fire
	 */
	constructor(event){
		//this.promise = Promise.defer();

		this.event = event;
		this.promise = Q.defer();

	}

	/**
	 * Register your function to fire upon event getting fired
	 * @param event The name of the event to link to
	 * @param fn {Function} The function to fire, event data is the first argument and callback is on the second
	 */
	static on(event, fn){

		if(!this.events) this.events = {};
		if(!this.events[event]) this.events[event] = [];

		this.events[event].push(fn);

	}

	/**
	 * Fire off the child functions
	 * @param data The data to pass to the child functions
	 * @returns {Events}
	 */
	resolve(data){

		var promises = [];

		try {
			if (this.constructor.events[this.event]) this.constructor.events[this.event].forEach(function (fn) {
				if(!fn) return;
				if(fn.length < 2){
					fn(data);
				}else{
					var promise = Q.defer();
					fn(data, promise);
					promises.push(promise.promise);
				}
			});
		}catch(err){
			logger.catch(err);
			this.promise.reject(err);
		}

		Q.all(promises).then(function(){
			this.promise.resolve(data);
		}.bind(this)).catch(function(err){
			this.promise.reject(err);
		}.bind(this));

		return this;
	}

	/**
	 * Fires after ALL child functions have fired
	 * @param fn
	 * @returns {*|Promise|Promise.<T>}
	 */
	then(fn){
		this.promise.promise.then(fn);
		return this;
	}

	/**
	 * In the case of an error, this will fire
	 * @param fn
	 * @returns {*|Promise|Promise.<T>}
	 */
	catch(fn){
		this.promise.promise.catch(fn);
		return this;
	}

}