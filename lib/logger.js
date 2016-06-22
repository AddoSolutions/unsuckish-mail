export default class Logger{

	/**
	 *
	 * @returns {Console|*} The logger configured for use
	 * @private
	 */
	static _getLogger(){
		return console;
	}

	/**
	 * Normal log of data
	 * @param data
	 */
	static log(data){
		this._getLogger().log(data);
	}

	/**
	 * Log error message
	 * @param data
	 */
	static error(data){
		this._getLogger().error(data);
	}

	/**
	 * Easy function to catch errors
	 * @param err
	 */
	static catch(err){
		if(err && err.message == "!Ignore!") return;
		try {
			Logger.error(err.stack);
		}catch(err){
			Logger.error(err);
			Logger.error("Error Located in Logger File!");
		}
	}


}