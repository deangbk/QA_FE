import { Component, OnInit } from '@angular/core';

import { ChartData, ChartOptions } from "chart.js";
import { Context } from 'chartjs-plugin-datalabels';
import ChartDataLabels from "chartjs-plugin-datalabels";

@Component({
  selector: 'app-view-stats',
  templateUrl: './view-stats.component.html',
  styleUrls: ['./view-stats.component.scss']
})
export class ViewStatsComponent implements OnInit {
  response_Data: ChartData;
	response_Opt: ChartOptions;
	
	AgeRangeResponse_Data: ChartData;
	AgeRangeResponse_Opt: ChartOptions;
  ngOnInit(): void {
    setTimeout(() => {
		this.refreshResponseRateChart();
    }, 1000);
		//console.log(this.dropdown_AgeRange_Items);
	}


  refreshResponseRateChart():void {
		console.log()
		var labels = ["Response","Non-Response"];
		var responseData=[265,67]//[this.responseCount,this.employeeCount-this.responseCount];
		this.response_Data = {
			labels: labels,
			datasets: [
				{
					label: "Response Rate",
					data: responseData,
					backgroundColor:['rgb(255, 0, 0)', 'rgb(0, 255, 0)'],// this.responseColors,
				},
			],
		};
		this.response_Opt = {
			rotation: 180,
			plugins: {
				datalabels: {
					labels: {
						title: {
							anchor: "end",
							align: "end",
							formatter: (x: number, ctx: Context) => {var x=((x/100)*100);return x.toFixed(1) + '%\n';},
						},
						value: {
							//color: this.responseColors,
							anchor: "center",
							align: "center",
							formatter: (x: number, ctx: Context) => x,
						}
					},
					font: {
						size: 13,//AppConfig.donutFontSize,
					},
				},
				outlabels: {
					display: false,
				},
			},
			legend: {
				display: true,
				position: 'bottom',
				labels:{
					padding: 30,
					fontSize: 13,//AppConfig.donutFontSize,
					fontStyle: 'bold',
				}
				
			},
			cutoutPercentage: 40,
			tooltips: {
				enabled: false,
				callbacks: {
					label: function(tooltipItem, data) {
						var label = data.labels[tooltipItem.index];
						var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
						return label + ' Count: ' + value;
					}
				}
			}
		};
    console.log(this.response_Data)
	}
}
