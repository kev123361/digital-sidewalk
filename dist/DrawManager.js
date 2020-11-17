var socket;

var canvas;

//used for stitching test
var c_test;

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

    
    //----------------new for stitching---------------------------------//
    c_test = new fabric.Canvas('c_test', {
        isDrawingMode:false,
        defaultCursor:"url('needle.png'),move"
    });
    
    var coordi=[];
    c_test.on("mouse:down", function(event) {
            var pointer = c_test.getPointer(event.e);
            var positionX = pointer.x;
            var positionY = pointer.y;
            var shadow=new fabric.Shadow({
                blur:3,
                color:"black"
            })
            // Add small circle as an indicative point
            var circlePoint = new fabric.Circle({
            radius: 2,
            fill: "#081d1f",
            left: positionX,
            top: positionY,
            selectable: false,
            originX: "center",
            originY: "center",
            hoverCursor: "auto",
            shadow:shadow
            });

            c_test.add(circlePoint);
            // Store the points to draw the lines
            coordi.push(circlePoint);

            if (coordi.length > 1) {
            // draw a line using the two points
            var startPoint = coordi[0];
            var endPoint = coordi[1];
        
            var line = new fabric.Line(
                [
                startPoint.get("left"),
                startPoint.get("top"),
                endPoint.get("left"),
                endPoint.get("top")
                ],
                {
                stroke: color_string,
                strokeWidth: 3,
                hasControls: false,
                hasBorders: false,
                selectable: false,
                lockMovementX: true,
                lockMovementY: true,
                hoverCursor: "default",
                originX: "center",
                originY: "center"
                }
            );
            coordi=[];
            c_test.add(line);
            }
    });
    
    //----------------new for stitching---------------------------------//

}

//----------------new for stitching---------------------------------//
var color_string="blue";
function changeColor(e){
    color_string=e.target.value;
}
//----------------new for stitching---------------------------------//

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
