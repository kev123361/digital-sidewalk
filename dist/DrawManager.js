var socket;

var canvas;

function setup() {
   
    //socket = io.connect(process.env.PORT || 'http://localhost:3000');
    socket = io();

    socket.on("newDrawingData", ReceiveNewDrawing);
    setupCanvas();


}

function setupCanvas() {
 /*var canvas = new fabric.Canvas("fabric-brush-demo", {
        isDrawingMode: true,
        hoverCursor: "pointer",
        selection: false
      })
      */
    canvas = new fabric.Canvas('canvas', {
        isDrawingMode:true
    });
    function setupBrush(brushName, opt) {
        canvas.freeDrawingBrush = new fabric[brushName](canvas, opt || {});
    }
    var gui = new dat.GUI();
    gui.brushType = "InkBrush";
    gui.brushWidth = 20;
    gui.brushOpacity = 1;
    gui.inkAmount = 7;
    gui.brushColor = "#ff0000";
    setupBrush(gui.brushType, {
        width: gui.brushWidth,
        opacity: gui.brushOpacity,
        inkAmount: gui.inkAmount,
        color: gui.brushColor
    });
    gui.clear = function(){
        canvas.clearContext(canvas.contextTop);
    }
    gui.save = function() {
        var dataURL = canvas.contextTop.canvas.toDataURL("image/png");
        window.open(dataURL);
    }
    gui.add(gui, "brushType", ["CrayonBrush", "InkBrush", "MarkerBrush", "SprayBrush"])
        .onFinishChange(setupBrush);
    gui.add(gui, "brushWidth", 0, 100).step(5)
        .onChange(function(value) {
            canvas.freeDrawingBrush.width = value;
        });
    gui.addColor(gui, "brushColor")
        .onChange(function(value) {
            canvas.freeDrawingBrush.changeColor(value);
        });
    gui.add(gui, "brushOpacity", 0.1, 1).step(0.1)
        .onChange(function(value) {
            canvas.freeDrawingBrush.changeOpacity(value);
        });
    gui.add(gui, "inkAmount", 1, 10).step(0.1)
        .onChange(function(value) {
            canvas.freeDrawingBrush.inkAmount = value;
        });
    gui.add(gui, "save");
    gui.add(gui, "clear");
    //canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100}));
    /*canvas.freeDrawingBrush = new fabric.CrayonBrush(canvas, {
        width: 70,
        opacity: 0.6,
        color: "#ff0000"
      });
      */
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
