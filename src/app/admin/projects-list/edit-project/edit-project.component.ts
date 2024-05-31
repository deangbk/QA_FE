import {
	Component, OnInit,
	Input, Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import * as Rx from 'rxjs';

import { DataService } from 'app/data/data.service';
import { SecurityService } from 'app/security/security.service';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

@Component({
	selector: 'app-edit-project',
	templateUrl: './edit-project.component.html',
	styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {
	constructor(
		private route: ActivatedRoute,
		
		private dataService: DataService,
		private securityService: SecurityService,

		private modalService: NgbModal,
		private notifier: NotifierService,
	) {
		
	}
	
	projectId: number;
	
	dataReady = false;
	projectInfo: Models.RespProjectData = null;
	tranchesInfo: Models.RespTrancheDataEx[] = [];
	
	// -----------------------------------------------------

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			var idFromRoute = Number(params.get('id'));
			this.projectId = idFromRoute;
			
			this.fetchData(idFromRoute);
		});
	}

	async fetchData(id: number) {
		this.dataReady = false;
		
		Rx.forkJoin([
			this.dataService.projectGetInfo2(id),
			this.dataService.projectGetTranchesEx2(id),
		])
			.subscribe({
				next: ([project, tranches]) => {
					this.projectInfo = project;
					this.tranchesInfo = tranches;
					
					this.dataReady = true;
				},
				error: e => {
					console.log(e);
					this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(e));
				}
			})
	}
	
	callbackRefresh() {
		this.fetchData(this.projectId);
	}
}
