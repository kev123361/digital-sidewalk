function setup() {
    //socket = io.connect(process.env.PORT || 'http://localhost:3000');
    socket = io();
    socket.on("newDrawingData", ReceiveNewDrawing);
    //at the beginning, set all the canvas to isDrawingMode:false selectable:false
    for(var i=0;i<canvasId.length;i++){
        setupCanvas_no(i);    
    }
    //for every canvas, there is a mousecontrol inspector
    for(var j=0;j<canvasId.length;j++){
        mouseInspector(j);
    }

}
function setupCanvas_no(i){
    canvasName[i] = new fabric.Canvas(canvasId[i], {
        isDrawingMode:false,
        selectable:false,
        width:400,
        height:400
    });
    //canvasName[i].deactivateAll();
    canvasName[i].renderAll();
    canvasName[i].forEachObject(function(object){ 
        object.selectable = false; 
    });
    canvasName[i].on("mouse:up", function(event) {
        
        //canvasName[i].contextTopDirty = true;
        //canvasName[i].add(imgcopy);


        var data = {
            image : canvasName[i].upperCanvasEl.toDataURL(),
            id : i
        }
        //console.log(data.image)
        socket.emit("newDrawing", data);

    });
}
function mouseInspector(i){
    coordi=[];
    //inspect mouse over for all
    canvasName[i].on("mouse:over", function(event){
        //stitching
        if(activebrushName==brushName[3]){
            //unable brush for all canvas
            for(var j=0;j<canvasId.length;j++){
                unableBrush(canvasName[j]);
            }
            //inspect mouse down for stitching
            canvasName[i].on("mouse:down", function(event) 
            {
                //make sure it's stitching again
                if(activebrushName==brushName[3]){
                    //if change canvas, clear coordi[], not letting the line connect to point location in another canvas
                    var currentcanvasName=canvasName[i];
                    if(currentcanvasName!=activecanvasName)coordi=[];
                    //update all active parameter
                    activecanvasName=canvasName[i];
                    activecanvasId=canvasId[i];
                    activecanvasName.isDrawingMode=false;
                    activecanvasName.selection=false;
                    activecanvasName.defaultCursor = 'url("needle.png"), auto';
                    //set up stitching
                    stitching(event);
                }
            });
        }
        //freedrawing brushes
        else{
            coordi=[];
            //document.getElementById("demo").innerHTML = "Hello World";
            activecanvasName=canvasName[i];
            activecanvasId=canvasId[i];
            //unable brushes for all other canvas
            for(var j=0;j<canvasId.length;j++){
                if(j!=i){
                    unableBrush(canvasName[j]);
                }
            }
            setupBrush(activecanvasName);
        }
    });  
    

}
function stitching(event){
    var pointer = activecanvasName.getPointer(event.e);
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
    activecanvasName.add(circlePoint);
    // Store the points to draw the lines
    coordi.push(circlePoint);
    if (coordi.length > 1) 
    {
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
                stroke: activeColor,
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
        //only store 2 points max
        coordi[0]=coordi[1];
        coordi.pop();
        activecanvasName.add(line);
    }
}
function setupBrush(canvas_name) {
    canvas_name.forEachObject(function(object){ 
        object.selectable = false; 
    });
    //crayon
    if(activebrushName==brushName[0]){
        canvas_name.isDrawingMode=true;
        canvas_name.freeDrawingBrush = new fabric.CrayonBrush(canvas_name, {
            width: activeWidth,
            opacity: activeOpacity,
            color: activeColor
        });
    }
    //ink
    else if(activebrushName==brushName[1]){
        canvas_name.isDrawingMode=true;
        canvas_name.freeDrawingBrush = new fabric.InkBrush(canvas_name, {
            width: activeWidth,
            opacity: activeOpacity,
            color: activeColor
        });
    }
}
function unableBrush(canvas_name) {
    canvas_name.isDrawingMode=false;
    canvas_name.selectable=false;
 }
function changeColor(e){
    activeColor=e.target.value;
    activecanvasName.freeDrawingBrush.changeColor(activeColor);
    //everytime when you put kniddle out of the canvas, you have to restart stitching
    coordi=[];
}
function changeWidth(e){
    activeWidth=e.target.value;
    activecanvasName.freeDrawingBrush.width=activeWidth;
    coordi=[];
}

function changeBrush(i){
    //change button color
    var brushes=document.getElementsByClassName("brush-choose");
    for(let m=0;m<brushes.length;m++){
        brushes[m].style.backgroundImage="url(./assets/"+m+"-1.png)";
    }
    if(i!=3){
        brushes[i].style.backgroundImage="url(./assets/"+i+".png)";
    }
    else{
        brushes[2].style.backgroundImage="url(./assets/2.png)";
    }

    //change brush
    activebrushName=brushName[i];
    coordi=[];
}
function changeOpacity(e){
    activeOpacity=e.target.value;
    activecanvasName.freeDrawingBrush.changeOpacity(activeOpacity);
    coordi=[];
}
function ReceiveNewDrawing(data) {
    //console.log(data.image);
    var newImg = new Image;
    var ctx = canvasName[data.id].getContext('2d');

    newImg.onload = function() {
        ctx.clearRect(0, 0, canvasName[data.id].width, canvasName[data.id].height)
        ctx.drawImage(newImg, 0, 0, dwidth=400, dheight=400);
    }
    newImg.src = data.image;
    

}
