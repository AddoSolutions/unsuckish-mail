import BasicService from './basic-service';

export default class ImapService extends BasicService{


	constructor(server){
		super(server);
	}

	start(callback){
		callback.resolve();
	}

}

ImapService.register();