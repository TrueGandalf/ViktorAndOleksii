var arrayX = [];
var arrayY = [];
var ordinatArrays = [];
var currentLeftX, currentRightX, currentMax, currentMin;
var allLeftX, allRightX;
var leftXvalue, rightXvalue, minYvalue, maxYvalue;
var arrForInfo;
var arrForInfoY;
var allGraphsInGroup = [];
var checksArr = [true, true, true, true];
var isMagnified;
var savedBottomGraphMouseXstart, savedBottomGraphMouseXend;
var justRedraw;
var oldAllGraphsInGroup, oldChecksArr;
var saveScopeTopBottom;

function radioSelect() {
	let radios = document.getElementsByName("graph");
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) return +radios[i].value;
	}
}
function buildGraphic(drawOnlyBottom, justCalculateTopBottom, predifinedTop, predifinedBottom) {
	if (!drawOnlyBottom)
		isMagnified = false;

	let timeStart = performance.now();
	arrayX.length = 0;
	arrayY.length = 0;
	if (allGraphsInGroup.columns == undefined) changeGraphsInGroup();

	ordinatArrays = [];

	ordinatArrays = allGraphsInGroup.columns.slice(1).map(x=>x.slice(1));
	let currentArrayY = ordinatArrays[0];

	arrayX = allGraphsInGroup.columns[0].slice(1);
	leftXvalue = arrayX[0];
	rightXvalue =  arrayX[arrayX.length-1];

	let maxYvalueArr = [];
	let minYvalueArr = [];
	for (let i = 0; i < ordinatArrays.length; i++){
		maxYvalueArr.push(
			getMaximumValue(leftXvalue, rightXvalue, "nothing", ordinatArrays[i])
		);
		minYvalueArr.push(
			getMinimumValue(leftXvalue, rightXvalue, "nothing", ordinatArrays[i])
		);
	}

	maxYvalue = Math.max(...maxYvalueArr);
	minYvalue = Math.min(...minYvalueArr);
	let yGap = maxYvalue - minYvalue;
	maxYvalue += yGap *0.01;
	minYvalue -= yGap *0.01;

	if (justCalculateTopBottom) {
		return [maxYvalue, minYvalue];
	}

	if (predifinedTop || predifinedBottom) {
		maxYvalue = predifinedTop;
		minYvalue = predifinedBottom;
	}

	if (!drawOnlyBottom)
		showGraphic(maxYvalue, minYvalue, undefined, undefined, currentArrayY, "graphic");	
	showGraphic(maxYvalue, minYvalue, undefined, undefined, currentArrayY, "summaryGraphic");
}
function showGraphic(max, min, leftX, rightX, currentArrayY, divId) {

	document.getElementById(divId).width = document.getElementById(divId).width; 

	var graphic_canvas = document.getElementById(divId);
	var graphic_context = graphic_canvas.getContext("2d");
	
	var graphic_width = document.getElementById(divId).width;
	var graphic_height = document.getElementById(divId).height;

	let changeLeftX = false;
	if (!leftX && !(leftX===0) ) {
		var leftX = window.arrayX[0];
		changeLeftX = true;
	}
	if (!rightX && !(rightX===0) ) {
		var rightX = arrayX[arrayX.length-1];
		rightX = (rightX - leftX)*1.02 + leftX;
	}
	if(changeLeftX){
		leftX = leftX - (rightX - leftX)/1.02*0.02;
	}

	let changeMin = false;
	if (!min) {
		var bottomY = Math.min.apply(Math, currentArrayY);
		changeMin = true;
	} else {
		var bottomY = min;
	}

	if (!max) {
		var topY = Math.max.apply(Math, currentArrayY);
		topY = (topY - bottomY)*1.04 + bottomY;
	} else {
		var topY = max;
	}
	if (changeMin){
		bottomY = bottomY - (topY - bottomY)/1.04*0.04;
	}

	var horizontalDiapason = arrayX[arrayX.length-1] - window.arrayX[0];

	var verticalDiapason = topY - bottomY;

	if ( !(leftX-rightX)  || !(topY-bottomY) ) {
		return;
	}
	currentLeftX = leftX;
	currentRightX = rightX;
	currentMax = topY;
	currentMin = bottomY;

	if (divId == "graphic"){
		drawLines(graphic_context, graphic_height, graphic_width, leftX, (rightX - leftX), rightX, verticalDiapason, bottomY);		
	} else {
		allRightX = rightX;
		allLeftX = leftX;
	}

	if (divId == "graphic"){
		arrForInfoY = [];
	}
	let trickyIndex = -1;
	let rightIndexes = [];
	for (let i = 0; i < checksArr.length; i++) {
		if (checksArr[i])
			rightIndexes.push(i);
	}

	for (let i = 0; i < ordinatArrays.length; i++) {
		currentColor = allGraphsInGroup.colors[`y${rightIndexes[i]}`];
		drawGraphic(graphic_context, graphic_height, graphic_width, leftX, horizontalDiapason, rightX, verticalDiapason, bottomY, ordinatArrays[i], currentColor);
	}
}
function drawLines(graphic_context, graphic_height, graphic_width, leftX, horizontalDiapason, rightX, verticalDiapason, bottomY) {
	{
		var xBlackStep = yBlackLinesStep(horizontalDiapason);
		var oddXPiece = leftX % xBlackStep;
	}
	{	graphic_context.moveTo(0, 0);
		graphic_context.lineTo(graphic_width, 0);
		graphic_context.moveTo(0, graphic_height);
		graphic_context.lineTo(graphic_width, graphic_height);

		var yBlackStep = yBlackLinesStep(verticalDiapason);
		var oddYPiece = bottomY % yBlackStep;

		graphic_context.strokeStyle = "grey";
		graphic_context.stroke();
		graphic_context.beginPath();
	}

	if (0) {
		ctx.fillStyle = "#00F";
		ctx.strokeStyle = "#F00";
		ctx.font = "italic 30pt Arial";
		ctx.fillText("Fill text", 20, 50);
		ctx.font = 'bold 30px sans-serif';
		ctx.strokeText("Stroke text", 20, 100);
	}

	graphic_context.font = 'bold 15px Arial';
	var textXIndent = -20;
	var textIndent = 3;

	var xSpecialRound;
	var xMax = Math.floor( horizontalDiapason/ xBlackStep);

	graphic_context.fillStyle = "grey";

	let oldDataText = "";
	for (var x = 0; x <= xMax+1; x++) {
		xSpecialRound = ( x * xBlackStep - oddXPiece );//strange but more precision = better result

		let dataText = new Date(+(+xSpecialRound + leftX).toFixed( 0 )).toLocaleString("en-US", {month: "short", day: "numeric"});
		if (dataText == oldDataText){
			dataText = "";
		} else {
			oldDataText = dataText;
		}

		graphic_context.fillText(
			dataText,
			( x * xBlackStep - oddXPiece ) / horizontalDiapason *graphic_width +textXIndent- (dataText.length - 5)*5,
			graphic_height - textIndent 
			);
	}
	graphic_context.strokeStyle = "grey";
	graphic_context.stroke();
	graphic_context.beginPath();

	var yNumInterval = 10;
	var specialRound;
	var yMax = Math.floor( verticalDiapason/ yBlackStep);
	for (var y = 1; y <= yMax+1; y++) {
		specialRound = (y * yBlackStep - oddYPiece);
		graphic_context.fillText((specialRound*1 + bottomY).toFixed( precision(yBlackStep) ), 0 +textIndent, (graphic_height - (y * yBlackStep - oddYPiece) / verticalDiapason *graphic_height) -textIndent );
		graphic_context.moveTo(0, (graphic_height - (y * yBlackStep - oddYPiece) / verticalDiapason *graphic_height) );
		graphic_context.lineTo(graphic_width, (graphic_height - (y * yBlackStep - oddYPiece)/ verticalDiapason *graphic_height) );
	}

	graphic_context.strokeStyle = "#888";	
	graphic_context.stroke();
	graphic_context.beginPath();
}
function drawGraphic(graphic_context, graphic_height, graphic_width, leftX, horizontalDiapason,
 rightX, verticalDiapason, bottomY, currentArrayY, currentColor) {

	arrForInfo = [];
	var element = -666;
	var newElement = 0;
	for (var x = 1; x < graphic_width; x++ ) {
		newElement = Math.floor(  x/(graphic_width-1)*(currentArrayY.length -1));
		if (newElement !== element) {
			graphic_context.lineTo(( ( x * horizontalDiapason / (rightX - leftX) ) + ( (arrayX[0] - leftX) / (rightX - leftX) * graphic_width ) ), graphic_height - ( ( ( currentArrayY[Math.floor(x / (graphic_width - 1) * (currentArrayY.length - 1))] - bottomY) / (  verticalDiapason ) * graphic_height) + 1));
			element = newElement;
			arrForInfo[newElement] = ( ( x * horizontalDiapason / (rightX - leftX) ) + ( (arrayX[0] - leftX) / (rightX - leftX) * graphic_width ) );
			arrForInfoY[newElement]? 0 : arrForInfoY[newElement] = [];
			arrForInfoY[newElement].push(
				graphic_height - ( ( ( currentArrayY[Math.floor(x / (graphic_width - 1) * (currentArrayY.length - 1))] - bottomY) / (  verticalDiapason ) * graphic_height) + 1)
			);
		}
	}

	graphic_context.strokeStyle = currentColor;
	graphic_context.lineWidth = 2;
	graphic_context.stroke();
	graphic_context.beginPath();
}
function getClosestXsIndexes(xLeft, xRight){
	var indexXLeft, indexXRight;

	var i = 0;
	while(xLeft > arrayX[i]) {
		i++;
	}
	indexXLeft = i;

	if (xRight === undefined) {
		return Math.abs(xLeft - arrayX[i-1]) < Math.abs(xLeft - arrayX[i]) ? i-1 : i ;
	}

	i = 0;
	while(xRight >= arrayX[i]) {
		i++;
		if (i > 10000){

		}
	}
	indexXRight = i;
	return [indexXLeft, indexXRight];
}
function getMinimumValue(xLeft, xRight, allDataMax, arrayY) {
	var [indexXLeft, indexXRight] = getClosestXsIndexes(xLeft, xRight);
	indexXLeft = (indexXLeft > 0) ? indexXLeft : 1;
	var minimum = Math.min.apply( Math, arrayY.slice(indexXLeft, indexXRight+1));
	return minimum;
}
function getMaximumValue(xLeft, xRight, allDataMax, arrayY) {
	var [indexXLeft, indexXRight] = getClosestXsIndexes(xLeft, xRight);

	indexXLeft = (indexXLeft > 0) ? indexXLeft : 1;
	var maximum = Math.max.apply( Math, arrayY.slice(indexXLeft, indexXRight+1));
	return maximum;
}
function changeGraphicVerticalDiapason(max, min, leftX, rightX) {
	if(arrayX.length == 0) {
		alert("First you need to create a data array!\nLoad data and push \"Go! \"");
		return;
	}
	showGraphic(max, min, leftX, rightX);
}
function changeGraphicVerticalDiapasonChangeable() {
	max =  maxYvalue;
	showGraphic(max, 0, 0);
}
function changeLeftRightX(max, min, leftX, rightX) {
	if(arrayX.length == 0) {
		return;
	}

	showGraphic(max, min, leftX, rightX, ordinatArrays[0], "graphic");
}
function showRectangle(max, min, leftX, rightX) {
	if(arrayX.length == 0) {
		return;
	}
	
	var graphic_canvas = document.getElementById("glassForGraphic");
	var graphic_context = graphic_canvas.getContext("2d");

	var graphic_width = document.getElementById("glassForGraphic").width;
	var graphic_height = document.getElementById("glassForGraphic").height;

	if (!leftX && !(leftX===0) ) {
		var leftX = window.arrayX[0];
	}
	if (!rightX && !(rightX===0) ) {
		var rightX = arrayX[arrayX.length-1];
	}
	if (!min) {
		var bottomY = 0;
	} else {
		var bottomY = min;
	}

	if (!max) {
		var topY = Math.max.apply(Math, arrayY);
	} else {
		var topY = max;
	}

	if ( !(leftX-rightX)  || !(topY-bottomY) ) {
		return;
	}

	var canvasLeftX, canvasRightX, canvasBottomY, canvasTopY;
	var currentHorizontalDiapason = currentRightX - currentLeftX;
	var currentVerticalDiapason = currentMax - currentMin;
	canvasLeftX  = ( leftX - currentLeftX) / currentHorizontalDiapason * graphic_width;
	canvasRightX = (rightX - currentLeftX) / currentHorizontalDiapason * graphic_width;
	canvasBottomY = (bottomY - currentMin) / currentVerticalDiapason * graphic_height;
	canvasTopY    = (   topY - currentMin) / currentVerticalDiapason * graphic_height;

	var canvasRectWidth = canvasRightX - canvasLeftX;
	var canvasRectHeight = canvasTopY - canvasBottomY;
	canvasTopY = graphic_height - canvasTopY;
	
	setTimeout( changeLeftRightX, 0, maxYvalue,
		minYvalue, leftXvalue, rightXvalue);
	setTimeout(redraw, 0);
}
function yBlackLinesStep(axisMaxValue) {
	axisMaxValue = +axisMaxValue;
	var multiplier = 1;
	if (axisMaxValue<0) axisMaxValue *= -1;
	var changedAxisMaxValue = axisMaxValue;
	if (!changedAxisMaxValue) return;
	if (changedAxisMaxValue === Infinity || changedAxisMaxValue === -Infinity){
		return;
	}
	while (changedAxisMaxValue<1) {
		multiplier *= 10;
		changedAxisMaxValue *= 10;
	}
	while (changedAxisMaxValue >= 10) {
		multiplier /= 10;
		changedAxisMaxValue /= 10;
	}
	if (1<= changedAxisMaxValue && changedAxisMaxValue <= 3) {
		multiplier *= 5;
		changedAxisMaxValue *= 5;
	}
	var floorAxisMaxValue =	Math.floor(axisMaxValue * 	multiplier);

	return 1/(multiplier);
}
function precision(num) {

	var result = 0;

	if (num < 0) num *= -1;
	if (!num) return;

	while (num < 1) {
		num *= 10;
		result++;
	}
	return result;
}
function redraw() {
	document.getElementById("glassForGraphic").width = document.getElementById("glassForGraphic").width;
}

