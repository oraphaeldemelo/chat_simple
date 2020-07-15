const express = require('express');
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const socket = require("./socketConnect");

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);

app.use(router); 
socket.socketConnect(server);

server.listen(PORT, () => {
    console.log(`Server está rodando na porta ${PORT}`);
    
}) 