var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
	host:"localhost",
	port:9002,
	tls:{
		rejectUnauthorized : false
	},
	debug:true
});

// send mail with defined transport object
if(false) transporter.sendMail({
	from: 'Freddy Floo<freddy@bluridy.com>', // sender address
	to: 'nick@unsuck', // list of receivers
	subject:require("faker").random.words(5), // Subject line
	text: 'Hello world', // plaintext body
	html: require("faker").fake("<b>{{random.words(5)}}</b><p>{{random.words(100)}}</p>"), // html body
	debug:true
	//secure: false,
	//ignoreTLS: true,
	//requireTLS: false,
	/* attachments: [
	 {   // file on disk as an attachment
	 filename: 'sender.js',
	 path: 'sender.js' // stream this file
	 },
	 ] */
}, function(error, info){
	if(error){
		return console.log(error);
	}
	console.log('Message sent: ' + info.response);
});




// send mail with defined transport object
if(false) transporter.sendMail({
	from: 'Freddy Floo<freddy@bluridy.com>', // sender address
	to: 'nick@notmyserver.com', // list of receivers
	subject:require("faker").random.words(5), // Subject line
	text: 'Hello world', // plaintext body
	html: require("faker").fake("<b>{{random.words(5)}}</b><p>{{random.words(100)}}</p>"), // html body
	secure: false,
	ignoreTLS: true,
	requireTLS: false,
	/* attachments: [
	 {   // file on disk as an attachment
	 filename: 'sender.js',
	 path: 'sender.js' // stream this file
	 },
	 ] */
}, function(error, info){
	if(error){
		console.log('Message rejected: ' + info.response);
	}
	console.log(new Error("Forwarded email to account not on server"))
});


// send mail with defined transport object
if(false) nodemailer.createTransport({
	host: "localhost",
	port: 9002,
	//ignoreTLS: true,
	//requireTLS: false,
	auth: {
		user: 'abc',
		pass: 'def'
	},
	debug:true,
	logger:true,
	//secure: false,
	tls:{
		rejectUnauthorized : false
	},
}).sendMail({
	from: 'Nick Artman<nick.artman@wwin.adosolutions.com>', // sender address
	to: 'chef@ethode.com', // list of receivers
	subject:require("faker").random.words(5), // Subject line
	text: 'Hello world', // plaintext body
	html: require("faker").fake("<b>{{random.words(5)}}</b><p>{{random.words(100)}}</p>"), // html body

}, function(error, info){
	if(error){
		return console.log(error);
	}
	console.log('Message sent: ' + info.response);
});












// send mail with defined transport object
if(true) nodemailer.createTransport({
	host: "localhost",
	port: 9002,
	//ignoreTLS: true,
	//requireTLS: false,
	auth: {
		user: 'abc',
		pass: 'def'
	},
	//debug:true,
	//logger:true,
	//secure: false,
	tls:{
		rejectUnauthorized : false
	},
}).sendMail({
	from: 'Nick Artman<nick.artman@wwin.adosolutions.com>', // sender address
	to: 'chef@ethode.com, nick@ethode.com', // list of receivers
	subject:require("faker").random.words(5), // Subject line
	text: 'Hello world', // plaintext body
	html: require("faker").fake("<b>{{random.words(5)}}</b><p>{{random.words(100)}}</p>"), // html body

}, function(error, info){
	if(error){
		return console.log(error);
	}
	console.log('Message sent: ' + info.response);
});