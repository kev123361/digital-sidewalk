
//Starting the server
var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000); //we can see the website at localhost:4000 when server is running
app.use(express.static('dist')); //everything in this folder is now available at localhost:4000
console.log("My socket server is running");
var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);

//const port = process.env.PORT || 'http://localhost:3000'

function newConnection(socket) {
    var thisID;
    console.log('new connection: ' + socket.id);

    socket.on("newDrawing", sendNewDrawings);

    function sendNewDrawings(data) {
        console.log("Got Here");
        //console.log(data.drawing);
        socket.broadcast.emit("newDrawingData", data);
    }
}



