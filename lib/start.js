require('babel-register');

var Server = require("./server").default;

var server = new Server(require("../local/config.json"));

server.start();