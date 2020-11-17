var socket;

var canvas;
var newCanvas;

var myID;

//local 2d array to actual canvas elements
var localCanvases = [
    [false, false, false],
    [false, false, false],
    [false, false, false],
];

function setup() {
   
    //socket = io.connect(process.env.PORT || 'http://localhost:3000');
    socket = io();
    socket.on("newUserID", ReceiveUserID);
    socket.emit("newUser");

    socket.on("newDrawingData", ReceiveNewDrawing);
    socket.on("newMouseClickData", ReceiveNewMouseClick);
    socket.on("receivedCanvases", setupCanvasFromServer)

    socket.emit("requestCanvases");
    //setupCanvas();


}

function setupCanvasFromServer(data) {
    var canvases = data.canvases;

    for(var i = 0; i <canvases.length; i++) {
        var currRow = canvases[i];
        for (var j = 0; j < currRow.length; j++) {
            //if this canvas square is active on the server, create it on local machine
            if (currRow[j]) {
                //console.log((String)(i)+String(j));
                var c = document.createElement('canvas');
                c.setAttribute('id', (String)(i)+(String)(j)+"canvas");
                c.setAttribute('width', '250');
                c.setAttribute('height', '250');
                c.setAttribute('style', 'border:2px solid #000000');
                //console.log(c)
                //console.log((String)(i)+(String)(j))
                //console.log(document.getElementById((String)(i)+(String)(j)))
                document.getElementById((String)(i)+(String)(j)).appendChild(c);
                newCanvas = new fabric.Canvas((String)(i)+(String)(j)+"canvas", {
                    isDrawingMode:true,
                    width: '250',
                    height:'250'
                    //style='border:2px solid #000000'
                });
                localCanvases[i][j] = newCanvas;
            }
        }
    }
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
    //console.log(c)
    document.getElementById('twocell').appendChild(c);
 
    newCanvas = new fabric.Canvas('c', {
        isDrawingMode:true,
        width: '250',
        height:'250'
        //style='border:2px solid #000000'
    });
    console.log(newCanvas.toJSON());
    //$('canvasWrapper').append(newCanvas); 
    //canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100}));
    canvas.freeDrawingBrush = new fabric.CrayonBrush(canvas, {
        width: 70,
        opacity: 0.6,
        color: "#ff0000"
      });
    // canvas.on('path:created', function(e) {
    //     //console.log(e);
    //     var newPath = e.path;
    //     console.log(newPath);
    //     var data = {
    //         drawing: newPath
    //     };
    //     socket.emit("newDrawing", data);
    // });

    canvas.on('mouse:up', HandleMouseEvent);

}

function ReceiveUserID(data) {
    console.log("My User ID is: " + data);
    myID = data;
}

function ReceiveNewDrawing(data) {
    //console.log(data.image);


    console.log(data);
    // var img = data.newImage;
    // console.log(img);
    // canvas.clear();
    // var ctx = canvas.getContext("2d");
    // ctx.drawImage(img.src, 0, 0, 250, 250);
    //canvas.drawImage(img);
    console.log(URL.createObjectURL(data.src));
    
    canvas.clear();
    canvas.add(fabricImg);
}

function ReceiveNewMouseClick(data) {
    console.log(data.event);
    canvas.off('mouse:down', HandleMouseEvent);
    evt = new Event('mousedown', { clientX: data.clientX, clientY: data.clientY });
    canvas.upperCanvasEl.dispatchEvent(evt);
}

function HandleMouseEvent(e) {
    

    //socket.emit("newDrawing", JSON.stringify(copy));
}