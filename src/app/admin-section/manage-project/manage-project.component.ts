import {
	Component, OnInit,
	Input, Output,
} from '@angular/core';

import { Observable, combineLatestWith } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { DataService } from '../../data/data.service';
import { SecurityService } from '../../security/security.service';

import * as Models from "../../data/data-models";
import { Helpers } from '../../helpers';

@Component({
	selector: 'app-manage-project',
	templateUrl: './manage-project.component.html',
	styleUrls: ['./manage-project.component.scss']
})
export class ManageProjectComponent {
	projectId = 1;

	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		
		private modalService: NgbModal,
		private notifier: NotifierService,
	) {
		this.projectId = securityService.getProjectId();
	}
	
	// -----------------------------------------------------

	
	// -----------------------------------------------------
}
