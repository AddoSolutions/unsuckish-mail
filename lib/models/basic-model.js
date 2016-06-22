export default class BasicModel{

	static init(db, dataService){
		this.dataService = dataService;
		this.collection = db.collection(this.getCollectionName());
	}

	static getCollectionName(){
		return this.dataService.options.collections[this.name.toLowerCase()] || this.name.toLowerCase();
	}

	static find(a,b,c){
		return this.collection.find(a,b,c);
	}

	getId(){
		return this._id;
	}

	save(callback){
		this.collection.update({
			"_id": this.getId()
		},{
			$set:this
		},{
			upsert:true
		}, function(err, result){
			if(callback) callback(err, result);
		});
	}

	delete(callback){
		this.collection.deleteOne({
			"_id": this.getId()
		}
		, function(err, result){
			if(callback) callback(err, result);
		});

	}

}