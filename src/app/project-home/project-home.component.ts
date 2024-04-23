import {
	Component, OnInit, ChangeDetectorRef,
} from '@angular/core';
import { Input, Output } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { combineLatestWith } from 'rxjs';
import { Option, Some, None } from 'ts-results';

import { DataService } from '../data/data.service';
import { SecurityService } from '../security/security.service';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

import { AddNoteModalComponent } from '../modals/add-note-modal/add-note-modal.component';

@Component({
	selector: 'app-project-home',
	templateUrl: './project-home.component.html',
	styleUrls: ['./project-home.component.scss']
})
export class ProjectHomeComponent implements OnInit {
	projectId = 1;
	isStaff = false;
	
	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		
		public modalService: NgbModal,
		private notifier: NotifierService,
	) {
		this.projectId = securityService.getProjectId();
		this.isStaff = securityService.isStaff();
	}
	
	projectReady = false;
	projectInfo: Models.RespProjectData = null;
	descriptionTextLines: string[];
	
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
		
		const obspProject$ = this.dataService.projectGetInfo();
		const obspNotes$ = this.dataService.noteGetInProject();
		
		obspProject$.pipe(combineLatestWith(obspNotes$))
			.subscribe({
				next: ([project, notes]) => {
					this.projectInfo = project;
				
					this.projectInfo.description =
						"Welcome to the Transaction Website for the Sealed Bid Public Auction of the " +
						"Bank of Ayudhya (the \"Bank\")'s Non-Performing Loan Portfolio #1/2024.\n" +
						
						"During the course of Due Diligence, Qualified Investors may post their questions " +
						"pertaining to the Transaction and receive responses from the Bank through the " +
						"Question & Answer section in accordance with the conditions set forth herein and in the CIM. " +
						"All general questions and answers will be available to every Qualified Investor, " +
						"while those relating to a specific Tranche and / or NPL account(s) will be available to " +
						"Qualified Investors who have registered to participate in the specific Tranche in question.\n" +
						
						"Please be reminded that Information contained in this Transaction Website is subject to " +
						"the Confidentiality Undertaking executed by the Qualified Investors in connection with this Transaction.";
					this.descriptionTextLines = this.projectInfo.description.split('\n')
					
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
