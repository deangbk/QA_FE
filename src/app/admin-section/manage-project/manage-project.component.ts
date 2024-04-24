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
	tranchesInfo: Models.RespTrancheDataEx[] = [];
	
	// -----------------------------------------------------
	
	ngOnInit(): void {
		this.fetchData();
	}
	
	async fetchData() {
		var _throwErr = (e: HttpErrorResponse) => {
			console.log(e);
			this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(e));
		};
		
		this.dataReady = false;
		
		let resProject = await Helpers.observableAsPromise(
			this.dataService.projectGetInfo());
		if (resProject.ok) {
			this.projectInfo = resProject.val;
		}
		else {
			_throwErr(resProject.val);
			return;
		}
		
		let resTranches = await Helpers.observableAsPromise(
			this.dataService.trancheGetInfoEx());
		if (resTranches.ok) {
			this.tranchesInfo = resTranches.val;
		}
		else {
			_throwErr(resTranches.val);
			return;
		}
		
		this.dataReady = true;
	}
	
	// -----------------------------------------------------
	
	callbackRefreshView() {
		this.fetchData();
	}
}
