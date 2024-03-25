import { Component, OnInit, TemplateRef, Input } from '@angular/core';

import { DataService } from '../data/data.service';
import { SecurityService } from '../security/security.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonModule } from '@angular/common';
import * as Models from "../data/data-models"; // Import your models
import { has } from 'lodash';
import { createDefaultRespPostData, initReqBodyGetPosts } from '../data/model-initializers';
import { NgSelectModule } from '@ng-select/ng-select';
import { Observable, of,switchMap,tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-questions-display',
  templateUrl: './questions-display.component.html',
//  standalone: true,
//  imports: [CommonModule, SharedModule],
  styleUrls: ['./questions-display.component.scss']
})
export class QuestionsDisplayComponent implements OnInit {
	@Input() qType: string;
	@Input() description: string;
	questions: Models.RespPostData[];
	searchText: string;
	qfilter: Models.ReqBodyGetPosts;
	//has_answer: boolean;
	filter2:any;
	isManager:boolean;
	isUser:boolean;
	singleQuestion: Models.RespPostData;
	accountFilter:string;
	selectedPeople = [];
	accountList:string[]=[];
	accountList$:string[] =[];
	accountList2:string[]=[];
	filteredQuestionsCount: number;
	filteredQuestions: Models.RespPostData[];
	indexOfelement:number;
	page = 1;
	listStart=0;
	listEnd=2000;
	pageSize: number = 10;
	paginate: Models.ReqBodyPaginate = null;

	
	constructor(private dataService: DataService, private sService: SecurityService) { }
	
	ngOnInit() {
		
		this.singleQuestion= createDefaultRespPostData();
		//this.qfilter=initReqBodyGetPosts();
		
		console.log(this.qType);
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
		
		/* this.isManager=this.sService.isManager();
		this.isUser=this.sService.isUser();
		console.log("Is Manager:"+this.isManager);
		console.log("Is User:"+this.isUser); */
	
		this.getQuestions(this.paginate).subscribe({
			next: (data: Models.RespGetPost) => {
				
				this.questions = data.posts;
				
				this.filteredQuestions = [...data.posts];
				this.filteredQuestionsCount = data.posts.length;
				console.log("processed");
				console.log(this.questions);
				
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
			'category':this.filter2.category
		};
		
	}

	
	openMyModal(event, question: Models.RespPostData) {
		document.querySelector('#' + event).classList.add('md-show');
		this.singleQuestion=question;
	  }
	
	  closeMyModal(event) {
		event.target.parentElement.parentElement.parentElement.classList.remove('md-show');
	  }
	

	  onPageChange(page: number) {
		this.listStart =page==1?0: (page-1 ) * this.pageSize;
		this.listEnd = ((page ) * this.pageSize)-1;
		// The page has changed. You can do something here.
	  }
	  getCardTitle(){
		switch (this.qType) {
			case 'account': return 'Account Questions';
			case 'general': return 'General Questions';
			// Add more cases as needed...
			default: return 'Default Title';
		  }
	  }
	

	getQuestions(paginate: Models.ReqBodyPaginate): Observable<Models.RespGetPost> {
		this.qfilter.type = this.qType;
		return this.dataService.postGet(this.qfilter, paginate);
	}

	

		getAccounts(): void {
			if (this.qType=="account")
			{
				this.accountList$=this.questions.map(q=>q.account.id_pretty).sort();
			}
			else
			{
				this.accountList$=[];
			}
			
		  }

		  /// export to excel
		  title = 'Question-Export-Excel';
		  fileName = 'Q&AExport.xlsx';
		  exportexcel(): void {
			  /* pass here the table id */
			  var excellQuestions=this.convertQuestionFormat();
			  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excellQuestions);
			  /* generate workbook and add the worksheet */
			  const wb: XLSX.WorkBook = XLSX.utils.book_new();
			  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
			  /* save to file */
			  XLSX.writeFile(wb, this.fileName);
		  }
		  convertQuestionFormat(){

			var fileQuestions:Models.QuestionExcelUser[]=[];

			this.filteredQuestions.forEach(question => {
				let questionExcelUser: Models.QuestionExcelUser = {
				  Tranche:question.account ? question.account?.tranche?.name:"", // Add logic to map this property
				  Account_Number: question.account ? question.account?.id_pretty : "",
				  Question_Number: question.q_num.toString(),
				  Date_Posted: question.date_post,
				  Is_Answered: !!question.a_text,
				  Date_Answered: question.date_a_approve,
				
				
				  Question: question.q_text,
				  Answer: question.a_text || '',
				  PDF_Attached: question.attachments?question.attachments?.length:0, // Add logic to map this property
				  
				  Question_Type: question.type==1?'Account Question':'General Question',
				  Category: question.category.toUpperCase(),
				  id: question.id,
				};
			
				fileQuestions.push(questionExcelUser);
			  });
			
				return fileQuestions;
		  }

}
