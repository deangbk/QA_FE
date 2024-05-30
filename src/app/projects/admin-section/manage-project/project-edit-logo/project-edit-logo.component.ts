import {
	Injectable,
	Component, OnInit, OnDestroy,
	Input, Output, EventEmitter,
	ViewChild, ElementRef,
} from '@angular/core';

import { NotifierService } from 'angular-notifier';

import { DataService } from 'app/data/data.service';
import { SecurityService } from 'app/security/security.service';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

@Component({
	selector: 'project-edit-logo',
	templateUrl: './project-edit-logo.component.html',
	styleUrls: ['./project-edit-logo.component.scss']
})
export class ProjectEditLogoComponent implements OnInit {
	@Input() project!: Models.RespProjectData;
	@Output() onrefresh = new EventEmitter<void>();
	
	// -----------------------------------------------------

	constructor(
		public dataService: DataService,
		private securityService: SecurityService,
		
		private notifier: NotifierService,
	) { }

	// -----------------------------------------------------

	ngOnInit(): void {
		
	}

	// -----------------------------------------------------
	
	
}
