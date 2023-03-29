'use strict';
const Client = require('pg/lib/client.js');

const penv = process.env;

const setCredentials = () => {
	let setCredentials = {};

    // console.log('process.env.DB_MODE', process.env.DB_MODE)
    // console.log('process.env', process.env)

	switch (process.env.DB_MODE) {
		case 'dev':
			setCredentials = {
				user: process.env.PGD_USER,
				host: process.env.PGD_HOST,
				database: process.env.PGD_DB,
				password: process.env.PGD_PASSWORD,
				port: process.env.PGD_PORT,
                ssl: {
					rejectUnauthorized: false
				}
			};
			break;
		case 'prod':
			setCredentials = {
				user: process.env.PGD_USER,
				host: process.env.PGD_HOST,
				database: process.env.PGD_DB,
				password: process.env.PGD_PASSWORD,
				port: process.env.PGD_PORT,
                ssl: {
					rejectUnauthorized: false
				}
			};
			break;
		default:
			setCredentials = {
				user: '',
				host: '',
				database: '',
				password: '',
				port: 5432,
                ssl: {
					rejectUnauthorized: false
				}
			};
			break;
	}
    // console.log(setCredentials)
	return setCredentials;
};

let client = new Client(setCredentials());
// console.log('client', client)

const validateEmail = (email) => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;
	return regex.test(email)
};

const submitNewsletter = async (body) => {
    if (validateEmail(body.formFields.email)) {
        const validatedEmail = body.formFields.email.toLowerCase()
        console.log('validatedEmail: ', validatedEmail)
		await client.connect();
		await client.query('INSERT into newsletter (email, create_date) values ($1, now())', [ validatedEmail ]);
	}
};

const submitHire = async (body) => {
    // console.log('body.formFields.email', body.formFields.email)
	const validatedEmail = validateEmail(body.formFields.email);
    // console.log('validatedEmail', validatedEmail)

	if (validatedEmail) {
		await client.connect();
		await client.query(
			'INSERT into hire ' +
				'(firstname, lastname, email, phone, linkedin_url, job_description, create_date) ' +
				'values ($1, $2, $3, $4, $5, $6, now())',
			[
				body.formFields.firstname,
				body.formFields.lastname,
				validatedEmail[0],
				body.formFields.phone,
				body.formFields.linkedin_url,
				body.formFields.job_description
			]
		);
	}
};

const submitApply = async (body) => {
	const validatedEmail = validateEmail(body.formFields.email);

	if (validatedEmail) {
		let skills = JSON.parse(JSON.stringify(body.formFields));

		delete skills.firstname;
		delete skills.lastname;
		delete skills.phone;
		delete skills.email;
		delete skills.linkedin_url;
		delete skills.fullname;
		delete skills.segment_id;

		await client.connect();
		await client.query(
			'INSERT into apply ' +
				'(firstname, lastname, email, phone, linkedin_url, skills, create_date) ' +
				'values ($1, $2, $3, $4, $5, $6, now())',
			[
				body.formFields.firstname,
				body.formFields.lastname,
				validatedEmail[0],
				body.formFields.phone,
				body.formFields.linkedin_url,
				skills
			]
		);
	}
};

const submitContact = async (body) => {
	const validatedEmail = validateEmail(body.formFields.email);

	if (validatedEmail) {
		await client.connect();
		await client.query(
			'INSERT into contact ' +
				'(fullname, email, phone, website, msg, genquery, email_marketing, search_engine_optimization, payperclick, webdevelopment, freeauditrequest, social_media_marketing, reporting, web_design, create_date) ' +
				'values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, now())',
			[
				body.formFields.fullname,
				validatedEmail[0],
				body.formFields.phone,
				body.formFields.website,
				body.formFields.message,
				body.formFields.genquery,
				body.formFields.email_marketing,
				body.formFields.search_engine_optimization,
				body.formFields.payperclick,
				body.formFields.webdevelopment,
				body.formFields.freeauditrequest,
				body.formFields.social_media_marketing,
				body.formFields.reporting,
				body.formFields.web_design
			]
		);
	}
};

const submitPromotion = async (body) => {
	const validatedEmail = validateEmail(body.formFields.email);
	// console.log(body);
	if (validatedEmail) {
		await client.connect();
		await client.query(
			'INSERT into promotion ' +
				'(fullname, email, phone, website, msg, genquery, payperclick, webdevelopment, shopify, wordpress, analytics, search_engine_optimization, email_marketing, ecommerce, create_date) ' +
				'values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, now())',
			[
				body.formFields.fullname,
				validatedEmail[0],
				body.formFields.phone,
				body.formFields.website,
				body.formFields.message,
				body.formFields.genquery,
				body.formFields.payperclick,
				body.formFields.webdevelopment,
				body.formFields.shopify,
				body.formFields.wordpress,
				body.formFields.analytics,
				body.formFields.search_engine_optimization,
				body.formFields.email_marketing,
				body.formFields.ecommerce
			]
		);
	}
};

module.exports.handler = async (event, context) => {
	context.callbackWaitsForEmptyEventLoop = false;
	const body = JSON.parse(event.body);

    // console.log(body)

	let statusCd = 400;
	let bdy = 'invalid';

	try {
		switch (body.formName) {
			case 'newsletter':
				await submitNewsletter(body);
				statusCd = 200;
				break;
			case 'hire':
				await submitHire(body);
				statusCd = 200;
				break;
			case 'contact':
				await submitContact(body);
				statusCd = 200;
				break;
			case 'apply':
				await submitApply(body);
				statusCd = 200;
				break;
			case 'promotion':
				await submitPromotion(body);
				statusCd = 200;
				break;
			default:
				bdy = 'invalid formName';
				console.log('invalid formName: ' + body.formName);
		}
		bdy = (statusCd = 200) ? 'success' : bdy;
	} catch (error) {
		console.log({ error });
		statusCd = 400;
	} finally {
		await client.end();
		client = null;
	}

	return {
		statusCode: statusCd,
		body: bdy
	};
};
