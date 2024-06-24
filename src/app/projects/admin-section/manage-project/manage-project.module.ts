import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxEditorModule } from 'ngx-editor';

import { SharedModule } from 'app/shared/shared.module';

import { ManageProjectComponent } from './manage-project.component';
import { ProjectEditInfoComponent } from './project-edit-info/project-edit-info.component';
import { ProjectEditLogoComponent } from './project-edit-logo/project-edit-logo.component';
import { ImageDisplayEditComponent } from './project-edit-logo/image-display-edit/image-display-edit.component';
import { ProjectEditTranchesComponent } from './project-edit-tranches/project-edit-tranches.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule, ReactiveFormsModule,

		NgbModule, NgSelectModule, NgxEditorModule,
		
		SharedModule,
		
		ImageDisplayEditComponent,
	],
	declarations: [
		ManageProjectComponent,
		ProjectEditInfoComponent,
		ProjectEditLogoComponent,
		ProjectEditTranchesComponent,
	],
	exports: [
		ProjectEditInfoComponent,
		ProjectEditTranchesComponent,
	],
})
export class ManageProjectModule { }
