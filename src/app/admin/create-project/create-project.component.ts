import {
	Component, OnInit, OnChanges,
	SimpleChanges
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
	FormBuilder, FormGroup,
	Validators, ValidatorFn, AbstractControl, ValidationErrors,
	AbstractControlOptions,
} from '@angular/forms';

import {
	NgbDate, NgbDateStruct, NgbDateAdapter, NgbDatepicker,
 } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { Option, Some, None } from 'ts-results';

import { DataService } from 'app/service';
import * as Models from 'app/service/data-models';

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
export class CreateProjectComponent implements OnInit {
	
	model: Models.ReqBodyCreateProject;
	
	topLoading = true;
	loading = false;
	error = '';
	
	form: FormGroup;
	
	constructor(
		private formBuilder: FormBuilder,
		
		private dataService: DataService,
		
		private notifier: NotifierService,
		
		public dateAdapter: NgbDateAdapter<string>,
	) { 
		let date = new Date();
		let date2 = new Date();
		date2.setMonth(date2.getUTCMonth() + 2);	// Set end date to 2 months into the future
		console.log(date, date2);
		console.log(DateHelper.fromDate(date), DateHelper.fromDate(date2));
		
		this.model = {
			name: '',
			display_name: '',
			company: '',
			date_start: date.toISOString(),
			date_end: date2.toISOString(),
			tranches: [],
		};
		
		setTimeout(() => { this.topLoading = false; }, 500);
	}
	
	ngOnInit() {
		const validDate = (g: FormGroup) => {
			const start = g.controls['start'];
			const end = g.controls['end'];
			const dateStart = new Date(start.value);
			const dateEnd = new Date(end.value);
			
			const errs = dateEnd <= dateStart ?
				{ dateInvalid: true } :
				null;
			end.setErrors(errs);
			return errs;
		};
		
		this.form = this.formBuilder.group({
			id: ['', [Validators.required, Validators.pattern(/[A-Za-z0-9_]+/)]],
			name: ['', Validators.required],
			company: ['', Validators.required],
			date: this.formBuilder.group(
				{
					start: [null, Validators.required],
					end: [null, Validators.required],
				},
				<AbstractControlOptions>{
					validators: validDate,
				},
			),
		});
	}
	
	// -----------------------------------------------------
	
	get minStartDate(): NgbDateStruct {
		let date = new Date();
		return DateHelper.fromDate(DateHelper.makeNeutral(date));
	}
	get maxStartDate(): NgbDateStruct {
		let date = new Date(this.model.date_end);
		return DateHelper.fromDate(DateHelper.makeNeutral(date));
	}
	get minEndDate(): NgbDateStruct {
		let date = new Date(this.model.date_start);
		date.setDate(date.getDate() + 1);
		
		return DateHelper.fromDate(DateHelper.makeNeutral(date));
	}
	
	// -----------------------------------------------------
	
	get f() {
		return this.form.controls;
	}
	get fId() {
		return this.form.get('id');
	}
	get fName() {
		return this.form.get('name');
	}
	get fCompany() {
		return this.form.get('company');
	}
	get fDateStart() {
		return this.form.get('date.start');
	}
	get fDateEnd() {
		return this.form.get('date.end');
	}
	
	validateForm() {
		this.error = '';
		
		if (this.form.invalid) {
			if (this.fId.errors) 
				this.error = 'Invalid project ID';
			if (this.fName.errors)
				this.error = 'Invalid project name';
			if (this.fCompany.errors)
				this.error = 'Company name is required';
		}
	}
	
	// -----------------------------------------------------
	
	raiseError() {
		this.notifier.notify('error', this.error);
	}
	
	onDateSelect(date: NgbDate) {
		console.log(date);
	}
	
	async createProject() {
		this.validateForm();
		if (this.error) {
			this.raiseError();
			return;
		}
		
		await this.createProjectSub();
		if (this.error) {
			this.raiseError();
			return;
		}
	}
	
	async createProjectSub() {
		this.error = '';
		this.loading = true;
		
		console.log(this.model);
		
		// TODO: Send create project command to the server
	}
	
	// -----------------------------------------------------
	
	fileLogo: File = null;
	fileBanner: File = null;
	
	// -----------------------------------------------------
	
	createTranches: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
	
	updateTranches(tranches: string[]) {
		this.createTranches = tranches;
		
	}
}
