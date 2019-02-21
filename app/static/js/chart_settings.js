function sendToast() {
    // Toast Materialize
    M.toast({html: 'Fichiers correctement importés !', classes: 'rounded', displayLength: 5000});
}

function autocompletion() {
    console.log("toto");
    let model = $('#selectModel').val();
    let axeElement = $('.axe_name');
    $.ajax({
        url: '/models/parameters',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({"model": model}),
        success: function (params) {
            let data = {};
            for (let i = 0; i < params.length; i++) {
                data[params[i]] = null;
            }
            axeElement.autocomplete({
                data: data,
                limit: 5
            });
        }
    });
}

function init() {
    let nbAxes = 2; // default axes count
    let nbChart = 0; // default chart count

    // Select Materialize
    $(document).ready(function () {
        $('select').formSelect();
    });

    $("#selectChartType").change(function () {
        let chartType = $(this).find(":selected").val();
        let axesDiv = $('#adminAxes');
        switch (chartType) {
            case "linearChart":
            case "pointCloud":
                axesDiv.empty().append("        " +
                    "                   <div class=\"col m12\">\n" +
                    "                        <div class=\"axe_settings\">\n" +
                    "                            <div class=\"input-field\">\n" +
                    "                                <i class=\"material-icons prefix\">insert_chart</i>\n" +
                    "                                <input type=\"text\" name=\"axe_x\" id=\"axe_x\" class=\"autocomplete axe_name\"\n" +
                    "                                       required>\n" +
                    "                                <label for=\"axe_x\">Axe X</label>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                    </div>\n" +
                    "                    <div class=\"col m12\">\n" +
                    "                        <div class=\"axe_settings\" id=\"2\">\n" +
                    "                            <div class=\"input-field\">\n" +
                    "                                <i class=\"material-icons prefix\">insert_chart</i>\n" +
                    "                                <input type=\"text\" name=\"axe_y\" id=\"axe_y\" class=\"autocomplete axe_name\"\n" +
                    "                                       required>\n" +
                    "                                <label for=\"axe_y\">Axe Y</label>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                    </div>\n" +
                    "                    <div class=\"col m12 center\">\n" +
                    "                        <div class=\"input-field\">\n" +
                    "                            <p>\n" +
                    "                                <label>\n" +
                    "                                    <input id=\"isLog\" name=\"isLog\" type=\"checkbox\"/>\n" +
                    "                                    <span>Log 10</span>\n" +
                    "                                </label>\n" +
                    "                            </p>\n" +
                    "                        </div>\n" +
                    "                    </div>");
                break;
            case "parCoord":
                axesDiv.empty().append(" <div class=\"col m12\">\n" +
                    "                        <div class=\"axe_settings\">\n" +
                    "                            <div class=\"input-field\">\n" +
                    "                                <i class=\"material-icons prefix\">insert_chart</i>\n" +
                    "                                <input type=\"text\" name=\"axe_1\" id=\"axe_1\" class=\"autocomplete axe_name\"\n" +
                    "                                       required>\n" +
                    "                                <label for=\"axe_1\">Axe n°1</label>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                    </div>\n" +
                    "                    <div class=\"col m12\">\n" +
                    "                        <div class=\"axe_settings\" id=\"2\">\n" +
                    "                            <div class=\"input-field\">\n" +
                    "                                <i class=\"material-icons prefix\">insert_chart</i>\n" +
                    "                                <input type=\"text\" name=\"axe_2\" id=\"axe_2\" class=\"autocomplete axe_name\"\n" +
                    "                                       required>\n" +
                    "                                <label for=\"axe_2\">Axe n°2</label>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                    </div>\n" +
                    "                    <div class=\"col m12 center\">\n" +
                    "                        <div class=\"input-field\">\n" +
                    "                            <p>\n" +
                    "                                <label>\n" +
                    "                                    <input id=\"isLog\" name=\"isLog\" type=\"checkbox\"/>\n" +
                    "                                    <span>Log 10</span>\n" +
                    "                                </label>\n" +
                    "                            </p>\n" +
                    "                        </div>\n" +
                    "                    </div>");
                break;
        }
    });

    $("#adminAxes").change(function () {
        let axesDiv = $(this);
        let lastInputValue = $("input[name='axe_" + nbAxes + "']").val();
        if (lastInputValue && lastInputValue !== "") {
            nbAxes++;

            axesDiv.append(" <div class=\"col m12\">\n" +
                "                        <div class=\"axe_settings\" id=\"" + nbAxes + "\">\n" +
                "                            <div class=\"input-field\">\n" +
                "                                <i class=\"material-icons prefix\">insert_chart</i>\n" +
                "                                <input type=\"text\" name=\"axes[]\" id=\"axe_" + nbAxes + "\" class=\"autocomplete axe_name\"\n" +
                "                                       >\n" +
                "                                <label for=\"axe_" + nbAxes + "\">Axe n°" + nbAxes + "</label>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                    </div>");
            autocompletion();

        }
    });

    function concatModels(models, key) {
        return models.map(d => d[key]).reduce((current, next) => current.concat(next));
    }

    function getMinAndMax(xdata, ydata) {
        return {
            ymin: d3.min(ydata),
            ymax: d3.max(ydata),
            xmax: d3.max(xdata),
            xmin: d3.min(xdata)
        }
    }

    $("#settings_form").submit(function (e) {
        let form = $(this);
        let url = form.attr('action');
        let o = {};
        var inputs = document.getElementsByClassName( 'axe_name' ),
            names  = [].map.call(inputs, function( input ) {
                return input.value;
            });
        $.each(form.serializeArray(), function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        o["axes"] = names;
        $.ajax({
            type: "POST",
            url: url,
            data: o, // serializes the form's elements.
            success: function (data) {

                data = JSON.parse(data);
                if (data['chartType'] === 'parCoords') {
                    drawparallelCoordinar(data['data']);
                    nbChart++;
                } else {
                    console.log(data);
                    //nbChart++;
                    $('#settings_form').trigger('reset');
                    let xdata = concatModels(data['models'], 'x_data');
                    let ydata = concatModels(data['models'], 'y_data');

                    let minAndMax = getMinAndMax(xdata, ydata);
                    nbChart++;
                    drawChart(data, nbChart, minAndMax);


                    document.getElementById("svg" + nbChart).scrollIntoView({behavior: 'smooth', block: 'start'})

                }
            }
        });
        e.preventDefault(); // avoid to execute the actual submit of the form.
    });
    $('#selectModel').change(autocompletion);
    $('.with-gap').change(autocompletion);// This event is for keep autocomplete for all chartType
}
