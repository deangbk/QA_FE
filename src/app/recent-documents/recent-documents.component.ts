import {
	Component, OnInit, ChangeDetectorRef,
	Input, Output, Injector
} from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NotifierService } from 'angular-notifier';

import { QuestionModalData, QuestionModalComponent } from '../modals/question-modal/question-modal.component';
import { ConfirmDeleteModalComponent, ModalLine } from '../modals/confirm-delete-modal/confirm-delete-modal.component';

import { DataService } from '../data/data.service';
import { SecurityService } from '../security/security.service';

import * as Models from "../data/data-models";
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { Helpers } from '../helpers';

class SearchFilter {
	public searchText: string;
	public type: number;
	
	public questionId: string;
	public accountName: string;
}
class ListItem {
	data: Models.RespDocumentData;
	selected: boolean;
}

@Component({
	selector: 'recent-documents',
	templateUrl: './recent-documents.component.html',
	styleUrls: ['./recent-documents.component.scss']
})
export class RecentDocumentsComponent implements OnInit {
	// TODO: Replace with your actual projectId
	projectId = 1;
	isStaff = false;
	
	initFilterType: string;
	typeSelectLabels = [
		{ value: -1, label: 'All' },
		{ value: 0, label: 'Bid' },
		{ value: 1, label: 'Question' },
		{ value: 2, label: 'Account' },
		{ value: 3, label: 'Transaction' }
	];
	
	listDocuments: Models.RespDocumentData[] = null;
	listDocumentDisplay: ListItem[] = [];
	filter: SearchFilter;

	//pagination variables
	indexOfelement:number;
	page = 1;
	listStart=0;
	listEnd=2000;
	pageSize: number = 10;
	paginate: Models.ReqBodyPaginate = null;
	
	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		
		private location: Location,
		private router: Router,
		private route: ActivatedRoute,
		
		public modalService: NgbModal,
		
