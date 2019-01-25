

function drawAxe(min,max, isVertical, isLog, boundingBox) {
    return (isVertical ? d3.axisLeft(getScale(min,max, isVertical, isLog, boundingBox)).ticks(5) : d3.axisBottom(getScale(min,max, isVertical, isLog, boundingBox)).ticks(5));
}

function drawLinearChart(position, data, xmin, xmax, ymin, ymax) {
    let svg = d3.select('#svg' + position);
    var boundingBox = $('#card' + position).get(0).getBoundingClientRect();
    let gContainer = svg.append('g');
    gContainer.attr('id', 'gContainer' +position);
    let gAxisX = gContainer.append('g');
    gAxisX.attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.8 * boundingBox.height) + ")");
    let gAxisY = gContainer.append('g');
    gAxisY.attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.03 * boundingBox.height) + ")");
    gAxisX.call(drawAxe(xmin, xmax, false, data['isLog_x'], boundingBox));
    gAxisY.call(drawAxe(ymin,ymax, true, data['isLog_y'], boundingBox));
    var color = parseInt(Math.random() * 10);
    let xy = [];
    for(var i = 0; i< data["x_data"].length; i++){
        xy.push({x:data['x_data'][i], y: data['y_data'][i]});
    }
    let scale_x = getScale(xmin,xmax,false, data['isLog_x'], boundingBox);
    let scale_y = getScale(ymin,ymax, true, data['isLog_y'], boundingBox);
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
    svg.append('text')
        .attr('x',0)
        .attr('y', 0)
        .attr('transform', 'translate('+parseFloat(boundingBox.width*0.033)+','+parseFloat(boundingBox.height / 2)+') rotate(-90)')
        .style("text-anchor", "middle")
        .attr('fill', 'white')
        .text("titi");

    svg.append('text')
        .attr('x',parseFloat(boundingBox.width/2))
        .attr('y', boundingBox.height*0.95)
        .style("text-anchor", "middle")
        .attr('fill', 'white')
        .text("toto");
}

function getScale(min,max, isVertical, isLog, boundingBox) {
    let scaleAxe = (isLog ? d3.scaleLog() : d3.scaleLinear());
    scaleAxe.domain([min, max]);
    isVertical ? scaleAxe.range([parseFloat(0.77 * boundingBox.height), 0]) : scaleAxe.range([0, parseFloat(0.8 * boundingBox.width)]);

    return scaleAxe;
}

function drawPointCloud(data) {
    let svg = d3.select('#svg' + data['position']);
    var boundingBox = $('#card' + data['position']).get(0).getBoundingClientRect();
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
    svg.append('text')
        .attr('x',0)
        .attr('y', 0)
        .attr('transform', 'translate('+parseFloat(boundingBox.width*0.033)+','+parseFloat(boundingBox.height / 2)+') rotate(-90)')
        .style("text-anchor", "middle")
        .attr('fill', 'white')
        .text(data['axe_y']['name']);

    svg.append('text')
        .attr('x',parseFloat(boundingBox.width/2))
        .attr('y', boundingBox.height*0.95)
        .style("text-anchor", "middle")
        .attr('fill', 'white')
        .text(data['axe_x']['name']);
}
