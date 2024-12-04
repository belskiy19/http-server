import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logRequest = (method: string, url: string) => {
	console.log(`${new Date().toISOString()} - ${method} ${url}`);
};

const server = http.createServer();
let requestCount = 0;

server.on("request", (req, res) => {
	logRequest(req.method ?? "", req.url ?? "");
	requestCount++;

	// Handle GET request to /status
	if (req.method === "GET" && req.url === "/status") {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		const serverStatus = {
			serverTime: new Date().toISOString(),
			requestCount,
		};
		res.end(JSON.stringify(serverStatus));
		return;
	}

	// Handle POST request to /data
	if (req.method === "POST" && req.url === "/data") {
		let data = "";
		req.on("data", (chunk) => (data += chunk));
		req.on("end", () => {
			try {
				const parsedData = JSON.parse(data);
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.end(
					JSON.stringify({
						message: "Data received",
						data: parsedData,
					})
				);
			} catch (e) {
				res.statusCode = 400;
				res.end("Invalid JSON");
				return;
			}
		});
	}

	// Serve static files and handle 404
	let filePath = path.resolve(
		__dirname,
		`../public/${req.url == "/" ? "index.html" : req.url}`
	);

	fs.readFile(filePath, (err, data) => {
		if (err) {
			if (err.code == "ENOENT") {
				res.statusCode = 404;
				res.end("404 Not Found");
			} else {
				res.statusCode = 500;
				res.end("Internal Server Error");
			}
			return;
		}
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/html");
		res.end(data);
	});
});

server.listen(3000, () => {
	console.log("Server is running on http://localhost:3000");
});
