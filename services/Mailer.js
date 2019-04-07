// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const 
    sgMail = require('@sendgrid/mail'),
    Email = require('email-templates'),
    path = require('path'),
    Promise = require("bluebird"),
    previewEmail = require('preview-email'); //to preview templates 

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
		sendMail(mailObject) {
			const { email, username, templateName, link} = mailObject;
			
			return new Promise((resolve, reject) => {
				this.loadTemplate(templateName, {username, link}).then((result) => {
					const {subject, html, text} = result;
	
					let msg = {
						to: email,
						from: 'Promote&Pay <support@promoteandpay.com>',
						subject: subject,
						text: text,
						html: html
					};
	
					// console.log("IT CAME",msg);
					sgMail.send(msg, (err, res) => {
						if(err) {
							console.log("ERROR using sendgrid", err.message)
							return reject(err)
						} else {
							console.log("IT worked")
							return resolve(res)
						}
					});

				})
				.catch((e) => {
					console.log("Couldnt load email template", e.message)
				})

			});
		},
		loadTemplate (templateName, context) {
			const dir = path.resolve(__dirname, "emailTemplates", templateName );
			
			const email = new Email({
				views: {
					options: {
                        extension: 'ejs' // <---- HERE
					}
				  }
			});

			return new Promise((resolve, reject) => {
				email.renderAll(dir, {    
					username: context.username,
					link: context.link
				}).then((template) => {
				  // previewEmail(template).then(console.log).catch(console.error);  Helps preview email in browser
				  resolve(template)
				})
				.catch((err) => {
                    console.log(err.message)
                    reject(err)
				});
			})
		}	 
}