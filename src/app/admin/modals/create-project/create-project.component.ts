import {
	Component, OnInit, OnChanges,
	SimpleChanges
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
	FormBuilder, FormGroup,
	Validators, ValidatorFn, AbstractControl, ValidationErrors,
} from '@angular/forms';

import {
	NgbModal, NgbActiveModal,
	NgbDate, NgbDateStruct, NgbDateAdapter, NgbDatepicker,
 } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { Option, Some, None } from 'ts-results';

import { DataService } from 'app/data/data.service';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

import { DateHelper, CustomDateAdapter } from 'app/projects/admin-section/manage-project/project-edit-info/project-edit-info.component'

@Component({
	selector: 'app-create-project',
	templateUrl: './create-project.component.html',
	styleUrls: ['./create-project.component.scss'],
	
	providers: [
		{ provide: NgbDateAdapter, useClass: CustomDateAdapter },
	],
})
export class CreateProjectModalComponent implements OnInit {
	
	@Output() ok = new EventEmitter<void>();
	
	// -----------------------------------------------------
	
	model: Models.ReqBodyCreateProject;

	loading = false;
	error = '';
	
	form: FormGroup;
	
	constructor(
		private formBuilder: FormBuilder,
		
		private dataService: DataService,
		
		public activeModal: NgbActiveModal,
		private notifier: NotifierService,
		
		public dateAdapter: NgbDateAdapter<string>,
	) { 
		let date = new Date();
		let date2 = new Date();
		date2.setFullYear(date2.getFullYear() + 1);		// Set end date to 1 year into the future
		console.log(date, date2);
		
		this.model = {
			name: '',
			display_name: '',
			company: '',
			date_start: date.toISOString(),
			date_end: date2.toISOString(),
			tranches: [],
		};
	}
	
	ngOnInit() {
		this.form = this.formBuilder.group({
			id: ['', Validators.pattern(/[A-Za-z0-9_]+/)],
			name: ['', Validators.required],
			company: [''],
		});
	}

	// -----------------------------------------------------
	
	get f() {
		return this.form.controls;
	}
	
	validateForm() {
		this.error = '';
		
		if (this.form.invalid) {
			if (this.f['id'].errors) 
				this.error = 'Invalid project ID';
			if (this.f['name'].errors)
				this.error = 'Invalid project name';
		}
	}
	
	// -----------------------------------------------------
	
	onDateSelect(date: NgbDate) {
		console.log(date);
	}
	
	async callbackAction(confirm: boolean) {
		if (confirm) {
			this.validateForm();
			if (this.error)
				return;
			
			await this.createProject();
			if (this.error)
				return;
			
			this.ok.emit();
			this.activeModal.close();
		}
		else {
			this.activeModal.close();
		}
	}
	
	async createProject() {
		this.error = '';
		this.loading = true;
		
		console.log(this.model);
		
		// TODO: Uncomment when the datepicker stops breaking
		/* let res = await Helpers.observableAsPromise(
			this.dataService.projectCreate(this.model));
		if (res.err) {
			let e = res.val as HttpErrorResponse;
			const eMsg = Helpers.formatHttpError(e);
			
			if (e.status != 400) {
				this.notifier.notify('error', 'Server Error: ' + eMsg);
			}
			
			this.error = eMsg;
		} */
		
		this.loading = false;
	}
}
