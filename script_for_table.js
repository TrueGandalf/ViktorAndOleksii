function TwoDimensionalArray() {
    this.numberOfStrings = 1 || 2;// данные состоят из одной или двух текстовых строк
    this.onlyString = "";
    this.firstString = "";
    this.secondString = "";

    this.pasrsingMethod = "string" || "object";// строка или обьект, предпочтительно обьект
    this.arrayX = [];
    this.arrayY = [];
}

function defineParsingMethod(TwoDimensionalArrayName) {
    TwoDimensionalArrayName.pasrsingMethod = {
        startXElement : "",
        endXElement   : "" || number,
        startYElement : "",
        endYElement   : "" || number
    }
}
function universalParsing() {

    if (this.numberOfStrings == 1) {

        var onlyString = this.onlyString;

        this.arrayX.length = [];
        this.arrayY.length = [];

        var startXElement = this.pasrsingMethod.startXElement;
        var endXElement = this.pasrsingMethod.endXElement;
        var startYElement = this.pasrsingMethod.startYElement;
        var endYElement = this.pasrsingMethod.endYElement;

        var startIndex = startXElement+1 || 0;
        // «индекс начала элемента данных», присваиваем ему ноль или указаталь начала элемента х если он есть, поиск начнется с него ВКЛЮЧИТЕЛЬНО
        // +1 так как новый поиск начинается после использованного указателя
        var columnSwitch = false;
        // «выбор колонки» первая или вторая, то есть в игрек или в икс мы записываем данные

        if (endXElement.is)  {}
        var endIndex = onlyString.indexOf(endXElement, startIndex); sdfsfsd//может быть задан числом
        // «индекс конца элемента данных», присваиваем ему указатель конца элемента икс, то есть индекс на которм стоит указатель, элемент закончится на нем НЕВКЛЮЧИТЕЛЬНО
        var i = -1;
        // индекс, -1 так как в начале блока будет инкрементация и получится 0


        while ( (onlyString.length >= endIndex) && ~endIndex && ~startIndex) {//Stops on ~endIndex
            // парсим пока 1) длина единой строки больше или равна «индексу конца элемента данных»
            //          и  2) находится «индекс конца элемента данных»
            //          и  3) находится «индекс начала элемента данных»

            columnSwitch = !columnSwitch;
            // меняем массив для записи, в первый раз и будем записываем в икс (тру)

            if (columnSwitch) {
            // в зависимости от массива для записи у нас разные инструкции

                i++;
                //увеличиваем индекс, в первый раз он становится нулевым

                this.arrayX[i] = +onlyString.substring(startIndex, endIndex);
                //записываем данные в массив икс, включительно невключительно

                //теперь нужно определить индексы элемента для игрек (криво, лучше это перенести в блок для игрек а из него вставить в этот блок определение для икс, но изначально я сделал так, и это можно оставить)
                //начнем поиск начала игрек если он задан
                if (startYElement) {
                    startIndex = onlyString.indexOf( endIndex+1, startIndex);
                } else {//иначе парсим сразу после конца прошлогоэлеметна или конца! указателя конца прошлого элемента

                }
                startIndex = endIndex;//for y
                endIndex = onlyString.indexOf("\n", startIndex);// for y
                if (!(~endIndex)) endIndex = onlyString.length;//from 41

            }
            if (!columnSwitch) {
                arrayY[i] = +onlyString.substring(startIndex, endIndex);
                startIndex = ++endIndex;//for x
                endIndex = onlyString.indexOf("	", startIndex);//for x
            }
        }




    } else if (this.numberOfStrings == 2) {

    } else {
        throw Error;
    }
}