		private notifier: NotifierService,
	) {
		this.projectId = securityService.getProjectId();
		this.isStaff = securityService.isStaff();
		
		this.filter = {
			searchText: '',
			type: -1,
			questionId: '',
			accountName: '',
		};
		
		this.initFilterType = this.route.snapshot.paramMap.get('type');
		{
			let find = this.typeSelectLabels.find(
				x => Helpers.strCaseCmp(x.label, this.initFilterType));
			if (find != null) {
				this.filter.type = find.value;
			}
			else {
				this.router.navigate(['/docs/recent/all']);
			}
		}
		
		
	}
	
	buttonLoading = '';
	
	// -----------------------------------------------------
	
	ngOnInit(): void {
		this.fetchData();
		this.listEnd=this.pageSize-1;
	}
	
	async fetchData() {
		this.listDocuments = null;
		
		const page: Models.ReqBodyPaginate = {
			per_page: 100,
			page: 0
		};
		this.dataService.documentGetRecents(null, page, 3).subscribe({
			next: data => {
				this.listDocuments = data;
				//console.log(data);
				
				this.callbackUpdateList();
			},
			error: x => {
				console.log(x);
				
				this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(x));
			},
		});
	}
	
	// -----------------------------------------------------
	
	listReady(): boolean {
		return this.listDocuments != null;
	}
	onPageChange(page: number) {
		this.listStart =page==1?0: (page-1 ) * this.pageSize;
		this.listEnd = ((page ) * this.pageSize)-1;
		// The page has changed. You can do something here.
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
			const id = (<Models.RespAccountData>data.assoc_account).id_pretty;
			return `${id}`;
		}
		return '';
	}
	
	// -----------------------------------------------------
	
	callbackChangeRoute() {
		let find = this.typeSelectLabels.find(x => x.value == this.filter.type);
		if (find != null) {
			this.location.replaceState("/docs/recent/" + find.label.toLowerCase());
		}
	}
	callbackUpdateList() {
		//console.log(this.filter);
		var listRes: Models.RespDocumentData[];
		
		switch (this.filter.type) {
			case 0: {
				// General documents only
				
				listRes = this.listDocuments
					.filter(x => x.assoc_post == null && x.assoc_account == null);
				
				break;
			}
			case 1: {
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
				
				break;
			}
			case 2: {
				// Account documents only
				
				listRes = this.listDocuments
					.filter(x => x.assoc_account != null);
				
				if (this.filter.accountName != '') {
					const search = this.filter.accountName.toLowerCase();
					listRes = listRes
						.filter(x => {
							const account = <Models.RespAccountData>x.assoc_account;
							return account.name.toLowerCase().includes(search)
								|| account.id_pretty.toLowerCase().includes(search);
						});
				}
				
				break;
			}
			default:
				listRes = this.listDocuments;
		}
		
		if (this.filter.searchText != '') {
			const search = this.filter.searchText.toLowerCase();
			listRes = listRes
				.filter(x => x.name.toLowerCase().includes(search));
		}
		
		this.listDocumentDisplay = listRes.map(d => ({
			data: d,
			selected: false,
		}));
	}
	
	callbackSetItemSelected(item: ListItem) {
		item.selected = !item.selected;
	}
	
	async callbackUpdatePrintable(newState: boolean) {
		let selectedItems = this.listDocumentDisplay
			.filter(x => x.selected)
			.map(x => x.data);
		if (selectedItems.length == 0)
			return;
		
		this.buttonLoading = 'print';
		
		var edits = selectedItems
			.map(d => ({
				id: d.id,
				printable: newState,
			} as Models.ReqBodyEditDocument));
		
		let res = await Helpers.observableAsPromise(
			this.dataService.documentBulkEdit(edits));
		if (res.ok) {
			selectedItems.forEach(d => {
				d.allow_print = newState;
			});
			
			this.callbackUpdateList();
			
			this.notifier.notify('success', `${res.val} documents updated`);
		}
		else {
			console.log(res.val);
			this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(res.val));
		}
		
		this.buttonLoading = '';
	}
	callbackDeleteDocuments() {
		let selectedItems = this.listDocumentDisplay
			.filter(x => x.selected)
			.map(x => x.data);
		if (selectedItems.length == 0)
			return;
		
		const modalRef = this.modalService.open(ConfirmDeleteModalComponent);
		const modalInst = modalRef.componentInstance as ConfirmDeleteModalComponent;
		{
			modalInst.title = 'Confirm document deletion?';
			modalInst.content = [
				ModalLine.normal(`${selectedItems.length} documents will be deleted.`),
				ModalLine.danger(`This action cannot be undone.`),
			];
		}
		
		modalInst.result.subscribe((result) => {
			if (result)
				this.deleteDocuments(selectedItems);
		});
	}
	async deleteDocuments(items: Models.RespDocumentData[]) {
		this.buttonLoading = 'delete';

		var deleteIds = items
			.map(d => d.id);

		let res = await Helpers.observableAsPromise(
			this.dataService.documentBulkDelete(deleteIds));
		if (res.ok) {
			/* this.listDocuments = this.listDocuments
				.filter(x => deleteIds.findIndex(y => y == x.id) == -1)
			
			this.callbackUpdateList(); */
			await this.fetchData();
			
			this.notifier.notify('success', `${res.val} documents deleted`);
		}
		else {
			console.log(res.val);
			this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(res.val));
		}

		this.buttonLoading = '';
	}
	
	callbackNavigateToDocView(id: number) {
		this.router.navigate([`/docs/pdf/${id}`]);
		return false;
	}
	
	callbackNavigateToQuestion(data: Models.RespDocumentData) {
		const modalRef = this.modalService.open(QuestionModalComponent, {
			//centered: true,
			scrollable: true,
		});
		modalRef.componentInstance.question = data.assoc_post as Models.RespPostData;
		
		return false;
	}
}
