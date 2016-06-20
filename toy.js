var SMTPServer = require('smtp-server').SMTPServer,
	fs = require("fs");


var mongoose = require('mongoose');

mongoose.connection.on('open', function (ref) {
	require('./sender.js');
});


mongoose.connect('mongodb://localhost/unsuck');

var Email = mongoose.model('Email', new mongoose.Schema({ subject: String }, { strict: false }));


var hostedDomains = [
	'addosolutions.com',
	//'wwin.addosolutions.com',
	'unsuck'
]

var users = [
	'nick@addosolutions.com',
	'nick@wwin.addosolutions.com',
	'nick@unsuck'
]

var server = new SMTPServer({
	//secure: false,
	//hideSTARTTLS: true,
	//allowInsecureAuth: true,
	//disabledCommands: ['AUTH'],
	key: fs.readFileSync('local/ssl/ca.key'),
	cert: fs.readFileSync('local/ssl/ca.crt'),
	onAuth: function(auth, session, callback){
		if(auth.username !== 'abc' || auth.password !== 'def'){
			return callback(new Error('Invalid username or password'));
		}
		callback(null, {user: 123}); // where 123 is the user id or similar property
	},
	onRcptTo: function(address, session, callback){
		console.log(address.address);
		session.to = require("email-addresses").parseOneAddress(address.address);
		session.isLocal = true;

		// @TODO: Make this Regex Comaptible
		if(hostedDomains.indexOf(session.to.domain)<0){
			session.isLocal = false;
			if(!session.user) {
				return callback(new Error('Relay access denied, no such domain'));
			}
		}

		// @TODO: Make this talk to users DB
		if(session.isLocal && users.indexOf(session.to.address)<0){
			return callback(new Error('Relay access denied, no such user'));
		}

		return callback(); // Accept the address
	},
	onData: function(stream, session, callback){

		if(session.isLocal) {

			var temp = "";

			var parser = new (require("mailparser").MailParser)();

			var toString = require('stream-to-string')
			toString(stream, function (err, msg) {
				console.log(msg);
				parser.write(msg);
				temp += msg;
			});


			parser.on("end", function (obj) {
				var save = obj;

				save.opened = {
					state: false,
					date: null
				};

				save.user =
					//"576172c1c1d939ba900c34c7";
					new mongoose.Types.ObjectId("576172c1c1d939ba900c34c7");

				//save.uid = 1;


				// @TODO: feature/multiple-folders Need to make this an array
				save.folder = '\\Inbox';
				save.flags = [];
				/* save.flags = [
				 '\\HasChildren',
				 '\\HasNoChildren',
				 '\\UnSeen'
				 ] */

				save.internaldate = new Date();

				if (save.attachments) {
					var attachments = save.attachments;
					save.attachments = [];
					attachments.forEach(function (attachment) {
						var info = {
							filename: attachment.fileName,
							filePath: "attachments/" + require('node-uuid').v4(),
							textContent: "",
							contentType: attachment.contentType,
							length: attachment.length
						};

						save.attachments.push(info);

						var fs = require('fs')
						fs.writeFile(info.filePath, attachment.content);
					});
				}

				save.date = undefined;
				save.priority = undefined;
				//save.messageId = undefined;
				save.opened = undefined;
				save.uid=randU32();
				//save.uid = "abcd";

				//Email.drop();

				var mail = new Email(save);


				mail.save();


				console.log(obj);


			});

			stream.on('end', function () {
				var err;

				if (stream.sizeExceeded) {
					err = new Error('Message exceeds fixed maximum message size');
					err.responseCode = 552;
					return callback(err);
				}

				parser.end();

				callback(null, 'Message queued as abcdef');
			});
		}else{


			var temp = "";
			var toString = require('stream-to-string')
			toString(stream, function (err, msg) {

				temp += msg;
			});



			stream.on('end', function () {

				//console.log(temp);
				console.log(session.to.address);

				return;

				var nodemailer = require('nodemailer');

				var transporter = nodemailer.createTransport({
					name: 'wwin.addosolutions.com',
					direct:true,
					//debug: true,
					//logger:true
				});

				transporter.sendMail({
					//raw: temp,
					to: "nick@ethode.com",
					from:"nick@wwin.addosolutions.com",
					//subject:"Test",
					//text:"Hello World",
					debug: true
				}, function (err) {

					if (err) {
						console.error(err);
						callback(err, 'Message queued as abcdef');
						return;
					}

					console.log("Message Sent Outbound");
					callback(null, 'Message queued as abcdef');
				})
			});


		}
	}
});

server.listen(9002);
server.listen(9003);



var crypto = require('crypto');
function randU32(strong) {
	var gen = (strong ? crypto.randomBytes : crypto.pseudoRandomBytes);
	return gen(4).readUInt32BE(0, true);
}
