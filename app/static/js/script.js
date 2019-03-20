function max(data, param) {
    var max = 0;
    for (var i = 0; i < data.length; i++) {
        if (parseFloat(data[i][param]) >= parseFloat(max)) {
            max = data[i][param];
        }
    }
    return max;
}

function draw(data) {
    var svg = d3.select("#svg");
    console.log(svg);
    svg.attr("width", 550);
    svg.attr("height", 550);

    console.log(data[0]);


    var borderSVG = svg.append("rect");
    borderSVG.attr("width", 550);
    borderSVG.attr("height", 550);
    borderSVG.attr("fill", "none");
    borderSVG.attr("stroke", "gray");

    var gContainer = svg.append("g");

    /*
    PARTIE AXES
    */

    // Initialisation des tableaux
    var scales = [];
    var axis = [];
    var gAxis = [];

    // Les variables représentées sur nos axes
    var variables = ["geff", "Reff", "Teff", 't', 'L'];
    var tabValues = [];

    // Création du tableau contenant les tableaux values[]
    for (var i = 0; i < data.length; i++) {
        tabValues[i] = [parseFloat(data[i]["geff"]), parseFloat(data[i]["Reff"]), parseFloat(data[i]["Teff"]), parseFloat(data[i]["t"]), parseFloat(data[i]["L"])];
    }

    // Preparation des echelles
    for (var i = 0; i < variables.length; i++) {
        scales[i] = d3.scaleLinear();
        scales[i].domain([0, max(data, variables[i])]);
        scales[i].range([500, 0]);
        axis[i] = d3.axisLeft(scales[i]);

    }

    // Ajout des gAxis au gContainer et espacement des axes

    for (i = 0; i < variables.length; i++) {
        gAxis[i] = gContainer.append("g");
        gAxis[i].call(axis[i]);
        gAxis[i].attr("transform", "translate(" + (25 + (100 * i)) + ",25)");
    }


    /*
    PARTIE LIGNES
    */

    // Lines

    var gLines = gContainer.append("g");
    var lines = [];

    for (i = 0; i < data.length; i++) {

        // Line

        var lineValues = d3.line();
        lineValues.x(function (d, i) {
            return (100 * i);
        });
        lineValues.y(function (d, i) {
            return scales[i](d);
        });

        lines[i] = gLines.append("path");
        lines[i].attr("d", lineValues(tabValues[i]));
        lines[i].attr("transform", "translate(25,25)");
        lines[i].attr("stroke", "blue");
        lines[i].attr("fill", "none");
        lines[i].attr("stroke-opacity", 0.1);

    }
}

function enableImportBtn() {
    var importBtn = document.getElementById("importBtn");
    var fileInput = document.getElementById("fileInput");
    fileInput.addEventListener("change", function () {
        importBtn.classList.remove("disabled");
    });
}
