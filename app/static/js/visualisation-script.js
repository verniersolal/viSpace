function drawAxe(data,isVertical, isLog, height, width) {
    return (isVertical ? d3.axisLeft(getScale(data, isVertical, isLog, height, width)).ticks(5) : d3.axisBottom(getScale(data, isVertical, isLog, height,width)).ticks(5));
}

function getScale(data, isVertical, isLog, height, width) {
    let scaleAxe = (isLog ? d3.scaleLog() : d3.scaleLinear());
    scaleAxe.domain([d3.min(data), d3.max(data)]);
    isVertical ? scaleAxe.range([150, 0]) : scaleAxe.range([0, 400]);

    return scaleAxe;
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

function drawPointCloud(data) {
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
    var color = parseInt(Math.random()*10);
    let gcircle = gContainer.append("g");
    for (let i = 0; i < data['axe_x']['values'].length; i++) {
        let circle = gcircle.append("circle");
            circle.attr("cx", getScale(data['axe_x']['values'], false, data['isLog_x'], svgHeight, svgWidth)(data['axe_x']['values'][i]))
                  .attr("cy", getScale(data['axe_y']['values'], true, data['isLog_y'], svgHeight, svgWidth)(data['axe_y']['values'][i]))
                  .attr("r", 1)
                  .attr('transform','translate(80, 50)')
                  .attr('fill', d3.schemeCategory10[color]);
    }
}
