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
        isDrawingMode:true,
    });

    var c = document.createElement('canvas');
    c.setAttribute('id', 'c');
    c.setAttribute('width', '250');
    c.setAttribute('height', '250');
    c.setAttribute('style', 'border:2px solid #000000');
    console.log(c)
    document.getElementById('twocell').appendChild(c);
 
    var newCanvas = new fabric.Canvas('c', {
        isDrawingMode:true,
        width: '250',
        height:'250'
        //style='border:2px solid #000000'
    });
    //$('canvasWrapper').append(newCanvas); 
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