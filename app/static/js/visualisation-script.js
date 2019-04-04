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

    $('#graph' + nbChart).click((event) => {
        displayEditMenu(event.target.id);
    });
}

function displayEditMenu(svgId) {

    let text_x = $("#text_axe_x_" + svgId).text();
    let text_y = $("#text_axe_y_" + svgId).text();
    $("#editMenu").empty().append("  <div class=\"row\" id=\"adminAxes\">\n" +
        "                <div class=\"col m12\">\n" +
        "                    <div class=\"axe_settings\">\n" +
        "                        <div class=\"input-field\">\n" +
        "                            <i class=\"material-icons prefix\">insert_chart</i>\n" +
        "                            <input value=\"" + text_x + "\" type=\"text\" name=\"axe_x\" id=\"edit_axe_x\"\n" +
        "                                   class=\"autocomplete axe_name\"\n" +
        "                                   required>\n" +
        "                            <label class=\"active\" for=\"edit_axe_x\">Axe X</label>\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "                <div class=\"col m12\">\n" +
        "                    <div class=\"axe_settings\" id=\"2\">\n" +
        "                        <div class=\"input-field\">\n" +
        "                            <i class=\"material-icons prefix\">insert_chart</i>\n" +
        "                            <input value=\"" + text_y + "\" type=\"text\" name=\"axe_y\" id=\"edit_axe_y\"\n" +
        "                                   class=\"autocomplete axe_name\"\n" +
        "                                   required>\n" +
        "                            <label class=\"active\" for=\"edit_axe_y\">Axe Y</label>\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "            <div class=\"row\">\n" +
        "                <a id=\"save\" class=\"waves-effect waves-light btn green disabled\"><i class=\"material-icons right\">save</i>Enregistrer</a>\n" +
        "            </div>\n" +
        "            <div class=\"row\">\n" +
        "                <a id=\"export\" class=\"waves-effect waves-light btn green\"><i\n" +
        "                        class=\"material-icons right\">file_download</i>exporter</a>\n" +
        "            </div>").addClass("sideMenu");
    $(".axe_name").on('change', function (e) {
        $("#save").removeClass("disabled").on("click", function () {
            $("#text_axe_x_" + svgId).html($("#edit_axe_x").val());
            $("#text_axe_y_" + svgId).html($("#edit_axe_y").val());
            M.toast({html: 'Modifications sauvegardées ', classes: 'rounded', displayLength: 5000});
        });
    });
    d3.select('#export').on('click', function () {
        let svg = d3.select("#" + svgId);
        let svgString = getSVGString(svg.node());
        let dim = svg.node().getBoundingClientRect();
        svgString2Image(svgString, dim.width, dim.height, 'png', save); // passes Blob and filesize String to the callback
        function save(dataBlob, filesize) {
            saveAs(dataBlob, 'D3 vis exported to PNG.png'); // FileSaver.js function
        }
    });
}

// Below are the functions that handle actual exporting:
// getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
function getSVGString(svgNode) {
    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    var cssStyleText = getCSSStyles(svgNode);
    appendCSS(cssStyleText, svgNode);

    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    return svgString;

    function getCSSStyles(parentElement) {
        var selectorTextArr = [];

        // Add Parent element Id and Classes to the list
        selectorTextArr.push('#' + parentElement.id);
        for (var c = 0; c < parentElement.classList.length; c++)
            if (!contains('.' + parentElement.classList[c], selectorTextArr))
                selectorTextArr.push('.' + parentElement.classList[c]);

        // Add Children element Ids and Classes to the list
        var nodes = parentElement.getElementsByTagName("*");
        for (var i = 0; i < nodes.length; i++) {
            var id = nodes[i].id;
            if (!contains('#' + id, selectorTextArr))
                selectorTextArr.push('#' + id);

            var classes = nodes[i].classList;
            for (var c = 0; c < classes.length; c++)
                if (!contains('.' + classes[c], selectorTextArr))
                    selectorTextArr.push('.' + classes[c]);
        }

        // Extract CSS Rules
        var extractedCSSText = "";
        for (var i = 0; i < document.styleSheets.length; i++) {
            var s = document.styleSheets[i];

            try {
                if (!s.cssRules) continue;
            } catch (e) {
                if (e.name !== 'SecurityError') throw e; // for Firefox
                continue;
            }

            var cssRules = s.cssRules;
            for (var r = 0; r < cssRules.length; r++) {
                if (contains(cssRules[r].selectorText, selectorTextArr))
                    extractedCSSText += cssRules[r].cssText;
            }
        }


        return extractedCSSText;

        function contains(str, arr) {
            return arr.indexOf(str) === -1 ? false : true;
        }

    }

    function appendCSS(cssText, element) {
        var styleElement = document.createElement("style");
        styleElement.setAttribute("type", "text/css");
        styleElement.innerHTML = cssText;
        var refNode = element.hasChildNodes() ? element.children[0] : null;
        element.insertBefore(styleElement, refNode);
    }
}

