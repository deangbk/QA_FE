import { Component, OnInit, TemplateRef } from '@angular/core';

import { DataService } from '../data/data.service';
import { SecurityService } from '../security/security.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonModule } from '@angular/common';
import * as Models from "../data/data-models"; // Import your models
import { has } from 'lodash';
import { createDefaultRespPostData } from '../data/model-initializers';
import { NgSelectModule } from '@ng-select/ng-select';
import { Observable, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-questions-display',
  templateUrl: './questions-display.component.html',
//  standalone: true,
//  imports: [CommonModule, SharedModule],
  styleUrls: ['./questions-display.component.scss']
})
export class QuestionsDisplayComponent implements OnInit {
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
	accountList$:Observable<string[]> | undefined;
	accountList2:string[]=[];
	filteredQuestionsCount: number;
	indexOfelement:number;
	page = 1;

	//modalContents: TemplateRef<any>;
	constructor(private dataService: DataService, private sService: SecurityService) { }
	
	ngOnInit() {
		this.accountList$ = this.getAccounts();
		this.singleQuestion= createDefaultRespPostData();
		const projectId = 1; // Replace with your actual projectId
		
		this.qfilter = {
			has_answer: null,
			category: null,
			account: null,
			tranche: null
		};
		this.filter2 = {
			category: 'general'
			
		};
		this.isManager=this.sService.isManager();
		this.isUser=this.sService.isUser();
	console.log("Is Manager:"+this.isManager);
	console.log("Is User:"+this.isUser);
		//this.has_answer = null;
		
		const paginate: Models.ReqBodyPaginate = null;
		
		this.dataService.postGet(projectId, this.qfilter, paginate).subscribe({
			next: (data: Models.RespGetPost) => {
				this.questions = data.posts;
				this.filteredQuestionsCount = data.posts.length;
				console.log(this.questions);
			},
			error: e => {
				console.error('There was an error!', e);
			}
		});

		//this.modalContents="<div class="md-content"><div _ngcontent-ng-c859799317="" class="modal-header bg-dark ng-star-inserted" style=""><h5 _ngcontent-ng-c859799317="" class="modal-title text-white"> Animate Modal : fade-in-scale </h5><button _ngcontent-ng-c859799317="" type=" button" data-bs-dismiss="modal" aria-label="Close" class="btn-close btn-close-white" fdprocessedid="55o0n8"></button></div><div _ngcontent-ng-c859799317="" class="modal-body ng-star-inserted" style=""><h5 _ngcontent-ng-c859799317="">This is a modal window</h5><p _ngcontent-ng-c859799317="">You can do the following things with it:</p><p _ngcontent-ng-c859799317=""><b _ngcontent-ng-c859799317="">Read:</b> modal windows will probably tell you something important so don't forget to read what they say. </p><p _ngcontent-ng-c859799317=""><b _ngcontent-ng-c859799317="">Look:</b> a modal window enjoys a certain kind of attention; just look at it and appreciate its presence. </p><p _ngcontent-ng-c859799317=""><b _ngcontent-ng-c859799317="">Close:</b> click on the button below to close the modal.</p></div><div _ngcontent-ng-c859799317="" class="modal-footer ng-star-inserted" style=""><button _ngcontent-ng-c859799317="" type="button" data-bs-dismiss="modal" class="btn btn-outline-secondary" fdprocessedid="6a0sf"> Close </button><button _ngcontent-ng-c859799317="" type="button" class="btn btn-primary shadow-2" fdprocessedid="prmbbd"> Save changes </button></div><!----></div>"
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
	  getAccounts():Observable<string[]>{
		const aList=["A_0001","A_0002","A_0003","A_0004","A_0005"];
		return of(aList);
	  }

}
