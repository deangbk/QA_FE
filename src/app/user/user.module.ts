
// -----------------------------------------------------
// Angular modules

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// -----------------------------------------------------
// External library modules

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// -----------------------------------------------------

import { SharedModule } from '../shared/shared.module';

import { DataService } from 'app/service';

import { UserRoutingModule } from './user-routing.module';
import { LayoutUserComponent } from './user.component';

// -----------------------------------------------------

@NgModule({
	imports: [
		CommonModule,
		FormsModule, ReactiveFormsModule,
		
		NgbModule,
		
		SharedModule,
		
		UserRoutingModule,
	],
	declarations: [
		LayoutUserComponent,
	],
	providers: [
		DataService,
	]
})
export class UserModule { }
