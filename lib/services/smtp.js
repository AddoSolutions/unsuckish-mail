import BasicService from './basic-service';

export default class SmtpService extends BasicService{


	constructor(server){
		super(server);
	}

	start(callback){
		callback.resolve();
	}



}

SmtpService.register();