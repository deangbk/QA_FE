import {
	Component, OnInit,
	Input, Output,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

import { Observable, combineLatestWith } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { DataService } from '../../data/data.service';
import { SecurityService } from '../../security/security.service';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

@Component({
	selector: 'app-manage-project',
	templateUrl: './manage-project.component.html',
	styleUrls: ['./manage-project.component.scss'],
})
export class ManageProjectComponent implements OnInit {
	projectId = 1;
	
	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		
		private modalService: NgbModal,
		private notifier: NotifierService,
	) {
		this.projectId = securityService.getProjectId();
	}
	
	dataReady = false;
	projectInfo: Models.RespProjectData = null;
	
	// -----------------------------------------------------
	
	ngOnInit(): void {
		this.fetchData();
	}
	
	async fetchData() {
		this.dataReady = false;
		
		let resProject = await Helpers.observableAsPromise(
			this.dataService.projectGetInfo());
		if (resProject.ok) {
			this.projectInfo = resProject.val;
			
			this.dataReady = true;
		}
		else {
			let e = resProject.val as HttpErrorResponse;
			console.log(e);
			this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(e));
		}
	}
	
	// -----------------------------------------------------
	
}
