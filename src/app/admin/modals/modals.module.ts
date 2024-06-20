import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// -----------------------------------------------------

import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgSelectModule } from '@ng-select/ng-select';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxEditorModule } from 'ngx-editor';

// -----------------------------------------------------

import { CreateAdminModalComponent } from './create-admin/create-admin.component';
import { EditUserModalComponent } from './edit-user/edit-user.component';

// -----------------------------------------------------

@NgModule({
	imports: [
		CommonModule,
		FormsModule, ReactiveFormsModule,

		NgbModule,
		NgbDatepickerModule,

		NgSelectModule,
		FileUploadModule,
		PdfViewerModule,
		NgxEditorModule,
	],
	declarations: [
		CreateAdminModalComponent,
		EditUserModalComponent,
	],
})
export class ModalsModule { }
