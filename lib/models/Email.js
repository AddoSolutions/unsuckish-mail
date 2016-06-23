import BasicModel from './basic-model';
import {MailParser} from 'mailparser';
import stripTags from 'striptags';
import mailcomposer from 'mailcomposer';
import extend from 'extend';

export default class Email extends BasicModel{

	/**
	 * @param raw {String, Stream} The RFC-2822 encoded message
	 * @param cb {Function} The callback method upon completion
 	 * @returns {Email} A new email object populated with data from the raw message
	 */
	static fromRawEmail(raw, cb){
		var email = new this();
		return email._fromRawEmail(raw, cb);
	}

	/**
	 * Populates this email object with the contents of the raw message
	 * @param raw {String, Stream} The raw message to add to this object
	 * @param cb {Function} The callback method upon completion
	 * @returns {Email} Itself
	 * @private
	 */
	_fromRawEmail(raw, cb){

		if(!raw) throw new Error("You cannot pass an empty message!");

		var mailparser = new MailParser({});


		// setup an event listener when the parsing finishes
		mailparser.on("end", (rawObject) => {

			if(!rawObject.html && !rawObject.text){
				rawObject.html = '<i>This message has no body</i>';
			}

			if(!rawObject.text) rawObject.text = rawObject.html;
			if(!rawObject.html){
				rawObject.html = rawObject.text.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2');
			}
			rawObject.text = stripTags(rawObject.text);



			for(var index in rawObject){
				this[index] = rawObject[index];
			}

			cb(null, this);

		});

		mailparser.on("exception", (rawObject) => {
			cb(rawObject);
		});

		if(typeof raw == "string"){
			mailparser.end();
			mailparser.write(raw);
		}else{
			raw.pipe(mailparser);
		}




		return this;
	}

	toRawEmail(cb){

		var data = extend({}, this);


		var mail = mailcomposer(data);
		mail.build(cb);


	}

}