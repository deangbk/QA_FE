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

class SearchFilter {
	public searchText: string;
	public type: number;
	
	public questionId: string;
	public accountName: string;
}

@Component({
	selector: 'recent-documents',
	templateUrl: './recent-documents.component.html',
	styleUrls: ['./recent-documents.component.scss']
})
export class RecentDocumentsComponent {
	// TODO: Replace with your actual projectId
	projectId = 1;
	
	listDocuments: Models.RespDocumentData[] = null;
	listDocumentDisplay: Models.RespDocumentData[] = [];
	filter: SearchFilter;
	
	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		private changeDetector: ChangeDetectorRef,
		private router: Router,
		public modalService: NgbModal,
	) { 
		this.filter = {
			searchText: '',
			type: 0,
			questionId: '',
			accountName: '',
		};
	}
	
	typeSelectLabels = [
		{ value: 0, label: 'All' },
		{ value: 1, label: 'Question' },
		{ value: 2, label: 'Account' }
	];
	
	// -----------------------------------------------------
	
	ngOnInit(): void {
		this.fetchData();
	}
	
	async fetchData() {
		const page: Models.ReqBodyPaginate = {
			per_page: 100,
			page: 0
		};
		this.dataService.documentGetRecents(this.projectId, null, page, 3).subscribe({
			next: data => {
				this.listDocuments = data;
				//console.log(data);
				
				this.callbackUpdateList();
			},
			error: x => console.log(x),
		});
	}
	
	// -----------------------------------------------------
	
	listReady(): boolean {
		return this.listDocuments !== null;
	}
	
	shortDesc(s: string): string {
		if (s === null) return '';
		if (s.length > 28) {
			return s.substring(0, 28) + '...';
		}
		return s;
	}
	
	getIdText(data: Models.RespDocumentData): string {
		if (data.assoc_post != null) {
			const id = (<Models.RespPostData>data.assoc_post).id;
			return `${id}`;
		}
		else if (data.assoc_account != null) {
			const id = (<Models.RespAccountData>data.assoc_account).id;
			return `${id}`;
		}
		return '';
	}
	
	// -----------------------------------------------------
	
	callbackUpdateList() {
		console.log(this.filter);
		var listRes: Models.RespDocumentData[];
		
		if (this.filter.type == 1) {
			// Question documents only
			listRes = this.listDocuments
				.filter(x => x.assoc_post != null);
			
			{
				const res = Helpers.parseInt(this.filter.questionId);
				if (res.some) {
					const id = res.val;
					listRes = listRes
						.filter(x => (<Models.RespPostData>x.assoc_post).id == id);
				}
			}
		}
		else if (this.filter.type == 2) {
			// Account documents only
			listRes = this.listDocuments
				.filter(x => x.assoc_account != null);
			
			if (this.filter.accountName != '') {
				const search = this.filter.accountName.toLowerCase();
				listRes = listRes
					.filter(x => {
						const account = <Models.RespAccountData>x.assoc_account;
						return account.name.toLowerCase().includes(search)
							|| account.id.toLowerCase().includes(search);
					});
			}
		}
		else {
			listRes = this.listDocuments;
		}
		
		if (this.filter.searchText != '') {
			const search = this.filter.searchText.toLowerCase();
			listRes = listRes
				.filter(x => x.name.toLowerCase().includes(search));
		}
		
		this.listDocumentDisplay = listRes;
	}
	
	callbackNavigateToDocView(id: number) {
		this.router.navigate([`/docs/pdf/${id}`]);
		return false;
	}
	
	callbackNavigateToQuestion(data: Models.RespDocumentData) {
		const modalRef = this.modalService.open(QuestionModalComponent);
		modalRef.componentInstance.question = <Models.RespPostData>data.assoc_post;
		
		//console.log(data);
		/* modalRef.result.then((result) => {
			if (result) {
				console.log(result);
			}
		}); */
		
		return false;
	}
}
