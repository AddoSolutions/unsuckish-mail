import Events from '../events';
import Q from 'Q';
import logger from '../logger';

export default class BasicService{

	constructor(server){
		this.server = server;
		this.serviceName = this.constructor.name.toLowerCase();
		this.serviceName = this.serviceName.substring(0,this.serviceName.length-7);
		this.options = this.server.config.services[this.serviceName];
	}

	static register(){

		Events.on('init', function(server, deferred){

			console.log("Starting: " + this.name);
			//var deferred = Q.defer();
			new this(server).start(deferred);

		}.bind(this))
	}

	start(){

	}
}