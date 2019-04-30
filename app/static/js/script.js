
$(document).ready(function(){
    $('select').formSelect();

    $('#prediction_form').submit((evt)=>{

        evt.preventDefault();
        let data = $('#prediction_form').serializeArray();
        $('.tooltip').css('visibility', 'visible');
        $('.preloader-background').attr('class', 'preloader-background small active');
        $.ajax({
            url: 'http://127.0.0.1:5000/predict',
            method: 'POST',
            data: JSON.stringify(data),
            dataType: 'json',
            success: function(resp) {
                let parameters = Object.keys(resp[0]);
                let data = resp.map(function(datum){
                    return Object.values(datum);
                });
                let tr = '<thead>' +
                        '<tr>';
                parameters.forEach(function(parameter){
                    tr += '<th>' + parameter + '</th>'
                });
                tr+= '</tr>' +
                    '</thead>' +
                    '<tbody>';
                data.forEach(function(arr, ind){
                    tr += '<tr>';
                    arr.forEach(function(value, index){
                        tr+= '<td>'+ parseInt(value)+'</td>';
                    });
                    tr+= '</tr>';
                });
                tr+= '</tbody>' +
                    '</table>';
                $('#tablePredict').empty().html(tr);
                $('.preloader-background').attr('class', 'preloader-background small');
                $('.tooltip').css('visibility', 'hidden');

            },
            error: function(err){
                console.log(err);
            }
        });

    })
});