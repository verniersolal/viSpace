function drawAxe(isVertical, isLog, data) {
    return (isVertical ? d3.axisLeft(getScale(isVertical,isLog, data)) : d3.axisBottom(getScale(isVertical, isLog, data)));
}
function getScale(isVertical, isLog, data) {
        let scaleAxe = (isLog ? d3.scaleLog() : d3.scaleLinear());
        scaleAxe.domain([0, 50]);
        isVertical ? scaleAxe.range([400, 0]) : scaleAxe.range([0, 400]);

        return scaleAxe;
}
function drawLinearChart(position, xAxe, yAxe){
        let svg = d3.select('#svg'+position);
        let gContainer = svg.append('g');
        let gAxisX = gContainer.append('g');
        gAxisX.attr("transform", "translate(25, 410)");
        let gAxisY = gContainer.append('g');
        gAxisY.attr("transform", "translate(25,10)");
        gAxisX.call(drawAxe(xAxe.isVertical, xAxe.isLog, xAxe.data));
        gAxisY.call(drawAxe(yAxe.isVertical, yAxe.isLog, yAxe.data));
        let xy = [];
        for(let i = 0; i< xAxe.data.length; i++){
            xy.push({x: xAxe.data[i], y: yAxe.data[i]});
        }
        let lineValue = d3.line();
        lineValue.x(function (d){return getScale(xAxe.isVertical,xAxe.isLog, xAxe.data)(d.x);});
        lineValue.y(function(d){return getScale(yAxe.isVertical,yAxe.isLog, yAxe.data)(d.y);});
        let gLine = gContainer.append('g');

        let line = gLine.append('path');
        line.attr("d", lineValue(xy));
        line.attr("transform", "translate(25,25)");
        line.attr("stroke", "white");
        line.attr("fill", "none");
        line.attr("stroke-opacity", 1);
}
function drawPointCloud(position, xAxe, yAxe){
    let svg = d3.select('#svg'+position);
    let gContainer = svg.append('g');
    let gAxisX = gContainer.append('g');
    gAxisX.attr("transform", "translate(25, 410)");
    let gAxisY = gContainer.append('g');
    gAxisY.attr("transform", "translate(25,10)");
    gAxisX.call(drawAxe(xAxe.isVertical, xAxe.isLog, xAxe.data));
    gAxisY.call(drawAxe(yAxe.isVertical, yAxe.isLog, yAxe.data));
    let xy = [];
    for(let i = 0; i< xAxe.data.length; i++){
        xy.push({x: xAxe.data[i], y: yAxe.data[i]});
    }
    let gcircle = gContainer.append("g");
    for(let i=0; i< xy.length; i++){
        let circle = gcircle.append("circle");
            circle.attr("cx", 25+getScale(xAxe.isVertical, xAxe.isLog, xAxe.data)(xy[i].x))
                  .attr("cy", 10+getScale(yAxe.isVertical, yAxe.isLog, yAxe.data)(xy[i].y))
                  .attr("r", 5)
                  .attr('fill', 'red');
    }
}