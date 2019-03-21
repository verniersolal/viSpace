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

    $(".model_name").change(function () {
        var model = $(this).val();
        var axeElement = $(this).parent().parent().find('.axe_name');
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
    });

    $("#settings_form").submit(function (e) {
        var form = $(this);
        var url = form.attr('action');
        $('.modal').modal('close');
        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (data) {
                data = JSON.parse(data);
                if (data.hasOwnProperty('error')) {
                }
                $('#position').remove();
                $('#settings_form').trigger('reset');

                switch (data['family_chart']) {
                    case 'linearChart':
                        drawLinearChart(data);
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


}