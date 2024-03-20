import {
	Component, OnInit, ChangeDetectorRef,
} from '@angular/core';
import { Input, Output } from '@angular/core';

import { NotifierService } from 'angular-notifier';

import { DataService } from '../data/data.service';
import { SecurityService } from '../security/security.service';

import * as Models from "../data/data-models";

import { Helpers } from '../helpers';

@Component({
  selector: 'app-project-home',
  templateUrl: './project-home.component.html',
  styleUrls: ['./project-home.component.scss']
})
export class ProjectHomeComponent {
	// TODO: Replace with the actual projectId
	projectId = 1;

	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		
		private notifier: NotifierService,
	) {
		this.projectId = securityService.getProjectId();
	}
	
	projectReady = false;
	projectInfo: Models.RespProjectData = null;
	
	hasNotes = false;
	projectStickyNotes: Models.RespNoteData[] = [];
	projectNormalNotes: Models.RespNoteData[] = [];
	
	// -----------------------------------------------------
	
	ngOnInit(): void {
		this.fetchData();
	}
	
	async fetchData() {
		const obspProject = Helpers.observableAsPromise(this.dataService.projectGetInfo());
		const obspNotes = Helpers.observableAsPromise(this.dataService.noteGetInProject());
		
		await Promise.all([obspProject, obspNotes])
			.then(([resProject, resNotes]) => {
				this.projectInfo = resProject.unwrap();
				
				let notes = resNotes.unwrap();
				this.hasNotes = notes.length > 0;
				this.projectStickyNotes = notes
					.filter(x => x.sticky);
				this.projectNormalNotes = notes
					.filter(x => !x.sticky);
				
				this.projectReady = true;
			})
			.catch(e => {
				console.log(e);
				this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(e));
			});
	}
	
	// -----------------------------------------------------
	
	getEndText() {
		let nowDate = new Date();
		return nowDate >= new Date(this.projectInfo.date_end)
			? 'Ended' : 'Ends';
	}
	
	// -----------------------------------------------------
	
	
}
