import {
	Component, OnInit, OnChanges,
	SimpleChanges,
	ViewChild,
	ViewChildren,
	QueryList
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
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
import { AddUsersComponent } from './add-users/add-users.component'

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
		private router: Router,
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
	
	validateForm(): string {
		if (this.form.invalid) {
			if (this.fId.errors) 
				return 'Invalid project ID';
			if (this.fName.errors)
				return 'Invalid project name';
			if (this.fCompany.errors)
				return 'Company name is required';
		}
		
		if (this.createTranches.length == 0)
			return 'At least one tranche is required';
		
		return '';
	}
	
	// -----------------------------------------------------
	
	raiseError() {
		this.notifier.notify('error', this.error);
	}
	
	onDateSelect(date: NgbDate) {
		console.log(date);
	}
	
	async createProject() {
		this.error = this.validateForm();
		if (this.error) {
			this.raiseError();
			return;
		}
		
		await this.createProjectSub();
	}
	
	async createProjectSub() {
		this.error = '';
		this.loading = true;
		
		{
			this.model.name = this.fId.value;
			this.model.display_name = this.fName.value;
			this.model.company = this.fCompany.value;
			
			this.model.tranches = this.createTranches;
			this.model.users = this.createUsers;
			
			console.log(this.model);
		}
		
		let resProject = await Helpers.observableAsPromise(
			this.dataService.projectCreate(this.model));
		if (resProject.err) {
			this.error = 'Create project failed: ' + Helpers.formatHttpError(resProject.val);
			this.raiseError();
			
			console.log(resProject.val);
			
			this.loading = false;
			return;
		}
		
		// Create project ok, now upload images
		
		let resImages = await Helpers.observableAsPromise(
			this.dataService.projectEditLogoAndBanner(this.fileLogo, this.fileBanner));
		if (resImages.err) {
			this.error = 'Create project succeeded, but images failed to upload';
			this.raiseError();
			
			console.log(resImages.val);
		}
		else {
			this.notifier.notify('success', 'Project created successfully!');
		}
		
		setTimeout(() => {
			// Redirect back to projects list
			
			this.router.navigate(['../', 'create']);
		}, 300);
	}
	
	// -----------------------------------------------------
	
	fileLogo: File = null;
	fileBanner: File = null;
	
	// -----------------------------------------------------
	
	createTranches: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
	createUsers: Models.ReqBodyCreateUser[] = [];
	
	@ViewChildren(AddUsersComponent) chAddUsers!: QueryList<AddUsersComponent>;
	
	trancheExists(tranche: string): boolean {
		return this.createTranches.findIndex(x => x == tranche) != -1;
	}
	
	updateTranches(tranches: string[]) {
		this.createTranches = tranches;
		
		this.chAddUsers.forEach(x => x.reset());
	}
}
