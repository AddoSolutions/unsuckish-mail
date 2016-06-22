import BasicService from './basic-service';
import mongo from 'mongodb';
import logger from '../logger';
import requireGlob from 'require-glob';

export default class DataService extends BasicService{


	constructor(server){
		super(server);
	}

	start(callback){

		var self = this;

		mongo.connect(this.options.connection, function(err, db) {
			if(err){
				throw err;
			}
			console.log("Connected to Database Server");

			self.db = db;


			requireGlob('./models/*.js').then(function(models){


				Object.keys(models).forEach(function(model){
					if(!model.startsWith("Basic") && models[model].default) {
						models[model].default.init(db, self);
					}
				});

				callback.resolve();

			}).catch(logger.catch)

			db.close();
		});

	}

}

DataService.register();