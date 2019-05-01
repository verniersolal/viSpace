
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
                let parameters = ['Indice'];
                parameters = parameters.concat(Object.keys(resp[0]));
                console.log(parameters);
                let data = [];
                resp.forEach(function(datum, index){
                    let d = Object.values(datum);
                    d.unshift(index);
                    return data.push(d);
                });
                console.log(data);
                let m = parameters.indexOf('M'),
                    r = parameters.indexOf('R'),
                    t = parameters.indexOf('t');
                let predictions = [];
                data.forEach(function(arr, index){
                    let predict = [];
                    predict.push(index, arr[m], arr[r], arr[t]);
                    arr.splice(m,3);
                    predictions.push(predict);
                });
                parameters.splice(m,3);
                let tr = '<caption>Observations</caption><thead>' +
                    '<tr>';
                parameters.forEach(function(parameter){
                    tr += '<th>' + parameter + '</th>'
                });
                tr+= '</tr>' +
                    '</thead>' +
                    '<tbody id="tbodyObs">';
                data.forEach(function(arr){
                    tr += '<tr>';
                    arr.forEach(function(value, index){
                        if(index === 0){
                            tr+= '<td>'+ parseInt(value)+'</td>';
                        }else{
                            tr+= '<td>'+ parseFloat(value).toFixed(2)+'</td>';
                        }
                    });
                    tr+= '</tr>';
                });
                tr += '</tbody>';
                let pr = '<caption>Prédictions</caption><thead>' +
                    '<tr>';
                parameters = ['Indice', 'M', 'R', 't'];
                parameters.forEach(function(parameter){
                    pr += '<th>' + parameter + '</th>'
                });
                pr+= '</tr>' +
                    '</thead>' +
                    '<tbody id="tbodyPredict">';
                predictions.forEach(function(arr){
                    pr += '<tr>';
                    arr.forEach(function(value, index){
                        if(index === 0){
                            pr+= '<td>'+ parseInt(value)+'</td>';
                        }else{
                            pr+= '<td>'+ parseFloat(value).toFixed(2)+'</td>';
                        }
                    });
                    pr+= '</tr>';
                });
                pr+= '</tbody>';

                $('#tablePredict').empty().html(tr);
                $('#tablePredict2').empty().html(pr);
                $('.preloader-background').attr('class', 'preloader-background small');
                $('.tooltip').css('visibility', 'hidden');
                $('#parCoordsView').css('visibility', 'visible');
                console.log(resp);
                $('#parCoordsView').empty();
                var pc = d3v3.parcoords({nbChart: 1})('#parCoordsView')
                    .data(resp)
                    .mode('queue')
                    .hideAxis(['eTeff', 'egeff', 'eL'])
                    .render()
                    .reorderable();

            },
            error: function(err){
                console.log(err);
            }
        });

    });
});