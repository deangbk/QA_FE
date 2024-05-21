import { Component, ElementRef, OnInit, OnChanges, Input, ViewChild } from '@angular/core';

import { Chart, ChartColor, ChartConfiguration, ChartData, ChartDataSets, ChartOptions } from "chart.js";

import { BaseChartComponent } from "../base-chart/base-chart.component"
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.plugins.register(ChartDataLabels);

@Component({
  selector: 'app-circle-chart',
  templateUrl: './circle-chart.component.html',
  styleUrls: ['./circle-chart.component.scss']
})
export class CircleChartComponent extends BaseChartComponent {
	//response_Data: ChartData;
	response_Opt: ChartOptions;
	@Input('outlabel') public outlabel = false;
	@Input('canvasHeight') public canvasHeight = '100vh';
	
	constructor() { 
		super();
	}
	response_Data = {
		labels: ['label1', 'label2' ],
		datasets: [
		  {
			label: "Response Rate",
			data: [65,75],
		   backgroundColor: ['#FF6384', '#36A2EB'],
		  },
		],
	  };
	layouts = {
		cutoutPercentage: 53,
		responsive: true,
		//maintainAspectRatio: false,
		elements: {
			arc: {
				borderWidth: 3,
				
			},
		},
		layout: {
			padding: {
				top: 150,
				bottom: 50,
			},
			
		},
	}
	public override updateChart(): void {
		this.response_Opt = {
			plugins: {
				datalabels: {
					labels: {
						title: {
							anchor: "end",
							align: "end",
							
						//	formatter: (x: number, ctx: Context) => {var y=x;x=(x/this.employeeCount)*100;return x.toFixed(1) + '%\n  '+y;},
						},
						value: {
							//color: this.responseColors,
							anchor: "center",
							align: "center",

							
						}
					},
					/*font: {
						size: this.fontSize,
					},*/
					font: {
						size: 12,//AppConfig.donutFontSize,
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
					fontSize:12,//AppConfig.donutFontSize,
					
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
		
		
		this.chart?.destroy();
		this.chart = new Chart(this.chartCtx, {
			type: this.outlabel ? 'outlabeledPie' : 'pie',
			data: this.response_Data,
			//options:{...this.response_Opt,...this.layouts}, 
			options: {...this.chartOptions,...this.layouts},
		});
		if(this.canvasHeight){
			this.chart.canvas.style.height = this.canvasHeight;
		}
	}
}