var canvasLive;
var contextLive;
var firstCanvasX,
	secondCanvasX;

var canvasGraph, canvasScope;
var contextLiveGraph, contextScopeLive;
var firstScopeCanvasX,
	secondScopeCanvasX,
	canvasGraphX;

window.onload = function() {

	canvasGraph = document.getElementById("glassForGraphic");
	contextLiveGraph = canvasGraph.getContext("2d"); 
    canvasScope = document.getElementById("summaryGlassForGraphic");    
	contextLiveScope = canvasScope.getContext("2d");

	canvasScope.onmousedown = startScopeDrawing;
	canvasGraph.onmousedown = startInfoDrawing;
	canvasScope.onmouseup = stopScopeDrawing;
	canvasGraph.onmouseup = stopInfoDrawing;
	
	window.onmouseup = ( () => stopScopeDrawing(), stopInfoDrawing() );

	canvasScope.onmousemove = drawScope;
	canvasGraph.onmousemove = drawInfo;

	setFullScreen();

	canvasScope.addEventListener("touchstart", function (e) {
	        mousePos = getTouchPos(canvasScope, e);
	  var touch = e.touches[0];
	  var mouseEvent = new MouseEvent("mousedown", {
	    clientX: touch.clientX,
	    clientY: touch.clientY
	  });
	  canvasScope.dispatchEvent(mouseEvent);
	}, false);

	canvasScope.addEventListener("touchend", function (e) {
	  var mouseEvent = new MouseEvent("mouseup", {});
	  canvasScope.dispatchEvent(mouseEvent);
	}, false);

	canvasScope.addEventListener("touchmove", function (e) {
	  var touch = e.touches[0];
	  var mouseEvent = new MouseEvent("mousemove", {
	    clientX: touch.clientX,
	    clientY: touch.clientY
	  });
	  canvasScope.dispatchEvent(mouseEvent);
	}, false);

	function getTouchPos(canvasDom, touchEvent) {
	  var rect = canvasDom.getBoundingClientRect();
	  return {
	    x: touchEvent.touches[0].clientX - rect.left,
	    y: touchEvent.touches[0].clientY - rect.top
	  };
	}
	
	addButtons();	
	document.getElementById("colorMode").addEventListener("click", colorMode, false);
};