var arrayX = [];
var arrayY = [];
var currentLeftX, currentRightX, currentMax, currentMin;
function buildGraphic() {
	var graphicString = document.getElementById("textareaGraphicString").value;
	var graphicTypeString = graphicString.substring(0,5);
	var GrraphicTypeIndicator_1_1 = '"""St';
	var GrraphicTypeIndicator_1_2 = '"Stor';
	var GrraphicTypeIndicator_2_1 = 'Date:';
	arrayX.length = 0;
	arrayY.length = 0;

	var startIndex = 0;
	var columnSwitch = false;

	var endIndex = graphicString.indexOf("	", startIndex);
	var i = -1;
	while ( (graphicString.length >= endIndex) && ~endIndex && ~startIndex) {//Stops on ~endIndex	//from 41
		columnSwitch = !columnSwitch;
		if (columnSwitch) {
			i++;
			arrayX[i] = +graphicString.substring(startIndex, endIndex);
			while (graphicString.substring(endIndex, endIndex+1) =="	" || graphicString.substring(endIndex, endIndex+1) == "." ) {
				endIndex++;
			}
			startIndex = endIndex;//for y
			endIndex = graphicString.indexOf("\n", startIndex);// for y
			if (!(~endIndex)) endIndex = graphicString.length;//from 41

		}
		if (!columnSwitch) {
			arrayY[i] = +graphicString.substring(startIndex, endIndex);
			startIndex = ++endIndex;//for x
			endIndex = graphicString.indexOf("	", startIndex);//for x
		}
	}
	
	
	if (!arrayX.length || !arrayY.length) {
		alert("Array doesnt constructed!");
		return;
	}
	
	showGraphic(undefined, undefined, undefined, undefined);
}
function showGraphic(max, min, leftX, rightX ) {
	document.getElementById("graphic").width = document.getElementById("graphic").width;// redraw canvas



	var graphic_canvas = document.getElementById("graphic");
	var graphic_context = graphic_canvas.getContext("2d");
	
	var graphic_width = document.getElementById("graphic").width;
	var graphic_height = document.getElementById("graphic").height;

	if (!leftX && !(leftX===0) ) {
		var leftX = window.arrayX[0];
	}
	if (!rightX && !(rightX===0) ) {
		var rightX = arrayX[arrayX.length-1];
		rightX = (rightX - leftX)*1.04 + leftX;
	}

	if (!min) {
		var bottomY = 0;
	} else {
		var bottomY = min;
	}

	if (!max) {
		var topY = Math.max.apply(Math, arrayY);
		topY = (topY - bottomY)*1.04 + bottomY;
	} else {
		var topY = max;
	}

	var horizontalDiapason = arrayX[arrayX.length-1] - window.arrayX[0];

	var verticalDiapason = topY - bottomY;

	if ( !(leftX-rightX)  || !(topY-bottomY) ) {
		alert("You are suspicious, what do you want one more time? \n X_min = X_max ? \n Y_min=Y_max ? \n O_o");// \n x<sub>min</sub>=x<sub>max</sub>? \n y<sub>min</sub>=y<sub>max</sub> \n
		return;
	}
	currentLeftX = leftX;
	currentRightX = rightX;
	currentMax = topY;
	currentMin = bottomY;

	drawLines(graphic_context, graphic_height, graphic_width, leftX, (rightX - leftX), rightX, verticalDiapason, bottomY);
	drawGraphic(graphic_context, graphic_height, graphic_width, leftX, horizontalDiapason, rightX, verticalDiapason, bottomY);
	
}
function drawLines(graphic_context, graphic_height, graphic_width, leftX, horizontalDiapason, rightX, verticalDiapason, bottomY) {

	//vertical lines////////////////////////////////////////////////
	{
		graphic_context.moveTo(0, 0);
		graphic_context.lineTo(0, graphic_height);
		graphic_context.moveTo(graphic_width, 0);
		graphic_context.lineTo(graphic_width, graphic_height);

		var xBlackLines = blackLinesQuantity(horizontalDiapason);
		var xBlackStep = yBlackLinesStep(horizontalDiapason);
		var xGreyLinesInSpan = greykLinesQuantity(xBlackLines);
		var xGreyStep = xBlackStep / xGreyLinesInSpan;
		var xStep = Math.floor((rightX - leftX) / 50);
		var xMax = Math.floor(horizontalDiapason / xGreyStep);
		var oddXPiece = leftX % xBlackStep;

		for (var x = 1; x <= xMax+xGreyLinesInSpan; x ++) {//vertical lines
			graphic_context.moveTo( ( x * xGreyStep - oddXPiece ) / horizontalDiapason * graphic_width, 0             );
			graphic_context.lineTo( ( x * xGreyStep - oddXPiece ) / horizontalDiapason * graphic_width, graphic_height);

		}
	}//////////////////////////////////////////////////////////////

	//horizontal lines/////////////////////////////////////////////
	{	graphic_context.moveTo(0, 0);
		graphic_context.lineTo(graphic_width, 0);
		graphic_context.moveTo(0, graphic_height);
		graphic_context.lineTo(graphic_width, graphic_height);


		var yBlackLines = blackLinesQuantity(verticalDiapason);
		var yBlackStep = yBlackLinesStep(verticalDiapason);
		var yGreyLinesInSpan = greykLinesQuantity(yBlackLines);
		var yGreyStep = yBlackStep / yGreyLinesInSpan;
		var yLineInterval = 5;
		var yMax = Math.floor(verticalDiapason / yGreyStep);
		var oddYPiece = bottomY % yBlackStep;

		for (var y = 1; y <= yMax +yGreyLinesInSpan; y++) {//horizontal lines
			graphic_context.moveTo(0            , (graphic_height - (y * yGreyStep - oddYPiece) / verticalDiapason * graphic_height));
			graphic_context.lineTo(graphic_width, (graphic_height - (y * yGreyStep - oddYPiece) / verticalDiapason * graphic_height));
		}

		graphic_context.strokeStyle = "grey";
		graphic_context.stroke();
		graphic_context.beginPath();
	}////////////////////////////////////////////////////////////////////

	// yo use
	if (0) {
		ctx.fillStyle = "#00F";
		ctx.strokeStyle = "#F00";
		ctx.font = "italic 30pt Arial";
		ctx.fillText("Fill text", 20, 50);
		ctx.font = 'bold 30px sans-serif';
		ctx.strokeText("Stroke text", 20, 100);
	}
	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//writing numbers + black lines
	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	graphic_context.font = 'bold 15px Arial';
	var textIndent = 3;

	var xSpecialRound;
	var xMax = Math.floor( horizontalDiapason/ xBlackStep);

	for (var x = 0; x <= xMax+1; x++) {//vertical lines
		xSpecialRound = ( x * xBlackStep - oddXPiece );//strange but more precision = better result
		//graphic_context.fillText( (+xSpecialRound + leftX).toFixed( precision(xBlackStep) ), ( x * xBlackStep - oddXPiece ) / horizontalDiapason *graphic_width +textIndent, graphic_height -textIndent );
		graphic_context.fillText( "blabla", ( x * xBlackStep - oddXPiece ) / horizontalDiapason *graphic_width +textIndent, graphic_height -textIndent );

		graphic_context.moveTo( ( x * xBlackStep - oddXPiece ) / horizontalDiapason *graphic_width, 0);
		graphic_context.lineTo( ( x * xBlackStep - oddXPiece ) / horizontalDiapason *graphic_width, graphic_height );
	}
	graphic_context.strokeStyle = "#000";
	graphic_context.stroke();
	graphic_context.beginPath();

	//=====================================================================================================================

	var yNumInterval = 10;
	var specialRound;
	var yMax = Math.floor( verticalDiapason/ yBlackStep);
	for (var y = 1; y <= yMax+1; y++) {//horizontal lines
		specialRound = (y * yBlackStep - oddYPiece);//strange but more precision = better result
		graphic_context.fillText((specialRound*1 + bottomY).toFixed( precision(yBlackStep) ), 0 +textIndent, (graphic_height - (y * yBlackStep - oddYPiece) / verticalDiapason *graphic_height) -textIndent );
		graphic_context.moveTo(0, (graphic_height - (y * yBlackStep - oddYPiece) / verticalDiapason *graphic_height) );
		graphic_context.lineTo(graphic_width, (graphic_height - (y * yBlackStep - oddYPiece)/ verticalDiapason *graphic_height) );
	}

	graphic_context.strokeStyle = "black";
	graphic_context.stroke();
	graphic_context.beginPath();
	//=====================================================================================================================

}
function drawGraphic(graphic_context, graphic_height, graphic_width, leftX, horizontalDiapason, rightX, verticalDiapason, bottomY) {

	//graphic_context.moveTo( (arrayX[0]-leftX)/(rightX-leftX)*graphic_width , graphic_height);

	var element = -666;
	var newElement = 0;
	for (var x = 1; x < graphic_width; x++ ) {
		//graphic_context.lineTo( ( ( x*horizontalDiapason/(rightX-leftX) )+( (arrayX[0]-leftX)/(rightX-leftX)*graphic_width ) ) , graphic_height-( ( ( arrayY[ Math.floor(  x/graphic_width*(arrayY.length -1)) ] - bottomY) / (  verticalDiapason ) *graphic_height)+1) );
		newElement = Math.floor(  x/(graphic_width-1)*(arrayY.length -1));
		if (newElement !== element) {
			graphic_context.lineTo(( ( x * horizontalDiapason / (rightX - leftX) ) + ( (arrayX[0] - leftX) / (rightX - leftX) * graphic_width ) ), graphic_height - ( ( ( arrayY[Math.floor(x / (graphic_width - 1) * (arrayY.length - 1))] - bottomY) / (  verticalDiapason ) * graphic_height) + 1));
			element = newElement;
		}
	}

	graphic_context.strokeStyle = "#00f";
	graphic_context.lineWidth = 2;
	graphic_context.stroke();
	graphic_context.beginPath();
}
var xNewInterpolation ={};
function calcXNewEnd() {
	var start = +document.getElementById("xNewStart").value;
	var step = +document.getElementById("xNewStep").value;
	var steps = +document.getElementById("xNewSteps").value;
	var end = start + step*steps;
	document.getElementById("xNewEnd").innerHTML = "x<sub>new<sub>end</sub></sub> = " + end;
	xNewInterpolation = {
		start : start,
		step : step,
		steps : steps,
		end : end
	}
}

