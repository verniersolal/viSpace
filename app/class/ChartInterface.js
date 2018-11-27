class ChartInterface {
 charts = new Array()[Chart];

 constructor(charts){
     for(var i = 0;i<charts.length;i++){
         this.charts.push(charts[i]);
     }
 }
}