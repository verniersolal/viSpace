function drawAxe(min, max, isVertical, isLog, boundingBox) {
    return (isVertical ? d3v5.axisLeft(getScale(min, max, isVertical, isLog, boundingBox)).ticks(5) : d3v5.axisBottom(getScale(min, max, isVertical, isLog, boundingBox)).ticks(5));
}

function createSvg(nbChart) {
    let graphDiv = d3v5.select("#displayGraph");
    graphDiv
        .append('div')
        .attr('id', 'graph' + nbChart)
        .classed('col m12', true)
        .append('svg')
        .attr('id', 'svg' + nbChart)
        .classed('svg', true);
}

function drawChart(data, nbChart, minAndMax) {
    createSvg(nbChart);
    switch (data['chartType']) {
        case 'linearChart':
            drawLinearChart(nbChart, data, minAndMax);
            break;
        case 'pointCloud':
            drawPointCloud(nbChart, data, minAndMax);
            break;
    }

}

function drawOrthogonalAxis(gContainer, boundingBox, isLog, minAndMax) {
    let gAxisX = gContainer
        .append('g')
        .attr("transform", "translate(" + parseFloat(0.3 * boundingBox.width) + "," + parseFloat(0.8 * boundingBox.height) + ")");
    let gAxisY = gContainer
        .append('g')
        .attr("transform", "translate(" + parseFloat(0.3 * boundingBox.width) + "," + parseFloat(0.03 * boundingBox.height) + ")");

    gAxisX.call(drawAxe(minAndMax.xmin, minAndMax.xmax, false, isLog, boundingBox));
    gAxisY.call(drawAxe(minAndMax.ymin, minAndMax.ymax, true, isLog, boundingBox));
}

function zipData(x, y) {
    return x.map((e, i) => ({x: e, y: y[i]}));
}

function drawLinearChart(nbChart, data, minAndMax) {
    let svg = d3v5.select('#svg' + nbChart);
    let boundingBox = svg.node().getBoundingClientRect();
    let gContainer = svg
        .append('g')
        .attr('id', 'gContainer' + nbChart);
    drawOrthogonalAxis(gContainer, boundingBox, data['isLog'], minAndMax);

    data['models'].forEach((model, index) => {
        let xy = zipData(model['x_data'], model['y_data']);
    console.log("index", index);
    let scale_x = getScale(minAndMax.xmin, minAndMax.xmax, false, data['isLog'], boundingBox);
    let scale_y = getScale(minAndMax.ymin, minAndMax.ymax, true, data['isLog'], boundingBox);
    let lineValue = d3v5.line();
    lineValue.x(function (d) {
        return scale_x(parseFloat(d.x));
    });
    lineValue.y(function (d) {
        return scale_y(parseFloat(d.y));
    });
    lineValue.curve(d3v5.curveMonotoneX);
    gContainer
        .append('g')
        .append('path')
        .attr("d", lineValue(xy))
        .attr("transform", "translate(" + parseFloat(0.3 * boundingBox.width) + ", 50)")
        .attr("transform", "translate(" + parseFloat(0.3 * boundingBox.width) + "," + parseFloat(0.03 * boundingBox.height) + ")")
        .attr("stroke", d3v5.schemeCategory10[index])
        .attr("fill", "none")
        .attr("stroke-width", 3);
    gContainer.append('g')
        .append('rect')
        .attr('x',parseFloat(0.02*boundingBox.width))
        .attr('y', parseFloat(0.1*(index+1)*boundingBox.height))
        .attr('width', 20)
        .attr('height', 20)
        .style("fill", d3v5.schemeCategory10[index]);
    gContainer.append('text')
        .attr("x", parseFloat(0.05*boundingBox.width))
        .attr("y", parseFloat(0.1*(index+1.35)*boundingBox.height))
        .attr('font-size', "15px")
        .text(data['model_name'][index]);
});

    svg.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('transform', 'translate(' + parseFloat(boundingBox.width * 0.25) + ',' + parseFloat(boundingBox.height / 2) + ') rotate(-90)')
        .style("text-anchor", "middle")
        .attr('fill', 'black')
        .text(data['axe_y']);

    svg.append('text')
        .attr('x', parseFloat((boundingBox.width / 2)+100))
        .attr('y', boundingBox.height * 0.95)
        .style("text-anchor", "middle")
        .attr('fill', 'black ')
        .text(data['axe_x']);
}

function getScale(min, max, isVertical, isLog, boundingBox) {
    console.log(isLog);
    let scaleAxe = isLog===true ? d3v5.scaleLog() : d3v5.scaleLinear();
    console.log(scaleAxe);
    scaleAxe.domain([min, max]);
    isVertical ? scaleAxe.range([parseFloat(0.77 * boundingBox.height), 0]) : scaleAxe.range([0, parseFloat(0.65*boundingBox.width)]);

    return scaleAxe;
}

function drawPointCloud(nbChart, data, minAndMax) {
    let svg = d3v5.select('#svg' + nbChart);
    let boundingBox = svg.node().getBoundingClientRect();
    let gContainer = svg
        .append('g')
        .attr('id', 'gContainer' + nbChart);

    drawOrthogonalAxis(gContainer, boundingBox, data['models']['isLog'], minAndMax);

    let scale_x = getScale(minAndMax.xmin, minAndMax.xmax, false, data['isLog'], boundingBox);
    let scale_y = getScale(minAndMax.ymin, minAndMax.ymax, true, data['isLog'], boundingBox);
    let gcircle = gContainer.append("g");
    let value_x = function(d){return d.x};
    let value_y = function(d){return d.y};
    data['models'].forEach((data, index) => {
        let xy = zipData(data['x_data'], data['y_data']);
        gcircle.selectAll(".dot")
            .data(xy)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('r', 2)
            .attr('cx', function(d){ return scale_x(value_x(d))})
            .attr('cy', function(d){ return scale_y(value_y(d))})
            .attr("fill", d3v5.schemeCategory10[index])
            .attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + ", 50)")
            .attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.03 * boundingBox.height) + ")");

    });
    svg.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('transform', 'translate(' + parseFloat(boundingBox.width * 0.033) + ',' + parseFloat(boundingBox.height / 2) + ') rotate(-90)')
        .style("text-anchor", "middle")
        .attr('fill', 'black')
        .text(data['axe_y']);

    svg.append('text')
        .attr('x', parseFloat(boundingBox.width / 2))
        .attr('y', boundingBox.height * 0.95)
        .style("text-anchor", "middle")
        .attr('fill', 'black')
        .text(data['axe_x']);
}

function drawparallelCoordinar(data, nbchart) {

    let graphDiv = d3v5.select("#displayGraph");
    graphDiv
        .append('div')
        .attr('class','col m12')
        .append('div')
        .attr('class', 'parcoords svg')
        .attr('id', 'cp'+nbchart);
    console.log(data);
    var colors = d3v3.scale.category20b()
        .range(['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f']);
    var pc2 = d3v3.parcoords()("#cp"+nbchart);

        pc2
            .data(data['data'])
            .color(function(d){return colors(d.famille);})
            .alpha(0.25)
            .mode("queue")
            .render()
            .reorderable();
}