function drawAxe(data,isVertical, isLog) {
    return (isVertical ? d3.axisLeft(getScale(data, isVertical, isLog)).ticks(5) : d3.axisBottom(getScale(data, isVertical, isLog)).ticks(5));
}

function getScale(data, isVertical, isLog) {
    let scaleAxe = (isLog ? d3.scaleLog() : d3.scaleLinear());
    scaleAxe.domain([d3.min(data), d3.max(data)]);
    isVertical ? scaleAxe.range([150, 0]) : scaleAxe.range([0, 400]);

    return scaleAxe;
}

function drawLinearChart(data) {
    let svg = d3.select('#svg' + data['position']);
    let gContainer = svg.append('g');
    let gAxisX = gContainer.append('g');
    gAxisX.attr("transform", "translate(80,200)");

    let gAxisY = gContainer.append('g');
    gAxisY.attr("transform", "translate(80,50)");
    gAxisX.call(drawAxe(data['axe_x']['values'], false, data['isLog_x']));
    gAxisY.call(drawAxe(data['axe_y']['values'], true, data['isLog_y']));
    var color = parseInt(Math.random()*10);

    let xy = [];
    for(var i = 0; i< data["axe_x"]['values'].length; i++){
        xy.push({x:data['axe_x']["values"][i], y: data['axe_y']['values'][i]});
    }
    let lineValue = d3.line();
    lineValue.x(function (d) {
        return getScale(data['axe_x']['values'],false, data['isLog_x'])(parseFloat(d.x));
    });
    lineValue.y(function (d) {
        return getScale(data['axe_y']['values'], true, data['isLog_y'])(parseFloat(d.y));
    });
    lineValue.curve(d3.curveMonotoneX);
    let gLine = gContainer.append('g');

    let line = gLine.append('path');
    line.attr("d", lineValue(xy));
    line.attr("transform", "translate(80,50)");
    line.attr("stroke", d3.schemeCategory10[color]);
    line.attr("fill", "none");
    line.attr("stroke-opacity", 2);
}

function drawPointCloud(data) {
    let svg = d3.select('#svg' + data['position']);
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
            circle.attr("cx", getScale(data['axe_x']['values'], false, data['isLog_x'])(data['axe_x']['values'][i]))
                  .attr("cy", getScale(data['axe_y']['values'], true, data['isLog_y'])(data['axe_y']['values'][i]))
                  .attr("r", 1)
                  .attr('transform','translate(80, 50)')
                  .attr('fill', d3.schemeCategory10[color]);
    }
}
