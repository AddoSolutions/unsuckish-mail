var IMAPServer = require('imapseagull'),
	AppStorage = require('./imap-storage.js'),
	fs = require('fs'),
	path = require('path');

var NAME = 'unsuck';

var storage = new AppStorage({
	name: NAME,
	debug: true,

	// directory to keep attachments from emails
	attachments_path: path.join(__dirname, './'),

	// connection string for mongo
	connection: 'mongodb://localhost:27017/unsuck',

	// collections names
	messages: 'emails',
	users: 'users'
});

process.on('uncaughtException', function (err) {
	console.error(err.stack);
});

// function 'init' specified into AppStorage to provide availability to redefine it
storage.init(function(err) {
	if (err) throw new Error(err);

	var imapServer = IMAPServer({

		// Instead of imap-handler (https://github.com/andris9/imap-handler) you can choose
		// wo-imap-handler (https://github.com/whiteout-io/imap-handler) or anything you want with same API
		imapHandler: require('imap-handler'),

		debug: true,
		plugins: [
			// List of plugins. It can be string for modules from lib//plugins/*.js or functions, that will be
			// initialized as plugin_fn(<IMAPServer object>)
			'ID', 'STARTTLS', 'AUTH-PLAIN', 'SPECIAL-USE', 'NAMESPACE', 'IDLE', /*'LOGINDISABLED',*/
			'SASL-IR', 'ENABLE', 'LITERALPLUS', 'UNSELECT', 'CONDSTORE'
		],
		id: {
			name: NAME,
			version: '1'
		},

		credentials: {
			// just for example
			key: fs.readFileSync('local/ssl/ca.key'),
			cert: fs.readFileSync('local/ssl/ca.crt')
		},
		//secureConnection: true,
		storage: storage,
		folders: {
			'INBOX': { // Inbox folder may be only here
				'special-use': '\\Inbox',
				type: 'personal'
			},
			'': {
				folders: {
					'Drafts': {
						'special-use': '\\Drafts', // 'special-use' feature is in core of our IMAP implementation
						type: 'personal'
					},
					'Sent': {
						'special-use': '\\Sent',
						type: 'personal'
					},
					'Junk': {
						'special-use': '\\Junk',
						type: 'personal'
					},
					'Trash': {
						'special-use': '\\Trash',
						type: 'personal'
					}
				}
			}
		}
	});

	imapServer.on('close', function() {
		console.log('IMAP server %s closed', NAME);
	});


	imapServer.on('open', function() {
		console.log('IMAP connection opened', NAME);
	});

	imapServer.listen(9143, function() {
		console.log('IMAP server %s started', NAME);
	});

});