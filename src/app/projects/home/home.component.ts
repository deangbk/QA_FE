import {
	Component, OnInit, OnDestroy,
} from '@angular/core';
import { Input, Output } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { Editor } from 'ngx-editor';

import * as Rx from 'rxjs';
import { Option, Some, None } from 'ts-results';

import { DataService } from 'app/data/data.service';
import { SecurityService } from 'app/security/security.service';
import { ProjectService } from '../service/project.service';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

import { AddNoteModalComponent } from '../modals/add-note-modal/add-note-modal.component';

@Component({
	selector: 'app-project-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
	projectId = 1;
	isElevated = false;
	
	constructor(
		private dataService: DataService,
		private projectService: ProjectService,
		private securityService: SecurityService,
		
		public modalService: NgbModal,
		private notifier: NotifierService,
	) {
		this.projectId = securityService.getProjectId();
		this.isElevated = securityService.isElevated();
	}
	
	projectReady = false;
	projectInfo: Models.RespProjectData = null;
	editor: Editor = null;
	
	hasNotes = false;
	projectStickyNotes: Models.RespNoteData[] = [];
	projectNormalNotes: Models.RespNoteData[] = [];
	
	// -----------------------------------------------------
	
	ngOnInit(): void {
		this.editor = new Editor();
		
		this.fetchData();
	}
	ngOnDestroy(): void {
		this.editor?.destroy();
	}
	
	async fetchData() {
		this.projectStickyNotes = [];
		this.projectNormalNotes = [];
		
		await this.projectService.waitForProjectLoad();
		this.dataService.noteGetInProject().subscribe({
			next: (notes) => {
				this.projectInfo = this.projectService.projectData;
				this.refreshNotesList(notes);
				
				this.projectReady = true;
			},
			error: e => {
				console.log(e);
				this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(e));
			},
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
	
	callbackAddNote() {
		const modalRef = this.modalService.open(AddNoteModalComponent, {
			backdrop: 'static',
		});
		const inst = modalRef.componentInstance as AddNoteModalComponent;
		
		inst.result.subscribe(async (result: Option<Models.ReqBodyAddNote>) => {
			if (result.some) {
				const data = result.val;
				//console.log(data);
				
				const res = await Helpers.observableAsPromise(
					this.dataService.noteAdd(data));
				if (res.ok) {
					this.notifier.notify('success', `Note posted successfully!`);
					this.fetchData();
				}
				else {
					console.log(res.val);
					this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(res.val));
				}
			}
		});
	}
	
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
		});
	}
}