window.addEventListener('resize', setFullScreen, false);

var isScopeDrawing = false;
var isInfoDrawing = false;
let frameOffset = null;

function startScopeDrawing(e) {
	isScopeDrawing = true;

	let x = e.pageX - canvasScope.offsetLeft;
	let inOrder = (firstScopeCanvasX < secondScopeCanvasX) ? true : false;

	if (!firstScopeCanvasX || (x < (inOrder ? firstScopeCanvasX - 5 : secondScopeCanvasX - 5) || x > (inOrder ? secondScopeCanvasX + 5 : firstScopeCanvasX + 5))) {
		firstScopeCanvasX = e.pageX - canvasScope.offsetLeft;
		frameOffset = null;
	} else if (inOrder ? (x > firstScopeCanvasX - 5 && x < firstScopeCanvasX + 5) : (x > secondScopeCanvasX - 5 && x < secondScopeCanvasX + 5)) {
		if (inOrder) firstScopeCanvasX = secondScopeCanvasX;
		frameOffset = null;
	} else if (inOrder ? (x > secondScopeCanvasX - 5 && x < secondScopeCanvasX + 5) : (x > firstScopeCanvasX - 5 && x < firstScopeCanvasX + 5)) {
		if (!inOrder) firstScopeCanvasX = secondScopeCanvasX;
		frameOffset = null;
	} else if (x > (inOrder ? firstScopeCanvasX + 5 : secondScopeCanvasX + 5) && x < (inOrder ? secondScopeCanvasX - 5 : firstScopeCanvasX - 5)) {
		if (!inOrder) {
			let [a, b] = [firstScopeCanvasX, secondScopeCanvasX];
			firstScopeCanvasX = b;
			secondScopeCanvasX = a;
		} 
		frameOffset = [x - firstScopeCanvasX, secondScopeCanvasX - x];
	}
}
function startInfoDrawing(e) {
	isInfoDrawing = true;
	drawInfo(e);
}
function drawScope(e, scopeRedrawTopBottom, justCalculateTopBottom) {
	if (isScopeDrawing == true) {
		isMagnified = true;
		var x;
		if (justRedraw)
			x = savedBottomGraphMouseXstart;
		else
			x = e.pageX - canvasScope.offsetLeft;
		savedBottomGraphMouseXstart = x;
		
		if (x < 0+canvasScope.width/200)
			x = 0+canvasScope.width/200;
		if (x > canvasScope.width*199/200)
			x = canvasScope.width*199/200;
		contextLiveScope.fillStyle = "grey";

		contextLiveScope.fillRect(0,0, canvasScope.width, canvasScope.height);
		contextLiveScope.fillStyle = "#000";

		let sign = (x>firstScopeCanvasX) ? 1 : -1;
		if (frameOffset) {
			contextLiveScope.fillRect(
				(x - frameOffset[0])-canvasScope.width/200*sign,
				0,
				(frameOffset[0] + frameOffset[1])+canvasScope.width/100*sign,
				canvasScope.height);
			contextLiveScope.clearRect(
				x - frameOffset[0],
				0+canvasScope.height/20,
				(frameOffset[0] + frameOffset[1]),
				canvasScope.height-canvasScope.height/10 );
			if (justRedraw)
				secondScopeCanvasX = savedBottomGraphMouseXend;
			else
				secondScopeCanvasX = e.pageX - canvasScope.offsetLeft;
			savedBottomGraphMouseXend = secondScopeCanvasX;
			
			firstScopeCanvasX = x - frameOffset[0];
			secondScopeCanvasX = x + frameOffset[1];
			if (secondScopeCanvasX < 0+canvasScope.width/200)
				secondScopeCanvasX = 0+canvasScope.width/200;
			if (secondScopeCanvasX > canvasScope.width*199/200)
				secondScopeCanvasX = canvasScope.width*199/200;
		} else {
			contextLiveScope.fillRect(
				firstScopeCanvasX-canvasScope.width/200*sign,
				0,
				(x-firstScopeCanvasX)+canvasScope.width/100*sign,
				canvasScope.height);
			contextLiveScope.clearRect(
				firstScopeCanvasX,
				0+canvasScope.height/20,
				(x-firstScopeCanvasX),
				canvasScope.height-canvasScope.height/10 );

			if (justRedraw)
				secondScopeCanvasX = savedBottomGraphMouseXend;
			else
				secondScopeCanvasX = e.pageX - canvasScope.offsetLeft;
			savedBottomGraphMouseXend = secondScopeCanvasX;
			if (secondScopeCanvasX < 0+canvasScope.width/200)
				secondScopeCanvasX = 0+canvasScope.width/200;
			if (secondScopeCanvasX > canvasScope.width*199/200)
				secondScopeCanvasX = canvasScope.width*199/200;
		}
		
		leftXvalue = allLeftX + ( firstScopeCanvasX < secondScopeCanvasX ? firstScopeCanvasX : secondScopeCanvasX ) / canvasScope.width * (allRightX - allLeftX);
		rightXvalue = allLeftX + ( firstScopeCanvasX > secondScopeCanvasX ? firstScopeCanvasX : secondScopeCanvasX ) / canvasScope.width * (allRightX - allLeftX);

		let maxYvalueArr = [];
		let minYvalueArr = [];
		if (justCalculateTopBottom){
			ordinatArrays = allGraphsInGroup.columns.slice(1).map(x=>x.slice(1));
		}
		for (let i = 0; i < ordinatArrays.length; i++){
			maxYvalueArr.push(
				getMaximumValue(leftXvalue, rightXvalue, "nothing", ordinatArrays[i])
			);
			minYvalueArr.push(
				getMinimumValue(leftXvalue, rightXvalue, "nothing", ordinatArrays[i])
			);
		}
		
		maxYvalue = Math.max(...maxYvalueArr);
		minYvalue = Math.min(...minYvalueArr);
		let yGap = maxYvalue - minYvalue;
		maxYvalue += yGap *0.01;
		minYvalue -= yGap *0.01;
		
		saveScopeTopBottom = [maxYvalue, minYvalue];

		if(justCalculateTopBottom){
			return [maxYvalue, minYvalue];
		}

		if (scopeRedrawTopBottom){
			[maxYvalue, minYvalue] = scopeRedrawTopBottom;
		}

		showRectangle(
			maxYvalue,
			minYvalue,
			leftXvalue,
			rightXvalue
		)
	}
}
function drawInfo(e) {
	if (isInfoDrawing == true) {
		canvasGraphX = e.pageX - canvasGraph.offsetLeft;
		canvasGraphY = e.pageY - canvasGraph.offsetTop;

		document.getElementById("glassForGraphic").width = document.getElementById("glassForGraphic").width;
		
		var x = canvasGraphX;
		
		if (x < 0+canvasGraph.width/200)
			x = 0+canvasGraph.width/200;
		if (x > canvasGraph.width*199/200)
			x = canvasGraph.width*199/200;
		var y = canvasGraphY;

		contextLiveGraph.fillStyle = "#999";
		
		if (leftXvalue === undefined){
			leftXvalue = allLeftX;
			rightXvalue = allRightX;
		}
		let xValue = leftXvalue + x / canvasGraph.width * (rightXvalue - leftXvalue);
		let xIndex = getClosestXsIndexes(xValue);
		
		xValue = arrForInfo[xIndex];

		let leftXIndent, rightXIndent, topIndet, boxHeight;
		leftXIndent = 80;
		rightXIndent = 80;
		topIndet = 20;
		boxHeight = 80;
		if (allGraphsInGroup.columns.slice(1).length > 2)
			boxHeight *=2;

		contextLiveGraph.clearRect(0,0, canvasGraph.width, canvasGraph.height);
		
		let maxCurrentYarr = [];
		for (let i = 0; i < ordinatArrays.length; i++){
			maxCurrentYarr.push(+arrForInfoY[xIndex][i]);
		}
		
		let maxCurrentY = Math.min(...maxCurrentYarr);
		
		contextLiveGraph.fillRect(xValue-1, maxCurrentY, 2, canvasGraph.height);
		let rightIndexes = [];
		for (let i = 0; i < checksArr.length; i++) {
			if (checksArr[i])
				rightIndexes.push(i);
		}

		for (let i = 0; i < ordinatArrays.length; i++){
			drawInfoCircle(xIndex, xValue, i, allGraphsInGroup.colors[`y${rightIndexes[i]}`]);
		}

		contextLiveGraph.strokeStyle = 'grey';

		let canvasMiddleX = canvasGraph.width/2;

		let boxLeftX = canvasMiddleX - leftXIndent;
		let boxRightX = canvasMiddleX + rightXIndent;
		let boxMiddleX = boxLeftX + (leftXIndent + rightXIndent) / 2;

		let boxTopY = 0 + topIndet;
		let boxBottomY = boxTopY + boxHeight;
		let boxMiddleY = boxTopY + boxHeight / 2;

		drawBox(contextLiveGraph, "#fff",
			boxLeftX, boxRightX, boxMiddleX,
			boxTopY, boxBottomY, boxMiddleY,
			xValue, xIndex);
	}
}
function drawInfoCircle(xIndex, xValue, graphIndex, color){
	contextLiveGraph.beginPath();
	contextLiveGraph.arc(xValue, arrForInfoY[xIndex][graphIndex], 4, 0, 2 * Math.PI);
	contextLiveGraph.stroke();
	let fillColor = document.documentElement.style.backgroundColor;
	fillColor = fillColor ? fillColor : "#fff"; 
	contextLiveGraph.fillStyle = fillColor;
	contextLiveGraph.fill();
	contextLiveGraph.lineWidth = 2;
	contextLiveGraph.strokeStyle = color;
	contextLiveGraph.stroke();
}
function drawInfoOnGraph(e) {
}
function drawBox(context, color, boxLeftX, boxRightX, boxMiddleX, boxTopY, boxBottomY, boxMiddleY, currentX, xIndex) {
	let fillColor = document.documentElement.style.backgroundColor;
	fillColor = fillColor ? fillColor : "#fff"; 
	context.fillStyle = fillColor;

	context.beginPath();
    context.moveTo(boxLeftX, boxMiddleY);

    context.bezierCurveTo(boxLeftX, boxTopY, boxLeftX, boxTopY, boxMiddleX, boxTopY);

    context.bezierCurveTo(boxRightX, boxTopY, boxRightX, boxTopY, boxRightX, boxMiddleY);

    context.bezierCurveTo(boxRightX, boxBottomY, boxRightX, boxBottomY, boxMiddleX, boxBottomY);

    context.bezierCurveTo(boxLeftX, boxBottomY, boxLeftX, boxBottomY, boxLeftX, boxMiddleY);
			
	context.stroke();
	context.fill();

	context.fillStyle = "grey";
	context.font = "bold 18px Georgia sans-serif";
	let dataText = new Date(+arrayX[xIndex]).toLocaleString("en-US", {weekday: "short", month: "short", day: "numeric"});
	context.fillText(dataText, boxLeftX + 40, boxTopY + 20, 80);

	context.fillStyle = "#F00";
	context.font = "bold 20px Georgia sans-serif";
	let leftColIndent = 10;
	let rightColIndent = (boxRightX - boxLeftX)/2 + leftColIndent;

	let rightIndexes = [];
	for (let i = 0; i < checksArr.length; i++) {
		if (checksArr[i])
			rightIndexes.push(i);
	}
	for (let iterator = 0; iterator < ordinatArrays.length; iterator++) {
		currentColor = allGraphsInGroup.colors[`y${rightIndexes[iterator]}`];		
		drawAllData(rightIndexes[iterator], context, xIndex, boxLeftX, leftColIndent, rightColIndent,
		 boxTopY, boxRightX, currentColor, iterator, ordinatArrays.length);
	}
}
function drawAllData(rigthIndex, context, xIndex, boxLeftX, leftColIndent, rightColIndent,
	boxTopY, boxRightX, currentColor, iterator, onlyOne){	
	let wordLen;
	if (!(iterator%2)){
		colIndent = leftColIndent;
	} else {
		colIndent = rightColIndent;
	}
	let line = 2 ;
	if (iterator > 1){
		line++;
		line++;
	}
	
	if (onlyOne == 1){
		wordLen =
			(""+ordinatArrays[iterator][xIndex]).length
		 * 8;
		colIndent = ((boxRightX - boxLeftX) - wordLen)/2;
	}

	context.fillStyle = currentColor;
	dataText = ordinatArrays[iterator][xIndex];
	context.fillText(dataText, boxLeftX + colIndent, boxTopY + line * 20, (boxRightX - boxLeftX)/2 - leftColIndent*2);
	line++;
	if (onlyOne == 1){
		wordLen =
			allGraphsInGroup.names[`y${rigthIndex}`].length
		 * 8;
		colIndent = ((boxRightX - boxLeftX) - wordLen)/2;
	}
	dataText = allGraphsInGroup.names[`y${rigthIndex}`];
	context.fillText(dataText, boxLeftX + colIndent, boxTopY + line * 20, (boxRightX - boxLeftX)/2 - leftColIndent*2);
}
function stopScopeDrawing(e) {
	isScopeDrawing = false;
}
function stopInfoDrawing(e) {
	isInfoDrawing = false;
	document.getElementById("glassForGraphic").width = document.getElementById("glassForGraphic").width;
}
function setFullScreen() {
	document.getElementById("graphic").width = document.getElementById("forGraphic").clientWidth;
	document.getElementById("graphic").height = document.getElementById("graphic").width / 3.5;
	document.getElementById("glassForGraphic").width = document.getElementById("forGraphic").clientWidth;
	document.getElementById("glassForGraphic").height = document.getElementById("glassForGraphic").width / 3.5;
	document.getElementById("summaryGraphic").width = document.getElementById("forGraphic").nextElementSibling.clientWidth;
	document.getElementById("summaryGraphic").height = document.getElementById("summaryGraphic").width / 14;
	document.getElementById("summaryGlassForGraphic").width = document.getElementById("forGraphic").nextElementSibling.clientWidth;
	document.getElementById("summaryGlassForGraphic").height = document.getElementById("summaryGlassForGraphic").width / 14;
	buildGraphic();
}
function addButtons() {
	let count = 1;
	if (document.getElementById("buttons")) document.getElementById("buttons").parentElement.removeChild(document.getElementById("buttons"));
	let div = document.createElement("div");
	div.id = "buttons";
	document.getElementById("container").insertBefore(div, document.getElementById("colorMode").parentElement);
	for (let key in allGraphsInGroup.colors) {
		buttonAdd(allGraphsInGroup.names[key], count);
		styleAdd(allGraphsInGroup.colors[key], count);
		count++;
	}
}
function colorMode() {
	let link = document.getElementById("colorMode");
	let html = document.documentElement;
	let btCtn = document.getElementsByClassName("inputGroup");
	link.innerText = `Switch to ${(link.innerText.split(" ")[2] == "Day") ? "Nigth" : "Day"} Mode`;
	if (html.style.backgroundColor == "") {
		html.style.backgroundColor = "#212121";
		for (let i = 0; i < btCtn.length; i++) {
			btCtn[i].children[1].style.color = "#fff";
		}
	} else {
		html.style.backgroundColor = "";
		if (btCtn[0].children[1].getAttribute("style")) {
			for (let i = 0; i < btCtn.length; i++) {
				btCtn[i].children[1].removeAttribute("style");
			}
		}
	}
}
function buttonAdd(text, option) {
	let btn = document.createElement("div");
	btn.className = "inputGroup";
	let input = document.createElement("input");
	input.id = `option${option}`;
	input.name = `option${option}`;
	input.type = "checkbox";
	input.checked = true;
	//input.onclick = changeGraphsInGroup;
	input.setAttribute("onclick", "changeGraphsInGroup()");
	let label = document.createElement("label");
	label.innerText = text;
	label.setAttribute("for", `option${option}`);
	btn.appendChild(input);
	btn.appendChild(label);
	document.getElementById("buttons").appendChild(btn);
}
function styleAdd(color, option) {
	let style = document.createElement("style");
	style.innerText = `.inputGroup input:checked ~ label[for=option${option}]:after {\nbackground-color: ${color};\nborder-color: ${color};\n}`;
	document.getElementById("buttons").appendChild(style);
}
function changeGraphsInGroup(isItSecondCall){
	if (!isItSecondCall){
		oldAllGraphsInGroup = Object.assign({}, allGraphsInGroup);
		oldChecksArr = checksArr;
	} 
	checksArr = [];
	let nodes = document.querySelectorAll(".inputGroup");
	if (nodes.length == 0){
		allGraphsInGroup = data[radioSelect()];
		checksArr = [true, true, true, true];
		return;
	}
	for (let i = 0; i < nodes.length; i++ ) {
		checksArr.push(nodes[i].firstChild.checked);		
	}	

	allGraphsInGroup = {};

	reallyAllGraphsInGroup = data[radioSelect()];
	for (let prop in reallyAllGraphsInGroup){
		if ( !Array.isArray(reallyAllGraphsInGroup[prop]) ){
			let i = 0;
			allGraphsInGroup[prop] = {};
			for (let innerProp in reallyAllGraphsInGroup[prop]){
				if (checksArr[i] || innerProp == "x"){
					allGraphsInGroup[prop][innerProp] = (reallyAllGraphsInGroup[prop][innerProp]);
				}				
				i++;
			}
		}
		else{
			allGraphsInGroup[prop] = [];
			for (let i = 0; i < reallyAllGraphsInGroup[prop].length; i++){
				if (i==0 || checksArr[i-1]){
					allGraphsInGroup[prop].push(reallyAllGraphsInGroup[prop][i]);
				}
			}	
		}			
	}
	if(!isItSecondCall){
		let diviser = 5;		
		let oldTopFirst = maxYvalue;
		let oldBotFirst = minYvalue;
		let wasMagn = isMagnified;
		let newTopBottomFirst;
		let newTopBottomSecond;
		let topSecond, botSecond;
		let oldTopSecond, oldBotSecond;
		let topDiffSecond;
		let botDiffSecond
		if (!isMagnified){
			newTopBottomFirst = buildGraphic(false, true);
		}
		else{
			newTopBottomFirst = buildGraphic(false, true);
			[oldTopSecond, oldBotSecond] = saveScopeTopBottom;
			justRedraw = true;
			isScopeDrawing = true;
			newTopBottomSecond = drawScope(false, false, true);
			justRedraw = false;
			isScopeDrawing = false;

			[topSecond, botSecond] = newTopBottomSecond;
			topDiffSecond = (topSecond - oldTopSecond)/ diviser;
			botDiffSecond = (botSecond - oldBotSecond)/ diviser;
		}
		isMagnified = wasMagn;
		if (!oldAllGraphsInGroup)
			return;
		allGraphsInGroup = oldAllGraphsInGroup;
		checksArr = oldChecksArr;

		let [topFirst, botFirst] = newTopBottomFirst;

		if(topFirst == oldTopFirst && botFirst == oldBotFirst
		&& topSecond == oldTopSecond && botSecond == oldBotSecond ){
			changeGraphsInGroup(true);
			return;
		}

		let topDiffFirst = (topFirst - oldTopFirst)/ diviser;
		let botDiffFirst = (botFirst - oldBotFirst)/ diviser;

		if(isMagnified){
			for (let i = 1; i <= diviser; i++){
				setTimeout(buildGraphic, 50*i, ...[1, 0, oldTopFirst+topDiffFirst*i, oldBotFirst+botDiffFirst*i]);
			}
			justRedraw = true;
			isScopeDrawing = true;

			for (let i = 1; i <= diviser; i++){
				setTimeout(drawScope, 50*i, "nothing", [oldTopSecond+topDiffSecond*i, oldBotSecond+botDiffSecond*i]);
			}

			setTimeout(()=>{justRedraw = false; isScopeDrawing = false;}, 50 * (diviser+1));
		}
		else {
			for (let i = 1; i <= diviser; i++){
				setTimeout(buildGraphic, 50*i, ...[0, 0, oldTopFirst+topDiffFirst*i, oldBotFirst+botDiffFirst*i]);
			}
		}

		setTimeout(changeGraphsInGroup, 50 * (diviser+1), true);
		return;
	}
	if(isMagnified){		
		buildGraphic(true);
		justRedraw = true;
		isScopeDrawing = true;
		drawScope();		
		justRedraw = false;		
		isScopeDrawing = false;
	} else {
		buildGraphic();
	}
}
function topButtonClick(isItSecondCall){
	isMagnified = false;
	allGraphsInGroup = data[radioSelect()];

	addButtons();
	changeGraphsInGroup(isItSecondCall);

	document.getElementById("summaryGlassForGraphic").width = 
	document.getElementById("summaryGlassForGraphic").width;
}