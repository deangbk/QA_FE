import {
	Component, OnInit,
	Input, Output,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { DataService, AuthService } from 'app/service';
import * as Models from 'app/service/data-models';

import { Helpers } from 'app/helpers';

import { ProjectService } from 'app/projects/service/project.service';

@Component({
	selector: 'app-manage-project',
	templateUrl: './manage-project.component.html',
	styleUrls: ['./manage-project.component.scss'],
})
export class ManageProjectComponent implements OnInit {
	projectId = 1;
	
	constructor(
		private dataService: DataService,
		private projectService: ProjectService,
		private authService: AuthService,
		
		private modalService: NgbModal,
		private notifier: NotifierService,
	) {
		this.projectId = authService.getProjectId();
	}
	
	dataReady = false;
	projectInfo: Models.RespProjectData = null;
	tranchesInfo: Models.RespTrancheDataEx[] = [];
	
	// -----------------------------------------------------
	
	ngOnInit(): void {
		this.fetchData();
	}
	
	setError(e: HttpErrorResponse) {
		console.log(e);
		this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(e));
	}
	
	async fetchData() {
		try {
			this.dataReady = false;
			
			await this.fetchProject();
			await this.fetchTranches();
			
			this.dataReady = true;
		}
		catch (_e) {
			this.setError(_e);
		}
	}
	async fetchProject() {
		await this.projectService.waitForProjectLoad();
		this.projectInfo = this.projectService.projectData;
	}
	async fetchTranches() {
		let res = await Helpers.observableAsPromise(
			this.dataService.projectGetTranchesEx());
		if (res.ok) {
			this.tranchesInfo = res.val;
		}
		else {
			throw res.val;
		}
	}
	
	// -----------------------------------------------------
	
	async callbackRefreshProject() {
		this.projectService.reloadProject();
		
		{
			this.dataReady = false;
			
			await this.fetchProject();
			
			this.dataReady = true;
		}
	}
	
	async callbackRefreshTranches() {
		try {
			this.dataReady = false;
			
			await this.fetchTranches();
			
			this.dataReady = true;
		}
		catch (_e) {
			this.setError(_e);
		}
	}
}
