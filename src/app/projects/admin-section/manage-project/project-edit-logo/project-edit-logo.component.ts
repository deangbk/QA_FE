import {
	Injectable,
	Component, OnInit, OnDestroy,
	Input, Output, EventEmitter,
	ViewChild, ElementRef,
} from '@angular/core';

import { NotifierService } from 'angular-notifier';

import * as Rx from 'rxjs';

import { DataService, AuthService } from 'app/service';
import * as Models from 'app/service/data-models';

import { ProjectService } from 'app/projects/service';

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
	
	loading = true;

	constructor(
		private dataService: DataService,
		public projectService: ProjectService,
		
		private notifier: NotifierService,
	) { }

	// -----------------------------------------------------

	async ngOnInit() {
		await this.projectService.waitForImagesLoad();
		this.loading = false;
	}
	
	// -----------------------------------------------------
	
	async uploadFile(file: File, logo: boolean) {
		const projectId = this.project.id;
		const obsUpload = logo ?
			this.dataService.projectEditLogo(projectId, file) :
			this.dataService.projectEditBanner(projectId, file);
		
		const res = await Helpers.observableAsPromise(obsUpload);
		if (res.ok) {
			this.notifier.notify('success', `Image updated successfully!`);
			this.projectService.reloadImages();
		}
		else {
			console.log(res.val);
			this.notifier.notify('error', Helpers.formatHttpError(res.val));
		}
	}
}
