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
	isStaff = false;
	
	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		
		private notifier: NotifierService,
	) {
		this.projectId = securityService.getProjectId();
		this.isStaff = securityService.isStaff();
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
		this.projectStickyNotes = [];
		this.projectNormalNotes = [];
		
		const obspProject = Helpers.observableAsPromise(this.dataService.projectGetInfo());
		const obspNotes = Helpers.observableAsPromise(this.dataService.noteGetInProject());
		
		await Promise.all([obspProject, obspNotes])
			.then(([resProject, resNotes]) => {
				this.projectInfo = resProject.unwrap();
				
				
				this.refreshNotesList(resNotes.unwrap());
				
				this.projectReady = true;
			})
			.catch(e => {
				console.log(e);
				this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(e));
			});
	}
	refreshNotesList(notesAll: Models.RespNoteData[]) {
		this.hasNotes = notesAll.length > 0;
		this.projectStickyNotes = notesAll
			.filter(x => x.sticky);
		this.projectNormalNotes = notesAll
			.filter(x => !x.sticky);
	}
	
	// -----------------------------------------------------
	
	getEndText() {
		let nowDate = new Date();
		return nowDate >= new Date(this.projectInfo.date_end)
			? 'Ended' : 'Ends';
	}
	
	// -----------------------------------------------------
	
	
	callbackDeleteNote(note: Models.RespNoteData) {
		console.log(note.num);
		
		this.dataService.noteDelete(note.num).subscribe({
			next: x => {
				this.notifier.notify('success', `Note deleted`);
				this.fetchData();
			},
			error: x => {
				this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(x));
			},
		})
	}
}
