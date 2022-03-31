const {createServer} = require("http");
const methods = Object.create(null);
createServer((request, response) => {				//creates the server
	let handler = methods[request.method] || notAllowed;			//handles http requests
	handler(request).catch(error => {
		if (error.status != null) return error;				//returns if there is an error
		return {body: String(error), status: 500};				//returns error status
	}).then(({body, status = 200, type = "text/plain"}) => {		//specifies a good status and body type
		response.writeHead(status, {"Content-Type": type});
		if (body && body.pipe) body.pipe(response);
		else response.end(body);
	});
}).listen(8000);							//server is located on localhost port 8000
console.log("running on port 8000");

async function notAllowed(request) {			//if a request is not allowed
return {
status: 405,
body: `Method ${request.method} not allowed.`			//returns error status and message
};
}

const {parse} = require("url");
const {resolve, sep} = require("path");
const baseDirectory = process.cwd();				//sets the basedirectory to the current working directory
function urlPath(url) {							//parses the url
	let {pathname} = parse(url);
	let path = resolve(decodeURIComponent(pathname).slice(1));
	if (path != baseDirectory && !path.startsWith(baseDirectory + sep)) {		//if the url is outside of the current working directory, it is not allowed access
		throw {status: 403, body: "Forbidden"};					//throws a bad status and forbidden message
	}
	return path;				//returns the url path
}


const {createReadStream} = require("fs");
const {stat, readdir} = require("fs").promises;
const mime = require("mime");
//GET METHOD-----------------------------------------
methods.GET = async function(request) {
	let path = urlPath(request.url);			//translate the url into a file name
	let stats;						// invoke stat object called stats
	try {				// wait for stat to find the file
		stats = await stat(path);
	} catch (error) {						// handle a non-existent file name
		if (error.code != "ENOENT") throw error;
		else return {status: 404, body: "File not found"};			//error if file doesnt exist
	}
	if (stats.isDirectory()) {					//if the name is a directory then it returns the directory contents
		return {body: (await readdir(path)).join("\n")};
	} else {
		return {body: createReadStream(path),		//allows the body of the file to be read
		type: mime.getType(path)};
	}
};


//DELETE METHOD -------------------------------------
const {rmdir, unlink} = require("fs").promises;
methods.DELETE = async function(request) {
	let path = urlPath(request.url);			// translate the url into a file name
	let stats;   			// invoke stat object called stats
	try {					// wait for stat to find the file
		stats = await stat(path);
	} catch (error) {				// handle a non-existent file name
		if (error.code != "ENOENT") throw error;
		else return {status: 204};
	}
	if (stats.isDirectory()) await rmdir(path);				// if the file name is a directory, remove it
	else await unlink(path);					// if the file name is not a directory, remove it
	return {status: 204};			// report that the file deletion was successful
};


//PUT METHOD -----------------------------------------
methods.PUT = async function(request) {
	let path = urlPath(request.url);				// translate the url into a file name
	await pipeStream(request, createWriteStream(path));		//allows the file to be written to
	return {status: 204};
};
const {createWriteStream} = require("fs");
function pipeStream(from, to) {						//creates a pipestream to the file
	return new Promise((resolve, reject) => {
		from.on("error", reject);
		to.on("error", reject);
		to.on("finish", resolve);
		from.pipe(to);
	});
}


const { mkdir } = require('fs').promises;
const { existsSync } = require('fs');
//MKCOL METHOD -----------------------------------------
methods.MKCOL = async function(request) {
	let path = urlPath(request.url);				// translate the url into a path name
	if (existsSync(path)) return { status: 409, body: `${path} already exists.` };			//returns if the path already exists
	try {
	  await mkdir(path);			//creates the directory with the specified path name
	  return { status: 204 };
	} catch (error) {			//catches any error
	  throw error;
	}
  };