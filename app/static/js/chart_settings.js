function init() {
    // Toast Materialize
    M.toast({html: 'Fichiers correctement importés !', classes: 'rounded', displayLength: 5000});

    // Modal Materialize
    $(document).ready(function () {
        $('.modal').modal();
    });

    // Select Materialize
    $(document).ready(function () {
        $('select').formSelect();
    });


    $('.modal-trigger').click(function () {
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
                console.log(axe_x);
                let xAxe = {
                    data : data[axe_x],
                    isLog : false,
                    isVertical: false
                };
                let yAxe = {
                    data: data[axe_y],
                    isLog: false,
                    isVertical: true
                };
                drawPointCloud(1,xAxe, yAxe);
            }
        });

        e.preventDefault(); // avoid to execute the actual submit of the form.
    });


}