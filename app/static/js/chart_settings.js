function sendToast() {
    // Toast Materialize
    M.toast({html: 'Fichiers correctement importés !', classes: 'rounded', displayLength: 5000});
}

function init() {
    let nbAxes = 2;

    // Select Materialize
    $(document).ready(function () {
        $('select').formSelect();
    });

    $("input[name='chartType']").change(function () {
        let chartType = $(this).attr('value');
        let axesDiv = $('#adminAxes');
        switch (chartType) {
            case "linearChart":
            case "pointCloud":
                axesDiv.empty().append("        <div class=\"col m5\">\n" +
                    "                        <div class=\"axe_settings\">\n" +
                    "                            <div class=\"input-field\">\n" +
                    "                                <i class=\"material-icons prefix\">insert_chart</i>\n" +
                    "                                <input type=\"text\" name=\"axe_x\" id=\"axe_x\" class=\"autocomplete axe_name\"\n" +
                    "                                       required>\n" +
                    "                                <label for=\"axe_x\">Axe X</label>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                    </div>\n" +
                    "                    <div class=\"col m5\">\n" +
                    "                        <div class=\"axe_settings\" id=\"2\">\n" +
                    "                            <div class=\"input-field\">\n" +
                    "                                <i class=\"material-icons prefix\">insert_chart</i>\n" +
                    "                                <input type=\"text\" name=\"axe_y\" id=\"axe_y\" class=\"autocomplete axe_name\"\n" +
                    "                                       required>\n" +
                    "                                <label for=\"axe_y\">Axe Y</label>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                    </div>\n" +
                    "                    <div class=\"col m2\">\n" +
                    "                        <div class=\"input-field\">\n" +
                    "                            <p>\n" +
                    "                                <label>\n" +
                    "                                    <input id=\"isLog_y\" name=\"isLog_y\" type=\"checkbox\"/>\n" +
                    "                                    <span>Log 10</span>\n" +
                    "                                </label>\n" +
                    "                            </p>\n" +
                    "                        </div>\n" +
                    "                    </div>");
                break;
            case "parCoord":
                axesDiv.empty().append("                    <div class=\"col m5\">\n" +
                    "                        <div class=\"axe_settings\">\n" +
                    "                            <div class=\"input-field\">\n" +
                    "                                <i class=\"material-icons prefix\">insert_chart</i>\n" +
                    "                                <input type=\"text\" name=\"axe_1\" id=\"axe_x\" class=\"autocomplete axe_name\"\n" +
                    "                                       required>\n" +
                    "                                <label for=\"axe_x\">Axe n°1</label>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                    </div>\n" +
                    "                    <div class=\"col m5\">\n" +
                    "                        <div class=\"axe_settings\" id=\"2\">\n" +
                    "                            <div class=\"input-field\">\n" +
                    "                                <i class=\"material-icons prefix\">insert_chart</i>\n" +
                    "                                <input type=\"text\" name=\"axe_2\" id=\"axe_y\" class=\"autocomplete axe_name lastAxe\"\n" +
                    "                                       required>\n" +
                    "                                <label for=\"axe_y\">Axe n°2</label>\n" +
                    "                            </div>\n" +
                    "                        </div>\n" +
                    "                    </div>\n" +
                    "                    <div class=\"col m2\">\n" +
                    "                        <div class=\"input-field\">\n" +
                    "                            <p>\n" +
                    "                                <label>\n" +
                    "                                    <input id=\"isLog_y\" name=\"isLog_y\" type=\"checkbox\"/>\n" +
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
        $('.lastAxe').change(function () {
            nbAxes++;
            console.log("append" + nbAxes);
            $(this).removeClass('lastAxe');
            axesDiv.append(" <div class=\"col m5\">\n" +
                "                        <div class=\"axe_settings\" id=\"" + nbAxes + "\">\n" +
                "                            <div class=\"input-field\">\n" +
                "                                <i class=\"material-icons prefix\">insert_chart</i>\n" +
                "                                <input type=\"text\" name=\"axe_" + nbAxes + "\" id=\"axe_" + nbAxes + "\" class=\"autocomplete axe_name lastAxe\"\n" +
                "                                       >\n" +
                "                                <label for=\"axe_" + nbAxes + "\">Axe n°" + nbAxes + "</label>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                    </div>")
        });
    });

    $("#settings_form").submit(function (e) {
        let form = $(this);
        let url = form.attr('action');
        $('.modal').modal('close');
        let o = {};
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
        console.log(o);
        $.ajax({
            type: "POST",
            url: url,
            data: o, // serializes the form's elements.
            success: function (data) {
                data = JSON.parse(data);
                if (data.hasOwnProperty('error')) {
                    console.log(data);
                }
                $('#position').remove();
                $('#settings_form').trigger('reset');
                console.log(data);
                switch (data['chartType']) {
                    case 'linearChart':
                        let xdata = data['models'][0]['x_data'].concat(data['models'][1]['x_data']);
                        let ydata = data['models'][0]['y_data'].concat(data['models'][1]['y_data']);
                        let ymin = d3.min(ydata);
                        let ymax = d3.max(ydata);
                        let xmax = d3.max(xdata);
                        let xmin = d3.min(xdata);
                        for (let i = 0; i < data['models'].length; i++) {
                            drawLinearChart(data['position'], data['models'][i], xmin, xmax, ymin, ymax);

                        }

                        //drawLinearChart(data['position'], data['models'][i]);
                        break;
                    case 'pointCloud':
                        drawPointCloud(data);
                }
                $('#card' + data['position'] + '.card-panel').hide();
                $('#svg' + data['position']).show();
            }
        });
        e.preventDefault(); // avoid to execute the actual submit of the form.
    });
    $('#selectTable').change(function () {
        let model = $('#selectTable').val()[0];
        let axeElement = $('.axe_name');
        console.log(axeElement);
        $.ajax({
            url: '/models/' + model,
            type: 'GET',
            dataType: 'json',
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
    })


}