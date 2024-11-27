import 'dotenv/config';
import http from 'http';
import { MongoClient } from 'mongodb';
import { getRequestBody } from './utilities.js';
import fs from 'fs/promises';

async function handleRequest(request, response) {
	let url = new URL(request.url, 'http://' + request.headers.host);
	let path = url.pathname;
	let pathSegments = path.split('/').filter(function (segment) {
		if (segment === '' || segment === '..') {
			return false;
		} else {
			return true;
		}
	});


	let nextSegment = pathSegments.shift();

	if (nextSegment === 'create-user') {
		if (request.method !== 'GET') {
			response.writeHead(405, { 'Content-Type': 'text/plain' });
			response.write('405 Method Not Allowed');
			response.end();
			return;
		}

		let template = (await fs.readFile('templates/create-profile-page.volvo')).toString();

		response.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });
		response.write(template);
		response.end();
		return;
	}

	if (nextSegment === 'profiles') {
		if (request.method !== 'POST') {
			response.writeHead(405, { 'Content-Type': 'text/plain' });
			response.write('405 Method Not Allowed');
			response.end();
			return;
		}

		let body = await getRequestBody(request);

		let params = new URLSearchParams(body);

		console.log(params);
	}
}

let server = http.createServer(handleRequest);

server.listen(process.env.PORT);

