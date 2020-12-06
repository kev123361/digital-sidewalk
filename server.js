
//Starting the server
var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000); //we can see the website at localhost:4000 when server is running
app.use(express.static('dist')); //everything in this folder is now available at localhost:4000
console.log("My socket server is running");
var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', newConnection);
var IDindex = 0;
var allSocketID = {};

//true false array of what canvases are active
var canvases = [
    [false, true ,false],
    [false,true, false],
    [false,false ,false]
];

//server dictionary holding current status of all canvases
var canvasImages = {};

//const port = process.env.PORT || 'http://localhost:3000'

function newConnection(socket) {
    var thisID;
    console.log('new connection: ' + socket.id);
    //store all user IDs here paired with their socket ID
    allSocketID[IDindex] = socket.id;

    socket.on("newDrawing", sendNewDrawings);
    socket.on("newMouseClick", sendNewMouseClick);
    socket.on("newUser", sendNewUserID);
    socket.on("requestCanvases", sendCanvases);
    socket.on("requestImageOfCanvas", sendCanvasImage);
    socket.on("newPath", sendNewPath);
    socket.on("newCircle", sendNewCircle);

    function sendNewDrawings(data) {
        //console.log("Got Here");
        //console.log(data.drawing);
        canvasImages[data.id] = data.image;
        socket.broadcast.emit("newDrawingData", data);
    }

    function sendNewMouseClick(data) {
        socket.broadcast.emit("newMouseClickData", data);
    }

    function sendNewUserID() {
        //console.log(allSocketID[IDindex]);
        socket.emit("newUserID", IDindex);
        IDindex += 1;
    }

    function sendCanvases() {
        data = {
            canvases: canvases
        }
        socket.emit("receivedCanvases", data);
    }

    //send image of specific canvas
    function sendCanvasImage(id) {
        requestedCanvas = {
            image: canvasImages[id],
            id: id
        }
        socket.emit("receiveCanvasImage", requestedCanvas);
    }

    function sendNewPath(data) {
        socket.broadcast.emit("receiveNewPath", data);
    }

    function sendNewCircle(data) {
        socket.broadcast.emit("receiveNewCircle", data);
    }
}