function svgString2Image(svgString, width, height, format, callback) {
    var format = format ? format : 'png';

    var imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    var image = new Image();
    image.onload = function () {
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob(function (blob) {
            var filesize = Math.round(blob.length / 1024) + ' KB';
            if (callback) callback(blob, filesize);
        });


    };

    image.src = imgsrc;
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
    let scale_x = getScale(minAndMax.xmin, minAndMax.xmax, false, data['isLog'], boundingBox);
    let scale_y = getScale(minAndMax.ymin, minAndMax.ymax, true, data['isLog'], boundingBox);
    data['models'].forEach((model, index) => {
        let xy = zipData(model['x_data'], model['y_data']);

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
            .attr('x', parseFloat(0.02 * boundingBox.width))
            .attr('y', parseFloat(0.1 * (index + 1) * boundingBox.height))
            .attr('width', 20)
            .attr('height', 20)
            .style("fill", d3v5.schemeCategory10[index]);
        gContainer.append('text')
            .attr("x", parseFloat(0.05 * boundingBox.width))
            .attr("y", parseFloat(0.1 * (index + 1.35) * boundingBox.height))
            .attr('font-size', "15px")
            .text(data['model_name'][index])
            .attr('fill', d3v5.schemeCategory10[index]);

    });

    svg.append('text')
        .attr("id", "text_axe_y_svg" + nbChart)
        .attr('x', 0)
        .attr('y', 0)
        .attr('transform', 'translate(' + parseFloat(boundingBox.width * 0.25) + ',' + parseFloat(boundingBox.height / 2) + ') rotate(-90)')
        .style("text-anchor", "middle")
        .attr('fill', 'black')
        .text(data['axe_y']);

    svg.append('text')
        .attr("id", "text_axe_x_svg" + nbChart)
        .attr('x', parseFloat(boundingBox.width / 2) + 100)
        .attr('y', boundingBox.height * 0.95)
        .style("text-anchor", "middle")
        .attr('fill', 'black ')
        .text(data['axe_x']);

}

function getScale(min, max, isVertical, isLog, boundingBox) {
    let scaleAxe = isLog === true ? d3v5.scaleLog() : d3v5.scaleLinear();
    scaleAxe.domain([min, max]);
    isVertical ? scaleAxe.range([parseFloat(0.77 * boundingBox.height), 0]) : scaleAxe.range([0, parseFloat(0.65 * boundingBox.width)]);

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
    let value_x = function (d) {
        return d.x
    };
    let value_y = function (d) {
        return d.y
    };
    let brush = d3v5.brush()
        .extent([[boundingBox.width * 0.3, boundingBox.height * 0.03], [boundingBox.width, boundingBox.height * 0.8]]);
    data['models'].forEach((datum, index) => {
        let xy = zipData(datum['x_data'], datum['y_data']);
        let circles = gcircle.selectAll(".dot")
            .data(xy)
            .enter().append('circle')
            .attr('r', 3)
            .attr('cx', function (d) {
                return scale_x(value_x(d))
            })
            .attr('cy', function (d) {
                return scale_y(value_y(d))
            })
            .attr("fill", d3v5.schemeCategory10[index])
            .attr("transform", "translate(" + parseFloat(0.3 * boundingBox.width) + ", 50)")
            .attr("transform", "translate(" + parseFloat(0.3 * boundingBox.width) + "," + parseFloat(0.03 * boundingBox.height) + ")");
        circles.append("g").attr("class", "brush").call(brush.on("end", function(){
            let extent = d3v5.event.selection;
            if(!extent){
                scale_x.domain([minAndMax.xmin, minAndMax.xmax])
            }else{
                scale_x.domain([scale_x.invert(extent[0]), scale_x.invert(extent[1])]);
                circles.select(".brush").call(brush.move, null);
            }

        }));
        gContainer.append('text')
            .attr("x", parseFloat(0.05 * boundingBox.width))
            .attr("y", parseFloat(0.1 * (index + 1.35) * boundingBox.height))
            .attr('font-size', "15px")
            .text(data['model_name'][index])
            .attr("fill", d3v5.schemeCategory10[index]);
        gContainer.append('g')
            .append('rect')
            .attr('x', parseFloat(0.02 * boundingBox.width))
            .attr('y', parseFloat(0.1 * (index + 1) * boundingBox.height))
            .attr('width', 20)
            .attr('height', 20)
            .style("fill", d3v5.schemeCategory10[index]);
    });

    svg.append('text')
        .attr("id", "text_axe_y_svg" + nbChart)
        .attr('x', 0)
        .attr('y', 0)
        .attr('transform', 'translate(' + parseFloat(boundingBox.width * 0.25) + ',' + parseFloat(boundingBox.height / 2) + ') rotate(-90)')
        .style("text-anchor", "middle")
        .attr('fill', 'black')
        .text(data['axe_y']);

    svg.append('text')
        .attr("id", "text_axe_x_svg" + nbChart)
        .attr('x', parseFloat(boundingBox.width / 2) + 100)
        .attr('y', boundingBox.height * 0.95)
        .style("text-anchor", "middle")
        .attr('fill', 'black')
        .text(data['axe_x']);
}

function drawparallelCoordinar(data, nbchart) {
    let graphDiv = d3v5.select("#displayGraph");
    graphDiv
        .append('div')
        .attr('class', 'col m12')
        .append('div')
        .attr('class', 'parcoords svg')
        .attr('id', 'cp' + nbchart);
    var colors = d3v3.scale.category20b()
        .range(['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f']);
    var pc2 = d3v3.parcoords()("#cp" + nbchart);
    let boundingBox = d3v3.select('#cp'+ nbchart).node().getBoundingClientRect();

    pc2
        .data(data['data'])
        .color(function (d) {
            return colors(d.famille);
        })
        .alpha(0.5)
        .width(boundingBox.width)
        .height(boundingBox.height)
        .mode('queue')
        .render()
        .reorderable();
    pc2.brushMode('1D-axes');
    pc2.on("brush", function(d){

    });
    graphDiv.on('dblclick', function(){
        pc2.brushReset();
    })
}