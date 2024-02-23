import { Component, OnInit } from '@angular/core';

import { DataService } from '../data/data.service';
import { SecurityService } from '../security/security.service';
import * as Models from "../data/data-models"; // Import your models
import { has } from 'lodash';

@Component({
  selector: 'app-questions-display',
  templateUrl: './questions-display.component.html',
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
	constructor(private dataService: DataService, private sService: SecurityService) { }
	
	ngOnInit() {

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
				console.log(this.questions);
			},
			error: e => {
				console.error('There was an error!', e);
			}
		});
	}
	updateFilter() {
		//console.log(key+":key");
		//console.log(value+":value");
		this.filter2 = {
			'category':this.filter2.category
		};
	}
}
