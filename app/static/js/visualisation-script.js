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

let xAxe = {
    data : [10,20,30,40,50],
    isLog : false,
    isVertical: false
};
let yAxe = {
    data: [13,34,32,10,40],
    isLog: false,
    isVertical: true
};

drawLinearChart(1, xAxe, yAxe);