// angular import
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// bootstrap
import {
	NgbDropdownModule,
	NgbNavModule,
	NgbModule,
	NgbCollapseModule,
	NgbProgressbar,
	NgbProgressbarModule
} from '@ng-bootstrap/ng-bootstrap';

import { NgScrollbarModule } from 'ngx-scrollbar';

import {
	CardModule, ModalModule, NavigationModule, SpinnerComponent
} from './components';
import { DataFilterPipe } from './filter/data-filter.pipe';

@NgModule({
	imports: [
		CommonModule,
		FormsModule, ReactiveFormsModule,
		
		NgbDropdownModule,
		NgbNavModule,
		NgbModule,
		NgbCollapseModule,
		NgbProgressbar,
		NgbProgressbarModule,
		
		NgScrollbarModule,
		
		CardModule,
		ModalModule,
		NavigationModule,
	],
	declarations: [
		DataFilterPipe,
		
		SpinnerComponent,
	],
	exports: [
		CardModule,
		ModalModule,
		NavigationModule,
		
		SpinnerComponent,
	],
})
export class SharedModule {}
