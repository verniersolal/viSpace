function drawAxe(isVertical, isLog, data) {
    return (isVertical ? d3.axisLeft(getScale(isVertical,isLog, data)) : d3.axisBottom(getScale(isVertical, isLog, data)).ticks(5));
}
function getScale(isVertical, isLog, data) {
        let scaleAxe = (isLog ? d3.scaleLog() : d3.scaleLinear());
        scaleAxe.domain([parseFloat(d3.min(data)), parseFloat(d3.max(data))]);
        isVertical ? scaleAxe.range([400, 0]) : scaleAxe.range([0, 400]);

        return scaleAxe;
}
function drawLinearChart(position, xAxe, yAxe){
        let svg = d3.select('#svg'+position);
        let gContainer = svg.append('g');
        let gAxisX = gContainer.append('g');
        gAxisX.attr("transform", "translate(50, 410)");
        let gAxisY = gContainer.append('g');
        gAxisY.attr("transform", "translate(50,10)");
        gAxisX.call(drawAxe(xAxe.isVertical, xAxe.isLog, xAxe.data));
        gAxisY.call(drawAxe(yAxe.isVertical, yAxe.isLog, yAxe.data));
        let xy = [];
        for(let i = 0; i< xAxe.data.length; i++){
            console.log(xAxe.data[i]);
            xy.push({x: parseFloat(xAxe.data[i]), y: parseFloat(yAxe.data[i])});
        }
        let lineValue = d3.line();
        lineValue.x(function (d){return getScale(xAxe.isVertical,xAxe.isLog, xAxe.data)(parseFloat(d.x));});
        lineValue.y(function(d){return getScale(yAxe.isVertical,yAxe.isLog, yAxe.data)(parseFloat(d.y));});
        lineValue.curve(d3.curveMonotoneX);
        let gLine = gContainer.append('g');

        let line = gLine.append('path');
        line.attr("d", lineValue(xy));
        line.attr("transform", "translate(50,10)");
        line.attr("stroke", "red");
        line.attr("fill", "none");
        line.attr("stroke-opacity", 2);
}
function drawPointCloud(position, xAxe, yAxe){
    let svg = d3.select('#svg'+position);
    let gContainer = svg.append('g');
    let gAxisX = gContainer.append('g');
    gAxisX.attr("transform", "translate(50, 410)");
    let gAxisY = gContainer.append('g');
    gAxisY.attr("transform", "translate(50,10)");
    gAxisX.call(drawAxe(xAxe.isVertical, xAxe.isLog, xAxe.data));
    gAxisY.call(drawAxe(yAxe.isVertical, yAxe.isLog, yAxe.data));
    let xy = [];
    for(let i = 0; i< xAxe.data.length; i++){
        xy.push({x: xAxe.data[i], y: yAxe.data[i]});
    }
    let gcircle = gContainer.append("g");
    for(let i=0; i< xy.length; i++){
        let circle = gcircle.append("circle");
            circle.attr("cx", getScale(xAxe.isVertical, xAxe.isLog, xAxe.data)(xy[i].x))
                  .attr("cy", getScale(yAxe.isVertical, yAxe.isLog, yAxe.data)(xy[i].y))
                  .attr("r", 5)
                  .attr('transform','translate(50, 10)')
                  .attr('fill', 'red');
    }
}
