function sendToast() {
    // Toast Materialize
    M.toast({html: 'Fichiers correctement importés !', classes: 'rounded', displayLength: 5000});
}

function init() {
    // Modal Materialize
    $(document).ready(function () {
        $('#modal1').modal();
    });

    // Select Materialize
    $(document).ready(function () {
        $('select').formSelect();
    });

    $('.modal-trigger').click(function () {
        var position = parseInt($(this).attr('data-position'));
        $('<input>').attr({
            type: 'hidden',
            value: position,
            id: 'position',
            name: 'position'
        }).appendTo('#settings_form');
        $.ajax({
            url: '/models',
            type: 'GET',
            dataType: 'json',
            success: function (models, status) {
                var data = {};
                for (var i = 0; i < models.length; i++) {
                    data[models[i]] = null;
                }
                $('.model_name').autocomplete({
                    data: data,
                    limit: 5
                });
            }
        });
    });

    $("#settings_form").submit(function (e) {
        var form = $(this);
        var url = form.attr('action');
        $('.modal').modal('close');
        var o = {};
        $.each(form.serializeArray(), function(){
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
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


                let xdata = [];
                let ydata = [];
                for(let i=0; i< data['models'].length; i++){
                    for(let j =0; j< data['models'][i]['x_data'].length; j++) {
                        xdata.push(data['models'][i]['x_data'][j]);
                        ydata.push(data['models'][i]['y_data'][j]);
                    }
                }
                console.log(xdata);

                        let ymin = d3.min(ydata);
                        let ymax = d3.max(ydata);
                        let xmax = d3.max(xdata);
                        let xmin = d3.min(xdata);

                            switch (data['chartType']) {
                                case 'linearChart':
                                    for (let i = 0; i < data['models'].length; i++) {
                                        drawLinearChart(data['position'], data['models'][i], xmin, xmax, ymin, ymax);
                                    }
                                    break;
                                case 'pointCloud':
                                    for (let i = 0; i < data['models'].length; i++) {
                                        drawPointCloud(data['position'], data['models'][i], xmin, xmax, ymin, ymax);
                                    }
                                    break;
                            }
                        //drawLinearChart(data['position'], data['models'][i]);

                $('#card' + data['position'] + '.card-panel').hide();
                $('#svg' + data['position']).show();
            }
        });
        e.preventDefault(); // avoid to execute the actual submit of the form.
    });
    $('#selectTable').change(function(){
        let model = $('#selectTable').val()[0];
        let axeElement = $('.axe_name');
        console.log(axeElement);
         $.ajax({
            url: '/models/' + model,
            type: 'GET',
            dataType: 'json',
            success: function (params, status) {

                var data = {};
                for (var i = 0; i < params.length; i++) {
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