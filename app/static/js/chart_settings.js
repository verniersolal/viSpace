function sendToast() {
    // Toast Materialize
    M.toast({html: 'Fichiers correctement importés !', classes: 'rounded', displayLength: 5000});
}

function init() {
    // Modal Materialize
    $(document).ready(function () {
        $('.modal').modal();
    });

    // Select Materialize
    $(document).ready(function () {
        $('select').formSelect();
    });


    $('.modal-trigger').click(function () {
        $('#settings_form').trigger('reset');
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
        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(), // serializes the form's elements.
            success: function (data) {
                var axe_x = $('#axe_x').val();
                var axe_y = $('#axe_y').val();
                var isLogX = $('#isLog_x').is(':checked');
                var isLogY = $('#isLog_y').is(':checked');
                console.log(isLogX);
                console.log(isLogY);
                data = JSON.parse(data);
                $('.modal').modal('close');

                let xAxe = {
                    data : data['axe_x'][axe_x],
                    isLog : isLogX,
                    isVertical: false
                };
                let yAxe = {
                    data: data['axe_y'][axe_y],
                    isLog: isLogY,
                    isVertical: true
                };
                drawPointCloud(axe_x,axe_y,1,xAxe, yAxe);
                drawLinearChart(axe_x, axe_y,2, xAxe, yAxe);
            }
        });
        e.preventDefault(); // avoid to execute the actual submit of the form.
    });


}