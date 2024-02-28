import {
	Component, OnInit, ChangeDetectorRef,
	Input, Output, Injector
} from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { QuestionModalData, QuestionModalComponent } from '../question-modal/question-modal.component';

import { DataService } from '../data/data.service';
import { SecurityService } from '../security/security.service';

import * as Models from "../data/data-models";

import { Helpers } from '../helpers';

@Component({
	selector: 'recent-documents',
	templateUrl: './recent-documents.component.html',
	styleUrls: ['./recent-documents.component.scss']
})
export class RecentDocumentsComponent {
	// TODO: Replace with your actual projectId
	projectId = 1;
	
	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		private changeDetector: ChangeDetectorRef,
		private router: Router,
		public modalService: NgbModal,
	) { }
	
	listDocuments: Models.RespDocumentData[] = null;
	
	ngOnInit(): void {
		this.fetchData();
	}
	
	async fetchData() {
		var page: Models.ReqBodyPaginate = {
			//per_page: 0,
			page: 0
		};
		this.dataService.documentGetRecents(this.projectId, null, page, -1).subscribe({
			next: data => {
				this.listDocuments = data;
				console.log(data);
			},
			error: x => console.log(x),
		});
	}
	
	// -----------------------------------------------------
	
	listReady(): boolean {
		return this.listDocuments !== null;
	}
	
	shortDesc(s: string): string {
		if (s.length > 28) {
			return s.substring(0, 28) + '...';
		}
		return s;
	}
	
	/* getFromDesc(data: Models.RespDocumentData): string {
		if (data.assoc_post !== undefined) {
			var id = (<Models.RespPostData>data.assoc_post).id;
			return `Question <i (click)="callbackNavigateToQuestion(d)">#${id}</i>`;
		}
		else if (data.assoc_account !== undefined) {
			var id = (<Models.RespAccountData>data.assoc_account).id;
			return `Account <i>${id}</i>`;
		}
		return 'This project';
	} */
	getIdText(data: Models.RespDocumentData): string {
		if (data.assoc_post !== undefined) {
			var id = (<Models.RespPostData>data.assoc_post).id;
			return `${id}`;
		}
		else if (data.assoc_account !== undefined) {
			var id = (<Models.RespAccountData>data.assoc_account).id;
			return `${id}`;
		}
		return '';
	}
	
	// -----------------------------------------------------
	
	callbackNavigateToDocView(id: number) {
		this.router.navigate([`/docs/pdf/${id}`]);
		return false;
	}
	
	callbackNavigateToQuestion(data: Models.RespDocumentData) {
		/* const modalRef = this.modalService.open(QuestionModalComponent, {
			injector: Injector.create([{
				provide: QuestionModalData, useValue: { 
					question: <Models.RespPostData>data.assoc_post, }
			}])
		}); */
		const modalRef = this.modalService.open(QuestionModalComponent);
		modalRef.componentInstance.question = <Models.RespPostData>data.assoc_post;
		
		console.log(data);
		
		/* modalRef.result.then((result) => {
			if (result) {
				console.log(result);
			}
		}); */
		
		return false;
	}
}
