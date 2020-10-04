const http = require("http");

const hostname = "localhost";
const port = 3000;

/**
 * set up the server
 */
const server = http.createServer((req, res) => {
  console.log(req.headers);

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<html><body><H1>hello world</h1></body></html>");
});

/**
 * start the server
 */
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
