const http = require("http");
const fs = require("fs");
const WebSocket = require("websocket").server;

console.log("Servidor em execução na porta 3000");

const server = http.createServer(function (req, res) {
  if (req.url === "/") {
    fs.readFile("index.html", function (err, data) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    });
  } else if (req.url === "/client.js") {
    fs.readFile("client.js", function (err, data) {
      res.writeHead(200, { "Content-Type": "text/javascript" });
      res.write(data);
      res.end();
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000);

const wsServer = new WebSocket({
  httpServer: server,
  autoAcceptConnections: true,
});

const connections = [];

wsServer.on("connect", function (connection) {
  connections.push(connection);

  connection.on("message", function (message) {
    connections.forEach(function (dest) {
      if (dest !== connection && dest.connected) {
        dest.sendUTF(message.utf8Data);
      }
    });
  });

  connection.on("close", function (reasonCode, description) {
    connections.splice(connections.indexOf(connection), 1);
  });
});
