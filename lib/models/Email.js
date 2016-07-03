import BasicModel from './basic-model';
import {MailParser} from 'mailparser';
import stripTags from 'striptags';
import mailcomposer from 'mailcomposer';
import extend from 'extend';
import fs from 'fs';
import uuid from 'node-uuid';

export default class Email extends BasicModel{


	static init(db, dataService){
		super.ini(db, dataService);

		// Ensure attachments path exists
		if (!fs.existsSync(this._getAttachmentsPath())){
			fs.mkdirSync(this._getAttachmentsPath());
		}
	}

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

			if(rawObject.attachments){
				var originalAttachments = rawObject.attachments;
				rawObject.attachments = [];
				originalAttachments.forEach((attachment) => {
					var attach = {
						contentType: attachment['contentType'],
						fileId: uuid.v4(),
						fileName: attachment['fileName'],
						contentId: attachment['contentId'],
						transferEncoding: attachment['transferEncoding'],
						length: attachment['length'],
						generatedFileName: attachment['generatedFileName'],
						checksum: attachment['checksum']
					};

					fs.writeFile(this.constructor._getAttachmentsPath() + "/" + attach.fileId, attachment.content);

					rawObject.attachments.push(attach);
				});

			}


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

	static _getAttachmentsConfig(){
		return this.dataService.server.config.attachments;
	}

	static _getAttachmentsPath(){
		if(this.dataService){
			return this.dataService.server.config.attachments.path;
		}else{
			return "local/attachments";
		}
	}

	toRawEmail(cb){

		var data = extend({}, this);

		if(data.attachments){
			var originalAttachments = data.attachments;
			data.attachments = [];
			originalAttachments.forEach((attachment) => {
				var attach = {
					filename: attachment['fileName'],
					cid: attachment['contentId'],
					path: this.constructor._getAttachmentsPath() + "/" + attachment.fileId,
					encoding: attachment['transferEncoding'],
					contentType: attachment['contentType'],
					contentTransferEncoding: attachment['transferEncoding']
				};

				data.attachments.push(attach);
			});
		}

		var mail = mailcomposer(data);
		mail.build(cb);


	}

}