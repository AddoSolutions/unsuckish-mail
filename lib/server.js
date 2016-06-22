'use strict';

import deepExtend from 'deep-extend';
import requireGlob from 'require-glob';
import Q from 'Q';
import Events from './events.js';
import logger from './logger';

export default class Server{

	constructor(config){
		this.config = deepExtend(require("./default-config.json"), config);
		this.options = this.config;
	}

	start(){
		Q.all([
			requireGlob('./models/*.js'),
			requireGlob('./services/*.js')
		]).then(function(){

			var events = new Events('init');
			console.log("Launching Application Services");
			events.resolve(this).then(function(){
				console.log("Application Launched Successfully");
			});
		}.bind(this)).catch(logger.catch)
	}

}