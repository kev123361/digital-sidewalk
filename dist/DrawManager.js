var socket;

var canvas;

function setup() {
   
    //socket = io.connect(process.env.PORT || 'http://localhost:3000');
    socket = io();

    socket.on("newDrawingData", ReceiveNewDrawing);
    setupCanvas();


}

function setupCanvas() {
    canvas = new fabric.Canvas('canvas', {
        isDrawingMode:true
    });
    //canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100}));

    canvas.on('path:created', function(e) {
        //console.log(e);
        var newPath = e.path;
        console.log(newPath);
        var data = {
            drawing: newPath
        };
        socket.emit("newDrawing", data);
    });

}

function ReceiveNewDrawing(data) {
    console.log(data.drawing);
    var path = new fabric.Path(data.drawing.path);
    path.set( {
        fill: data.drawing.fill,
        stroke: data.drawing.stroke
    });
    //path.path = data.drawing.path;
    console.log(path);
    canvas.add(path);
}