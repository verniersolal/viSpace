function drawAxe(min, max, isVertical, isLog, boundingBox) {
    return (isVertical ? d3.axisLeft(getScale(min, max, isVertical, isLog, boundingBox)).ticks(5) : d3.axisBottom(getScale(min, max, isVertical, isLog, boundingBox)).ticks(5));
}

function createSvg(nbChart) {
    // TODO : pouvoir mettre 4 graphes sur l'ecran
    let graphDiv = $('#displayGraph');
    let svg1 = "<div id=\"graph" + nbChart + "\"class=\"col m12\">\n" +
        "            <svg id=\"svg" + nbChart + "\" class=\"svg\"></svg>\n" +
        "        </div>";
    graphDiv.append(svg1);
    // if (nbChart % 2 !== 0) {
    //     let svg1 = "<div id=\"graph" + nbChart + "\"class=\"col m12\">\n" +
    //         "            <div class=\"card-panel\" id=\"card" + nbChart + "\" data-position=\"" + nbChart + "\">\n" +
    //         "                <a data-position=\"" + nbChart + "\" class=\"btn-floating btn-large waves-effect waves-light black\"><i\n" +
    //         "                        class=\"material-icons\">add</i></a>\n" +
    //         "            </div>\n" +
    //         "            <svg id=\"svg" + nbChart + "\" class=\"svg\"></svg>\n" +
    //         "        </div>";
    //     graphDiv.append(svg1);
    // } else {
    //     $('#graph' + (nbChart - 1)).removeClass("col m12").addClass("col m6");
    //     let svgDefault = "<div id=\"graph + " + nbChart + "\" class=\"col m6\">\n" +
    //         "            <div class=\"card-panel\" id=\"card" + nbChart + "\" data-position=\"" + nbChart + "\">\n" +
    //         "                <a data-position=\"" + nbChart + "\" class=\"btn-floating btn-large waves-effect waves-light black\"><i\n" +
    //         "                        class=\"material-icons\">add</i></a>\n" +
    //         "            </div>\n" +
    //         "            <svg id=\"svg" + nbChart + "\" class=\"svg\"></svg>\n" +
    //         "        </div>";
    //     graphDiv.append(svgDefault);
    // }
}

function drawLinearChart(position, data, xmin, xmax, ymin, ymax) {
    let svg = d3.select('#svg' + position);
    let boundingBox = $('#svg' + position).get(0).getBoundingClientRect();
    let gContainer = svg.append('g');
    gContainer.attr('id', 'gContainer' + position);
    let gAxisX = gContainer.append('g');
    gAxisX.attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.8 * boundingBox.height) + ")");
    let gAxisY = gContainer.append('g');
    gAxisY.attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.03 * boundingBox.height) + ")");
    gAxisX.call(drawAxe(xmin, xmax, false, data['isLog'], boundingBox));
    gAxisY.call(drawAxe(ymin, ymax, true, data['isLog'], boundingBox));
    let color = parseInt(Math.random() * 10);
    let xy = [];
    for (let i = 0; i < data["x_data"].length; i++) {
        xy.push({x: data['x_data'][i], y: data['y_data'][i]});
    }
    let scale_x = getScale(xmin, xmax, false, data['isLog'], boundingBox);
    let scale_y = getScale(ymin, ymax, true, data['isLog'], boundingBox);
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

function drawPointCloud(position, data, xmin, xmax, ymin, ymax) {
    let svg = d3.select('#svg' + position);
    let boundingBox = $('#svg' + position).get(0).getBoundingClientRect();
    console.log(boundingBox);
    let gContainer = svg.append('g');
    gContainer.attr('id', 'gContainer' + position);
    let gAxisX = gContainer.append('g');
    gAxisX.attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.8 * boundingBox.height) + ")");
    let gAxisY = gContainer.append('g');
    gAxisY.attr("transform", "translate(" + parseFloat(0.15 * boundingBox.width) + "," + parseFloat(0.03 * boundingBox.height) + ")");
    console.log(boundingBox);
    gAxisX.call(drawAxe(xmin, xmax, false, data['isLog'], boundingBox));
    gAxisY.call(drawAxe(ymin, ymax, true, data['isLog'], boundingBox));
    let color = parseInt(Math.random() * 10);
    let scale_x = getScale(xmin, xmax, false, data['isLog'], boundingBox);
    let scale_y = getScale(ymin, ymax, true, data['isLog'], boundingBox);
    let gcircle = gContainer.append("g");
    for (let i = 0; i < data['x_data'].length; i++) {
        let circle = gcircle.append("circle");
        circle.attr("cx", scale_x(data['x_data'][i]))
            .attr("cy", scale_y(data['y_data'][i]))
            .attr("r", 2)
            .attr("fill", d3.schemeCategory10[color])
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
