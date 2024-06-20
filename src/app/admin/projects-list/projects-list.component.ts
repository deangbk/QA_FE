import {
	Component, OnInit,
	Input, Output,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import * as Rx from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { DataService, AuthService } from 'app/service';
import * as Models from 'app/service/data-models';

import { Helpers } from 'app/helpers';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		
		private dataService: DataService,

		private modalService: NgbModal,
		private notifier: NotifierService,
	) {
		
	}
	
	dataReady = false;
	listProjects: Models.RespProjectData[] = [];
	
	// -----------------------------------------------------
	
	async ngOnInit() {
		this.dataReady = false;
		
		let res = await Helpers.observableAsPromise(
			this.dataService.projectGetAll());
		if (res.ok) {
			this.listProjects = res.val;
			this.dataReady = true;
		}
		else {
			let e = res.val as HttpErrorResponse;
			console.log(e);
			this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(e));
		}
	}
	
	// -----------------------------------------------------
	
	getProjectLink(project: Models.RespProjectData) {
		return ['/', 'project', project.name, 'home'];
	}
	
	isProjectEnded(project: Models.RespProjectData) {
		return new Date(project.date_end) < new Date();
	}
	
	// -----------------------------------------------------
	
	callbackEditProject(project: Models.RespProjectData) {
		var tree = this.router.createUrlTree(
			[project.id.toString()], { relativeTo: this.route });
		var url = this.router.serializeUrl(tree);
		console.log(url);
		window.open(url, '_blank');
	}
}