function interpolation() {
	//arrayY
	//arrayX

	var arrayXNew = [xNewInterpolation.start];
	var value = xNewInterpolation.start;
	for (var i = 1; i <= xNewInterpolation.steps; i++) {
		value += xNewInterpolation.step;
		//arrayXNew.push(xNewInterpolation.start + xNewInterpolation.step*i);
		arrayXNew.push( value.toPrecision(4) );
	}
	//creating new y array
	var arrayYNew = [];
	var j = 0;
	for (var i = 0; i < arrayXNew.length; i++) {
		//looking for x initial lower than x new


		var x_lower = arrayX[j];

		while(arrayX[j] <= arrayXNew[i]) {
			x_lower = arrayX[j];
			j++;
		}
		j--;
		var y_lower = arrayY[j];
		if (j < arrayX.length-1) {
			var x_upper = arrayX[j+1];
			var y_upper = arrayY[j+1];
			arrayYNew.push( y_lower + (y_upper - y_lower)*(arrayXNew[i] - x_lower)/(x_upper - x_lower) );
		} else {
			alert('End of diapason');
			var x_upper = arrayX[j];
			var y_upper = arrayY[j];
			arrayYNew.push( y_lower);
		}

	}

	window.arrayYNew = arrayYNew;
	window.arrayXNew = arrayXNew;
	window.arrayY = arrayYNew;
	window.arrayX = arrayXNew;
	showGraphic(undefined, undefined, undefined, undefined);
	alert(arrayXNew);
	alert(arrayYNew);

	document.getElementById("textareaXNewArray").innerHTML = arrayXNew.toString().replace(/,/g, "\n");
	document.getElementById("textareaYNewArray").innerHTML = arrayYNew.toString().replace(/,/g, "\n");
}
function getMinimumValue() {
debugger;
	var xLeft  = +document.getElementById("xLeftMinimumValue").value;
	var xRight = +document.getElementById("xRightMinimumValue").value;
	var indexXLeft, indexXRight;

	var i = 0;
	while(xLeft > arrayX[i]) {
		i++;
	}
	indexXLeft = i;

	i = 0;
	while(xRight >= arrayX[i]) {
		i++;
	}
	//i--; we ll use slice
	indexXRight = i;

	var minimum = Math.min.apply( Math, arrayY.slice(indexXLeft, indexXRight));
	console.log(minimum);
	document.getElementById("minimumValue").innerHTML = "y<sub>min</sub> = " + minimum;
}
function getMaximumValue() {

	var xLeft  = +document.getElementById("xLeftMaximumValue").value;
	var xRight = +document.getElementById("xRightMaximumValue").value;
	var indexXLeft, indexXRight;

	var i = 0;
	while(xLeft > arrayX[i]) {
		i++;
	}
	indexXLeft = i;

	i = 0;
	while(xRight > arrayX[i]) {
		i++;
	}
	//i--; we ll use slice
	indexXRight = i;

	var maximum = Math.max.apply( Math, arrayY.slice(indexXLeft, indexXRight));
	console.log(maximum);
	document.getElementById("maximumValue").innerHTML = "y<sub>max</sub> = " + maximum;
}
function getYExactValue() {

	var xExact  = +document.getElementById("xExactValueInput").value;
	var indexXLeft, indexXRight;

	var i = 0;
	while(xExact > arrayX[i]) {
		i++;
	}
	i--;
	indexXLeft = i;

	i = 0;
	while(xExact > arrayX[i]) {
		i++;
	}
	//i--; we ll use slice
	indexXRight = i;

	var x_lower = arrayX[indexXLeft];
	var x_upper = arrayX[indexXRight];
	var y_lower = arrayY[indexXLeft];
	var y_upper = arrayY[indexXRight];

	var exact = y_lower + (y_upper - y_lower)*(xExact - x_lower)/(x_upper - x_lower);

	console.log(exact);
	document.getElementById("yExactValueOutput").innerHTML = "y<sub>exact</sub> = " + exact;
}
function getXExactValue() {

	//работает по ближайшей точке, поэтому могут быть ошибки, например точка ч знач 3 ближе к 50 чем 100, но среднюю току не найдет (нет интерпляции,
	//интерполяция есть но она охватывает только соседнюю точку от ближайшей.
	/*для неплотных массивов получаеться бред и впрочих случаях (если это щначение не находится в заданном диапазоне )
	1 1
	2 2
	3 3
	4 3
	5 2
	6 3
	7 100
	8 100*/
	//нужно переделать и не искать ближаюшую тчку и тп а искать две точки между которыми нах-ся наша, кроме этого
	// заодно мождно будет ловить ошибку и говорить пользвателю что в диапазоне нет точки такой
	var yExact  = +document.getElementById("yExactValueInput").value;
	var xLeft  = +document.getElementById("xLeftExactValueInput").value;
	var xRight = +document.getElementById("xRightExactValueInput").value;

	var indexXLeft, indexXRight;

	var i = 0;
	while(xLeft > arrayX[i]) {
		i++;
	}
	indexXLeft = i;

	i = 0;
	while(xRight > arrayX[i]) {
		i++;
	}
	//i--; we ll use slice
	indexXRight = i;

	var difference = Math.abs(arrayY[indexXLeft] - yExact);

	i = indexXLeft;

	while (i <= indexXRight) {
		if (difference >=  Math.abs(arrayY[i] - yExact)) {
			difference = Math.abs(arrayY[i] - yExact);
			var indexMin = i;
		}
		i++;
	}
	//i--;
	i = indexMin;
	var difference0 = Math.abs(arrayY[i-1] - yExact);
	var difference2 = Math.abs(arrayY[i+1] - yExact);


	if (difference0 < difference2) {
		indexXLeft  = i-1;
		indexXRight = i;
	} else if (difference0 > difference2) {
		indexXLeft = i;
		indexXRight = i+1;
	} else if (difference0 = difference2) {
		//indexXLeft = i;
		//indexXRight = i;
		exact = arrayX[i];
		console.log(exact);
		document.getElementById("xExactValueOutput").innerHTML = "x<sub>exact</sub> = " + exact;
		return exact;
	}




	var x_lower = arrayX[indexXLeft];
	var x_upper = arrayX[indexXRight];
	var y_lower = arrayY[indexXLeft];
	var y_upper = arrayY[indexXRight];

	//var exact = y_lower + (y_upper - y_lower)*(xExact - x_lower)/(x_upper - x_lower);
	if (y_upper === y_lower) {
		var exact = x_lower + (x_upper - x_lower)/2;
		console.log(exact);
		document.getElementById("xExactValueOutput").innerHTML = "x<sub>exact</sub> = " + exact;
		return exact;
	}
	var exact = x_lower + (x_upper - x_lower)*(yExact - y_lower)/(y_upper - y_lower);

	console.log(exact);
	document.getElementById("xExactValueOutput").innerHTML = "x<sub>exact</sub> = " + exact;
	return exact;
}
function getSteepnessValue() {
	var steepnessRadioArr = document.getElementsByName("steepnessRadio");

	if (steepnessRadioArr[0].checked) {
		document.getElementById("yExactValueInput").value = "0.10";
	} else if (steepnessRadioArr[1].checked) {
		document.getElementById("yExactValueInput").value = "10";
	}
	document.getElementById("xLeftExactValueInput").value = document.getElementById("xLeftSteepnessInput").value;
	document.getElementById("xRightExactValueInput").value = document.getElementById("xRightSteepnessInput").value;

	var x10 = getXExactValue();
	document.getElementById("x10ValueOutput").innerHTML ="x<sub>10%</sub> = " + x10;

	if (steepnessRadioArr[0].checked) {
		document.getElementById("yExactValueInput").value = "0.50";
	} else if (steepnessRadioArr[1].checked) {
		document.getElementById("yExactValueInput").value = "50";
	}
	var x50 = getXExactValue();
	document.getElementById("x50ValueOutput").innerHTML = "x<sub>50%</sub> = " + x50;

	var result = +x10/ +x50;
	document.getElementById("xSteepnessValueOutput").innerHTML = "y<sub>10%</sub>/y<sub>50%</sub> = " + result;
	return result;

}
function getAverage() {

	var xLeft  = +document.getElementById("xLeftAverage").value;
	var xRight = +document.getElementById("xRightAverage").value;
	var indexXLeft, indexXRight;

	var i = 0;
	while(xLeft > arrayX[i]) {
		i++;
	}
	indexXLeft = i;

	i = 0;
	while(xRight > arrayX[i]) {
		i++;
	}
	//i--; we ll use slice
	indexXRight = i;


	var sum = 0;
	var quantity = 0;
	for (var i = indexXLeft; i <= indexXRight; i++) {
		sum += arrayY[i];
		quantity++;
	}
	var result = sum / quantity;
	document.getElementById("averageValue").innerHTML = "Average = " + result;
	return result;
}
// I dont use it, its a clone
function changeGraphicVerticalDiapason(max, min, leftX, rightX) {


	if(arrayX.length == 0) {
		alert("First you need to create a data array!\nLoad data and push \"Go! \"");
		return;
	}
	showGraphic(max, min, leftX, rightX);
}
function changeGraphicVerticalDiapasonChangeable() {
	max =  document.getElementById('maxY').value;
	showGraphic(max, 0, 0);
}
function changeCaption() {

		document.getElementById("yCaption").innerHTML = document.getElementById("yChangeCaption").value;
		document.getElementById("xCaption").innerHTML = document.getElementById("xChangeCaption").value;

}
function changeLeftRightX(max, min, leftX, rightX) {

	/*if (!(leftX-rightX) || !(max-min) ) {
		alert("You are suspicious, what do you want one more time?");
		return;
	}*/ // я перенес это в след функцию = глубже
	if(arrayX.length == 0) {
		alert("First you need to create a data array!\nLoad data and push \"Go! \"");
		return;
	}

	showGraphic(max, min, leftX, rightX);
}
function showRectangle(max, min, leftX, rightX) {

	if(arrayX.length == 0) {
		alert("First you need to create a data array!\nLoad data and push \"Go! \"");
		return;
	}
	//improve edges
	if(0) {
		//Improve Edges Y//////////////////////////////////////


		var yDifference = max - min;
		var reverseMultiplier = 1;

		if (yDifference < 0) yDifference *= -1;
		if (!yDifference) return;

		while (yDifference < 1) {
			yDifference *= 10;
			reverseMultiplier /= 10;
		}
		while (yDifference >= 10) {
			yDifference /= 10;
			reverseMultiplier *= 10;
		}
		max = Math.ceil(max / reverseMultiplier * 10) * reverseMultiplier / 10;
		document.getElementById('maxY').value = max;
		min = Math.floor(min / reverseMultiplier * 10) * reverseMultiplier / 10;
		document.getElementById('minY').value = min;

		///////////////////////////////////////////////////////
		//Improve Edges X//////////////////////////////////////


		var xDifference = rightX - leftX;
		var reverseMultiplier = 1;

		if (xDifference < 0) xDifference *= -1;
		if (!xDifference) return;

		while (xDifference < 1) {
			xDifference *= 10;
			reverseMultiplier /= 10;
		}
		while (xDifference >= 10) {
			xDifference /= 10;
			reverseMultiplier *= 10;
		}
		rightX = Math.ceil(rightX / reverseMultiplier * 10) * reverseMultiplier / 10;
		document.getElementById('rightX').value = rightX;
		leftX = Math.floor(leftX / reverseMultiplier * 10) * reverseMultiplier / 10;
		document.getElementById('leftX').value = leftX;

		///////////////////////////////////////////////////////
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
		alert("You are suspicious, what do you want one more time?");
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
	//fillRect(x,y,width,height) - рисует заполненный прямоугольник
	graphic_context.fillStyle = "red";
	graphic_context.fillRect( canvasLeftX, canvasTopY, canvasRectWidth, canvasRectHeight );

	/* setTimeout(foo, delay, param1, param2, paramN);

	foo - вызываемая функция (!)без круглых скобок и кавычек
	delay - задержка
	param1-paramN - передаваемые параметры.
	*/

	setTimeout( changeLeftRightX, 500, +document.getElementById('maxY').value,
		+document.getElementById('minY').value, +document.getElementById('leftX').value, +document.getElementById('rightX').value);
	setTimeout(redraw, 500);


}
function blackLinesQuantity(axisMaxValue) {
	axisMaxValue = +axisMaxValue;
	if (axisMaxValue<0) axisMaxValue *= -1;
	if (!axisMaxValue) return;
	while (axisMaxValue<1) {
		axisMaxValue *= 10;
	}
	while (axisMaxValue >= 10) {
		axisMaxValue /= 10;
	}
	if (1<= axisMaxValue && axisMaxValue <= 3) axisMaxValue *= 5;

	return Math.floor(axisMaxValue);
}
function greykLinesQuantity(blackLines) {
	if (blackLines>=4) return 2;
	if (blackLines>2) return 5;
	if (blackLines>=1) return 10;
	return;
}

function yBlackLinesStep(axisMaxValue) {
	axisMaxValue = +axisMaxValue;
	var multiplier = 1;
	if (axisMaxValue<0) axisMaxValue *= -1;
	var changedAxisMaxValue = axisMaxValue;
	if (!changedAxisMaxValue) return;
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
function redraw() {document.getElementById("glassForGraphic").width = document.getElementById("glassForGraphic").width;}

function download() {
	var canvas = document.getElementById("graphic");
	window.open(canvas.toDataURL("image/png"), "mywindow");
}

/////////////////////////////////////////////////////////////////////////
var canvasLive;
var contextLive;
var firstCanvasX, firstCanvasY,
	secondCanvasX, secondCanvasY;

window.onload = function() {
	canvasLive = document.getElementById("glassForGraphic");
	contextLive = canvasLive.getContext("2d");

	// Подключаем требуемые для рисования события
	canvasLive.onmousedown = startDrawing;
	canvasLive.onmouseup = stopDrawing;
	window.onmouseup = stopDrawing;
	//canvasLive.onmouseout = stopDrawing;
	canvasLive.onmousemove = draw;
};

var isDrawing = false;
function startDrawing(e) {
	// Начинаем рисовать
	isDrawing = true;

	// Создаем новый путь (с текущим цветом и толщиной линии)
	////context2.beginPath();
	//context.beginPath();

	// Нажатием левой кнопки мыши помещаем "кисть" на холст
	////context2.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
	firstCanvasX = e.pageX - canvasLive.offsetLeft;
	firstCanvasY = e.pageY - canvasLive.offsetTop;
	////context2.lineWidth = 5;
}
function draw(e) {
	if (isDrawing == true)
	{
		// Определяем текущие координаты указателя мыши
		var x = e.pageX - canvasLive.offsetLeft;
		var y = e.pageY - canvasLive.offsetTop;
		contextLive.fillStyle = "green";
		contextLive.clearRect(0,0, canvasLive.width, canvasLive.height);
		contextLive.fillRect(firstCanvasX, firstCanvasY, (x-firstCanvasX), (y-firstCanvasY) );


	}
}
function stopDrawing(e) {

	//I added it
	if (isDrawing) {

		secondCanvasX = e.pageX - canvasLive.offsetLeft;
		secondCanvasY = e.pageY - canvasLive.offsetTop;
		document.getElementById('leftX').value = currentLeftX + ( firstCanvasX < secondCanvasX ? firstCanvasX : secondCanvasX ) / canvasLive.width * (currentRightX - currentLeftX);
		document.getElementById('rightX').value = currentLeftX + ( firstCanvasX > secondCanvasX ? firstCanvasX : secondCanvasX ) / canvasLive.width * (currentRightX - currentLeftX);

		document.getElementById('minY').value = currentMin + ((canvasLive.height- ( firstCanvasY > secondCanvasY ? firstCanvasY : secondCanvasY )) / canvasLive.height ) * (currentMax - currentMin);
		document.getElementById('maxY').value = currentMin + ((canvasLive.height- ( firstCanvasY < secondCanvasY ? firstCanvasY : secondCanvasY )) / canvasLive.height ) * (currentMax - currentMin);

		showRectangle(
			+document.getElementById('maxY').value,
			+document.getElementById('minY').value,
			+document.getElementById('leftX').value,
			+document.getElementById('rightX').value
		)
	}
	isDrawing = false;
}

function hideShowDiv(divId){

    $(divId).toggle('slow');
}
