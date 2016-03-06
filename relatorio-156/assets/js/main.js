<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
   <script type="text/javascript">
      google.charts.load('current', {'packages':['gauge']});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {

        var data = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ['Chamados', 0],
          ['Fora prazo', 0],
          ['Tempo medio', 0],
		  ['Contestado', 0]
        ]);

        var options = {
          width: 1000, height: 400,
          redFrom: 90, redTo: 100,
          yellowFrom:75, yellowTo: 90,
          minorTicks: 5
        };

        var chart = new google.visualization.Gauge(document.getElementById('chart_div'));

        chart.draw(data, options);

        setInterval(function() {
		  
$.getJSON( "http://52.7.200.222:28080/services/rest/dados-secretaria/GABINETE%20DO%20PREFEITO/2016/1" , function ( json_api ) {
	data.setValue(0, 1,json_api.qtdChamados );
	data.setValue(1, 1, json_api.foraprazo);
	data.setValue(2, 1, json_api.med_diff_cad_conc);
	data.setValue(3, 1, json_api.qtdQuestionados);
    chart.draw(data, options);
 
 });       