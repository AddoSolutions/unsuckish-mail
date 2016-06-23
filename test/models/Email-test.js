/* eslint no-unused-expressions:0 */
/* globals describe, it */

'use strict';

import chai from 'chai';
import Email from '../../lib/models/Email';
import streamToString from 'stream-to-string'
import through from 'through';

var expect = chai.expect;

chai.config.includeStack = true;

var emailExamples = [];

describe('Email Parsing', function () {


	var theBasics = function(str, done){

		Email.fromRawEmail(str,(err, email) => {
			try {

				expect(email.from[0].address).to.equal("sender@example.com");
				expect(email.from[0].name).to.equal("sender name");

				expect(email.to[0].address).to.equal("receiver@example.com");
				expect(email.to[0].name).to.equal("Receiver name");

				expect(email.subject).to.equal("hello 4");

				expect(email.date.getTime()).to.equal(new Date("Fri, 13 Sep 2013 15:01:00 +0300").getTime());

				expect(email.text).to.equal("World 4!");
				expect(email.html).to.equal("<p>World 4!</p>");

			}catch(e){
				done(e);
				return;
			}

			done();

		});

	}

	it('should do the basics with a string', (done) => {

		theBasics(emailExamples[0], done);

	});

	it('should do the basics with a stream', (done) => {

		var stream = through();

		theBasics(stream, done);

		stream.write(emailExamples[0]);
		stream.end();

	});

	it('should parse attachments', (done) => {


		Email.fromRawEmail(emailExamples[1],(err, email) => {
			try {
				expect(err).to.not.exist;
				expect(email.attachments[0].contentType).to.equal("text/plain");

			}catch(e){
				done(e);
				return;
			}

			done();

		});
	})

	it('handle nobodies!', (done) => {


		Email.fromRawEmail(emailExamples[2],(err, email) => {
			try {
				expect(err).to.not.exist;
				expect(email.subject).to.equal("Nobody! Ha");
				expect(email.text.length).to.be.at.least(5);
				expect(email.html.length).to.be.at.least(5);

			}catch(e){
				done(e);
				return;
			}

			done();

		});
	})

	it('should handle plain text emails', (done) => {


		Email.fromRawEmail(emailExamples[3],(err, email) => {

			try {
				expect(err).to.not.exist;
				expect(email.html).to.contain("<br");

			}catch(e){
				done(e);
				return;
			}

			done();

		});
	});

	it('should make a simple email', (done) => {

		var email = new Email();

		email.subject = "Simple Message";

		email.toRawEmail(function(err, message){
			try{
				message = message.toString();
				expect(err).to.not.exist;
				expect(message).to.contain("Subject: Simple Message");
			}catch(e){
				done(e);
				return;
			}
			done();
		})

	});

	it('should go to and from an email', (done) => {

		Email.fromRawEmail(emailExamples[0], (err, email) => {

			email.toRawEmail(function(err, message){
				try {
					message = message.toString();
					expect(err).to.not.exist;
					expect(message).to.contain("Subject: hello 4");
					expect(message).to.contain("To: Receiver name <receiver@example.com>");
					expect(message).to.contain("From: sender name <sender@example.com>");
					expect(message).to.contain("Date: Fri, 13 Sep 2013 12:01:00 +0000");
				}catch(e){
					done(e);
					return;
				}

				done();
			});

		});


	});



})

emailExamples.push(`From: sender name <sender@example.com>
To: Receiver name <receiver@example.com>
Subject: hello 4
Message-Id: <abcde>
Date: Fri, 13 Sep 2013 15:01:00 +0300
Content-Type: text/html

<p>World 4!</p>`);




emailExamples.push(`Content-Type: multipart/mixed;
	boundary="--=b73b47c7-75f9-4775-93eb-475a43310901"


----=b73b47c7-75f9-4775-93eb-475a43310901
Content-Type: multipart/alternative;
	boundary="--=4d3d5f03-fd7a-40f2-ab55-6bd2de649863"

----=4d3d5f03-fd7a-40f2-ab55-6bd2de649863
Content-Type: text/plain
Content-Transfer-Encoding: 7bit


This e-mail message has been scanned for Viruses and Content and cleared

----=4d3d5f03-fd7a-40f2-ab55-6bd2de649863
Content-Type: text/html
Content-Transfer-Encoding: quoted-printable

<HTML><HEAD>
</HEAD><BODY>=20

<HR>
This e-mail message has been scanned for Viruses and Content and cleared
<HR>
</BODY></HTML>

----=4d3d5f03-fd7a-40f2-ab55-6bd2de649863
Content-Type: text/plain; name="hello.txt"
Content-Disposition: attachment; filename="hello.txt"
X-Attachment-Id: 955cceb604f12b23_0.1
Content-ID: <955cceb604f12b23_0.1>

Test

----=4d3d5f03-fd7a-40f2-ab55-6bd2de649863--`);


emailExamples.push(`Subject: Nobody! Ha`);

emailExamples.push(`From: sender name <sender@example.com>
To: Receiver name <receiver@example.com>
Subject: hello 4
Message-Id: <abcde>
Date: Fri, 13 Sep 2013 15:01:00 +0300
Content-Type: text/plain

Multiple
Lines`);