import { Component, OnInit, TemplateRef, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import * as Models from 'app/data/data-models'; // Import your models
import { has } from 'lodash';
import { createDefaultRespPostData, initReqBodyGetPosts } from '../../data/model-initializers';
import { NgSelectModule } from '@ng-select/ng-select';
import { Observable, of, switchMap, tap } from 'rxjs';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Helpers } from 'app/helpers';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

import { DataService } from 'app/data/data.service';
import { SecurityService } from 'app/security/security.service';

@Component({
	selector: 'app-question-approve',
	templateUrl: './question-approve.component.html',
	styleUrls: ['./question-approve.component.scss']
})
export class QuestionApproveComponent implements OnInit {
	

	questions: Models.RespPostData[];
	searchText: string;
	qfilter: Models.ReqBodyGetPosts;
	//has_answer: boolean;
	filter2: any;
	isManager: boolean;
	isUser: boolean;
	singleQuestion: Models.RespPostData;
	accountFilter: string;
	selectedPeople = [];
	accountList: string[] = [];
	accountList$: string[] = [];
	accountList2: string[] = [];
	filteredQuestionsCount: number;
	filteredQuestions: Models.RespPostData[];
	indexOfelement: number;
	page = 1;
	listStart = 0;
	listEnd = 2000;
	pageSize: number = 10;
	paginate: Models.ReqBodyPaginate = null;
	
	constructor(
		private router: Router, private route: ActivatedRoute,
		
		private dataService: DataService,
		private securityService: SecurityService,
		
		private notifier: NotifierService,
	) {
		
	}

	ngOnInit() {
		
		this.singleQuestion = createDefaultRespPostData();
		//this.qfilter=initReqBodyGetPosts();

		this.qfilter = {
			has_answer: null,
			category: null,
			account: null,
			tranche: null,
			type: null,
		};
		this.filter2 = {
			category: ''

		};
		this.isManager = this.securityService.isManager();
		this.isUser = this.securityService.isUser();
		//console.log("Is Manager:" + this.isManager);
		//console.log("Is User:" + this.isUser);
		
		this.getQuestions(this.paginate).subscribe({
			next: (data) => {
				this.questions = data;
				
				this.filteredQuestions = data;
				this.filteredQuestionsCount = data.length;

				//console.log(this.questions);

				this.getAccounts();
			},
			error: e => {
				console.error('There was an error!', e);
			}
		});


		this.onPageChange(this.page);


	}
	testClick(question: Models.RespPostData) {
		console.log(question);
	}
	updateFilter() {
		//console.log(key+":key");
		//console.log(value+":value");
		this.filter2 = {
			'category': this.filter2.category
		};

	}


	openMyModal(event, question: Models.RespPostData) {
		document.querySelector('#' + event).classList.add('md-show');
		this.singleQuestion = question;
	}

	closeMyModal(event) {
		event.target.parentElement.parentElement.parentElement.classList.remove('md-show');
	}


	onPageChange(page: number) {
		this.listStart = page == 1 ? 0 : (page - 1) * this.pageSize;
		this.listEnd = ((page) * this.pageSize) - 1;
		// The page has changed. You can do something here.
	}


	/**
	 * @param paginate Unused (TODO?: add backend pagination)
	 */
	getQuestions(paginate: Models.ReqBodyPaginate): Observable<Models.RespPostData[]> {
		
		//return this.dataService.postGet(projectId, this.qfilter, paginate);
		//return this.qService.postGet(this.qfilter, paginate, 1);
		return this.dataService.managerGetPosts(this.qfilter, 1);
	}
	
	
	
	getAccounts(): void {
		// 		this.accountList$ = this.questions
		//   .filter(q => q.account !== null && q.account !== undefined)
		//   .map(q => q.account.id_pretty)
		//   .sort();

		this.accountList$ = Array.from(
			new Set(
				this.questions
					.filter(q => q.account !== null && q.account !== undefined)
					.map(q => q.account.id_pretty)
			)
		).sort();


	}
	uploadPage(qId: number) {
		console.log(qId);
		this.router.navigate(['../docupload/' + qId],
			{ relativeTo: this.route });
	}
	editQuestion(question: Models.RespPostData) {
		let url = this.router.serializeUrl(
			this.router.createUrlTree(['../qmanage/' + question.id],
				{ relativeTo: this.route })
		);
		
		window.open(url, '_blank');
	}
	displayDocNames(docs: Models.RespDocumentData[]) {
		var docNames = docs.map(doc => doc.name).join(', ');
		docNames = docNames.length > 0 ? docNames + '' : 'No attachments';
		return docNames;
	}

