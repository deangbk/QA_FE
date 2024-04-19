import {
	Component, OnInit,
	Input, Output, EventEmitter,
	ViewChild, ElementRef,
} from '@angular/core';

import { DataService } from '../../../data/data.service';
import { SecurityService } from '../../../security/security.service';

import * as Models from "../../../data/data-models";
import { Helpers } from '../../../helpers';

@Component({
	selector: 'project-edit-tranches',
	templateUrl: './project-edit-tranches.component.html',
	styleUrls: ['./project-edit-tranches.component.scss']
})
export class ProjectEditTranchesComponent implements OnInit {
	
	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
	) { }
	
	// -----------------------------------------------------
	
	ngOnInit(): void {
		
	}
}
