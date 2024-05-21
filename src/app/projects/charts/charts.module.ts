import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseChartComponent } from './base-chart/base-chart.component';
import { CircleChartComponent } from './circle-chart/circle-chart.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		BaseChartComponent,
		CircleChartComponent,
	],
})
export class ChartsModule { }
