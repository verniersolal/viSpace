function drawAxe(data, isVertical, isLog, boundingBox) {
    return (isVertical ? d3.axisLeft(getScale(data, isVertical, isLog, boundingBox)).ticks(5) : d3.axisBottom(getScale(data, isVertical, isLog, boundingBox)).ticks(5));
}
function drawparallelCoordinar(data){
    var svg = d3.select('#svg' + data['position']);
    var gContainer = svg.append("g");

					// Axis
					var n=4;
					var scales = [];
					var axis = [];
					var gAxis = [];

					for(i=0;i<n;i++){

						scales[i] = d3.scaleLinear();
						scales[i].domain([d3.min(data, function(d) { return d.values[i]; }),d3.max(data, function(d) { return d.values[i]; })]);
    					scales[i].range([500,0]);

						axis[i] = d3.axisLeft(scales[i]);

					}
}
function drawLinearChart(data) {
    let svg = d3.select('#svg' + data['position']);
    var boundingBox = $('#card' + data['position']).get(0).getBoundingClientRect();
    console.log("init bounding box", boundingBox);
    let gContainer = svg.append('g');
    gContainer.attr('id', 'gContainer' + data['position']);
    let gAxisX = gContainer.append('g');
    gAxisX.attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.8 * boundingBox.height) + ")");
    let gAxisY = gContainer.append('g');
    gAxisY.attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.03 * boundingBox.height) + ")");
    gAxisX.call(drawAxe(data['axe_x']['values'], false, data['isLog_x'], boundingBox));
    gAxisY.call(drawAxe(data['axe_y']['values'], true, data['isLog_y'], boundingBox));
    var color = parseInt(Math.random() * 10);
    let xy = [];
    for(var i = 0; i< data["axe_x"]['values'].length; i++){
        xy.push({x:data['axe_x']["values"][i], y: data['axe_y']['values'][i]});
    }
    let scale_x = getScale(data['axe_x']['values'],false, data['isLog_x'], boundingBox);
    let scale_y = getScale(data['axe_y']['values'], true, data['isLog_y'], boundingBox);
    let lineValue = d3.line();
    lineValue.x(function (d) {
        return scale_x(parseFloat(d.x));
    });
    lineValue.y(function (d) {
        return scale_y(parseFloat(d.y));
    });
    lineValue.curve(d3.curveMonotoneX);
    let gLine = gContainer.append('g');

    let line = gLine.append('path');
    line.attr("d", lineValue(xy));
    line.attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + ", 50)");
    line.attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.03 * boundingBox.height) + ")");
    line.attr("stroke", d3.schemeCategory10[color]);
    line.attr("fill", "none");
    line.attr("stroke-width", 3);
}

function getScale(data, isVertical, isLog, boundingBox) {
    console.log(boundingBox);
    let scaleAxe = (isLog ? d3.scaleLog() : d3.scaleLinear());
    scaleAxe.domain([d3.min(data), d3.max(data)]);
    isVertical ? scaleAxe.range([parseFloat(0.77 * boundingBox.height), 0]) : scaleAxe.range([0, parseFloat(0.8 * boundingBox.width)]);

    return scaleAxe;
}

function drawPointCloud(data) {
    let svg = d3.select('#svg' + data['position']);
    var boundingBox = $('#card' + data['position']).get(0).getBoundingClientRect();
    console.log("init bounding box", boundingBox);
    let gContainer = svg.append('g');
    gContainer.attr('id', 'gContainer' + data['position']);
    let gAxisX = gContainer.append('g');
    gAxisX.attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.8 * boundingBox.height) + ")");
    let gAxisY = gContainer.append('g');
    gAxisY.attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.03 * boundingBox.height) + ")");
    gAxisX.call(drawAxe(data['axe_x']['values'], false, data['isLog_x'], boundingBox));
    gAxisY.call(drawAxe(data['axe_y']['values'], true, data['isLog_y'], boundingBox));
    var color = parseInt(Math.random() * 10);
    var scale_x = getScale(data['axe_x']['values'], false, data['isLog_x'], boundingBox);
    var scale_y = getScale(data['axe_y']['values'], true, data['isLog_y'], boundingBox);
    let gcircle = gContainer.append("g");
    for (let i = 0; i < data['axe_x']['values'].length; i++) {
        let circle = gcircle.append("circle");
        circle.attr("cx", scale_x(data['axe_x']['values'][i]))
            .attr("cy", scale_y(data['axe_y']['values'][i]))
            .attr("r", 2)
            .attr("fill", d3.schemeCategory10[color])
            .attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + ", 50)")
            .attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.03 * boundingBox.height) + ")");
    }
}
