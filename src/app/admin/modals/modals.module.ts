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

import { CreateProjectModalComponent } from './create-project/create-project.component';

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
		CreateProjectModalComponent,
	],
})
export class ModalsModule { }