	/// export to excel
	title = 'Question-Export-Excel';
	fileName = 'Q&AExport.xlsx';
	exportexcel(): void {
		/* pass here the table id */
		var excellQuestions = this.convertQuestionFormat();
		const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excellQuestions);
		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		/* save to file */
		XLSX.writeFile(wb, this.fileName);
	}
	convertQuestionFormat() {

		var fileQuestions: Models.QuestionExcelUser[] = [];

		this.filteredQuestions.forEach(question => {
			let questionExcelUser: Models.QuestionExcelUser = {
				Tranche: question.account ? question.account?.tranche?.name : "", // Add logic to map this property
				Account_Number: question.account ? question?.account?.id_pretty : "",
				Question_Number: question.q_num.toString(),
				Date_Posted: question.date_post,
				Is_Answered: !!question.a_text,
				Date_Answered: question.date_a_approve,


				Question: question.q_text,
				Answer: question.a_text || '',
				PDF_Attached: question.attachments ? question?.attachments?.length : 0, // Add logic to map this property

				Question_Type: question.type == 1 ? 'Account Question' : 'General Question',
				Category: question.category.toUpperCase(),
				id: question.id,
			};

			fileQuestions.push(questionExcelUser);
		});

		return fileQuestions;
	}
	/// hadle single question approvals
	setApprovals(qId: number, approve: boolean, type: string) {
		var qaList = [qId];
		var approvals = { approve: approve, questions: qaList };


		if (type == 'answer') {
			this.approveAnswer(approvals);
		}
		else if (type == 'question') {
			this.approveQuestion(approvals);
		}
		else {
			console.log('Invalid type');
		}
		// 	
	}

	approveQuestion(approvals: any) {
		var notifMess = approvals.approve ? "Question Approved" : "Question UnApproved";
		this.dataService.postApproveQuestion(approvals).subscribe(
			response => {
				this.showNotification("success", notifMess);
				//console.log(response);
				this.displayQApproveBy(approvals);
			},
			error => {
				this.showNotification("error", "Error Approving Question");
				// handle the error here
				console.log(error);
			}
		);
	}

	approveAnswer(approvals: any) {
		var notifMess = approvals.approve ? "Answer Approved" : "Answer UnApproved";
		this.dataService.postApproveAnswer(approvals).subscribe(
			response => {
				this.showNotification("success", notifMess); // handle the response here
				// console.log(response);
				this.displayAApproveBy(approvals);

			},
			error => {
				this.showNotification("error", "Error Approving Answer");
				// handle the error herethis.showNotification("Answer Approved", "sucess")
				console.log(error);
			}
		);
	}
	showNotification(type: string, message: string): void {
		this.notifier.notify(type, message);
	}

	displayQApproveBy(approvals:any) {

		if (approvals.approve == false) {

			let question = this.questions.find(q => q.id === approvals.questions[0]);
			if (question) {
				question.q_approve_by = null;
				console.log(question);
			}
		}
		else {

			let question = this.questions.find(q => q.id === approvals.questions[0]);
			if (question) {
				question.q_approve_by = { id: 1, display_name: "Admin" };
				console.log(question);
			}

		}
	}
	displayAApproveBy(approvals:any) {

		if (approvals.approve == false) {

			let question = this.questions.find(q => q.id === approvals.questions[0]);
			if (question) {
				question.a_approve_by = null;
				//console.log(question);
			}
		}
		else {

			let question = this.questions.find(q => q.id === approvals.questions[0]);
			if (question) {
				question.a_approve_by = { id: 1, display_name: "Admin" };
				//console.log(question);
			}

		}
	}
}
