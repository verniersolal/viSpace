function drawAxe(data, isVertical, isLog, boundingBox) {
    return (isVertical ? d3.axisLeft(getScale(data, isVertical, isLog, boundingBox)).ticks(5) : d3.axisBottom(getScale(data, isVertical, isLog, boundingBox)).ticks(5));
}

/*function drawLinearChart(data) {
    let svg = d3.select('#svg' + data['position']);
    let svgHeight = parseInt($('#svg'+ data['position']).outerHeight());
    let svgWidth = parseInt($('#svg' + data['position']).outerWidth());
    console.log(svgWidth);
    let gContainer = svg.append('g');
    let gAxisX = gContainer.append('g');
    gAxisX.attr("transform", "translate(80,200)");

    let gAxisY = gContainer.append('g');
    gAxisY.attr("transform", "translate(80,50)");
    gAxisX.call(drawAxe(data['axe_x']['values'], false, data['isLog_x']));
    gAxisY.call(drawAxe(data['axe_y']['values'], true, data['isLog_y']));
    let lineValue = d3.line();
    lineValue.x(function (d) {
        return getScale()(parseFloat(data['axe_x']['values']));
    });
    lineValue.y(function (d) {
        return getScale(data['axe_y'])(parseFloat(d['axe_y']['values']));
    });
    lineValue.curve(d3.curveMonotoneX);
    let gLine = gContainer.append('g');

    let line = gLine.append('path');
    line.attr("d", lineValue(xy));
    line.attr("transform", "translate(50,10)");
    line.attr("stroke", "red");
    line.attr("fill", "none");
    line.attr("stroke-opacity", 2);
}*/

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
    let gcircle = gContainer.append("g");
    for (let i = 0; i < data['axe_x']['values'].length; i++) {
        let circle = gcircle.append("circle");
        circle.attr("cx", getScale(data['axe_x']['values'], false, data['isLog_x'], boundingBox)(data['axe_x']['values'][i]))
            .attr("cy", getScale(data['axe_y']['values'], true, data['isLog_y'], boundingBox)(data['axe_y']['values'][i]))
            .attr("r", 3)
            .attr("fill", d3.schemeCategory10[color])
            .attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + ", 50)")
            .attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.03 * boundingBox.height) + ")");
    }
}
