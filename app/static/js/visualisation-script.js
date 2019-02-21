function drawAxe(min, max, isVertical, isLog, boundingBox) {
    return (isVertical ? d3.axisLeft(getScale(min, max, isVertical, isLog, boundingBox)).ticks(5) : d3.axisBottom(getScale(min, max, isVertical, isLog, boundingBox)).ticks(5));
}

function createSvg(nbChart) {
    let graphDiv = d3.select("#displayGraph");
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
function drawparallelCoordinar(data) {
    console.log("parallele");
    $('.parcoords').css('width', 1000).css('height', 500);
    var pc2 = d3.parcoords()("#parcoords");
    pc2
        .data(data)
        .color("#000")
        .alpha(0.2)
        .margin({top: 24, left: 0, bottom: 12, right: 0})
        .render()
        .reorderable();
}

function drawOrthogonalAxis(gContainer, boundingBox, isLog, minAndMax) {
    let gAxisX = gContainer
        .append('g')
        .attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.8 * boundingBox.height) + ")");
    let gAxisY = gContainer
        .append('g')
        .attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.03 * boundingBox.height) + ")");

    gAxisX.call(drawAxe(minAndMax.xmin, minAndMax.xmax, false, isLog, boundingBox));
    gAxisY.call(drawAxe(minAndMax.ymin, minAndMax.ymax, true, isLog, boundingBox));
}

function zipData(x, y) {
    return x.map((e, i) => ({x: e, y: y[i]}));
}

function drawLinearChart(nbChart, data, minAndMax) {
    let svg = d3.select('#svg' + nbChart);
    let boundingBox = svg.node().getBoundingClientRect();
    let gContainer = svg
        .append('g')
        .attr('id', 'gContainer' + nbChart);

    drawOrthogonalAxis(gContainer, boundingBox, data['models']['isLog'], minAndMax);

    data['models'].forEach((data, index) => {
            let xy = zipData(data['x_data'], data['y_data']);
            console.log("index", index);
            let scale_x = getScale(minAndMax.xmin, minAndMax.xmax, false, data['isLog'], boundingBox);
            let scale_y = getScale(minAndMax.ymin, minAndMax.ymax, true, data['isLog'], boundingBox);
            let lineValue = d3.line();
            lineValue.x(function (d) {
                return scale_x(parseFloat(d.x));
            });
            lineValue.y(function (d) {
                return scale_y(parseFloat(d.y));
            });
            lineValue.curve(d3.curveMonotoneX);
            gContainer
                .append('g')
                .append('path')
                .attr("d", lineValue(xy))
                .attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + ", 50)")
                .attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.03 * boundingBox.height) + ")")
                .attr("stroke", d3.schemeCategory10[index])
                .attr("fill", "none")
                .attr("stroke-width", 3);
    });
    svg.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('transform', 'translate(' + parseFloat(boundingBox.width * 0.033) + ',' + parseFloat(boundingBox.height / 2) + ') rotate(-90)')
        .style("text-anchor", "middle")
        .attr('fill', 'black')
        .text("titi");

    svg.append('text')
        .attr('x', parseFloat(boundingBox.width / 2))
        .attr('y', boundingBox.height * 0.95)
        .style("text-anchor", "middle")
        .attr('fill', 'black ')
        .text("toto");
}

function getScale(min, max, isVertical, isLog, boundingBox) {
    let scaleAxe = isLog ? d3.scaleLog() : d3.scaleLinear();
    scaleAxe.domain([min, max]);
    isVertical ? scaleAxe.range([parseFloat(0.77 * boundingBox.height), 0]) : scaleAxe.range([0, parseFloat(0.8 * boundingBox.width)]);

    return scaleAxe;
}

function drawPointCloud(nbChart, data, minAndMax) {
    let svg = d3.select('#svg' + nbChart);
    let boundingBox = svg.node().getBoundingClientRect();
    let gContainer = svg
        .append('g')
        .attr('id', 'gContainer' + nbChart);

    drawOrthogonalAxis(gContainer, boundingBox, data['models']['isLog'], minAndMax);

    let scale_x = getScale(minAndMax.xmin, minAndMax.xmax, false, data['isLog'], boundingBox);
    let scale_y = getScale(minAndMax.ymin, minAndMax.ymax, true, data['isLog'], boundingBox);
    let gcircle = gContainer.append("g");
    data['models'].forEach((data, index) => {
        let xy = zipData(data['x_data'], data['y_data']);
        console.log(xy);

    });
    for (let i = 0; i < data['x_data'].length; i++) {
        let circle = gcircle.append("circle");
        circle.attr("cx", scale_x(data['x_data'][i]))
            .attr("cy", scale_y(data['y_data'][i]))
            .attr("r", 2)
            .attr("fill", d3.schemeCategory10[nbChart])
            .attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + ", 50)")
            .attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.03 * boundingBox.height) + ")");
    }
    svg.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('transform', 'translate(' + parseFloat(boundingBox.width * 0.033) + ',' + parseFloat(boundingBox.height / 2) + ') rotate(-90)')
        .style("text-anchor", "middle")
        .attr('fill', 'black')
        .text("titi");

    svg.append('text')
        .attr('x', parseFloat(boundingBox.width / 2))
        .attr('y', boundingBox.height * 0.95)
        .style("text-anchor", "middle")
        .attr('fill', 'black')
        .text("toto");
}
