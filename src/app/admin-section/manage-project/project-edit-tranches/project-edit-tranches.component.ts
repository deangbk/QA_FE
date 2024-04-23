import {
	Component, OnInit,
	Input, Output, EventEmitter,
	ViewChild, ElementRef,
} from '@angular/core';


import { DataService } from 'app/data/data.service';
import { SecurityService } from 'app/security/security.service';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

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
