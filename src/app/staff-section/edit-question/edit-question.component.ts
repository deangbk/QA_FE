
import { Router,ActivatedRoute } from '@angular/router';
import { Component, OnInit, TemplateRef, Input } from '@angular/core';

// import { DataService } from '../../data/data.service';
import { QuestionsService } from '../../data/questions.service';
import { SecurityService } from '../../security/security.service';
import * as Models from "../../data/data-models"; // Import your models
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Mode } from 'fs';
import { createDefaultRespPostData, initReqBodyGetPosts } from '../../data/model-initializers';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent {
  question:Models.RespPostData;
  questionId: number;
  qFilter: Models.ReqBodyGetPosts;
  projectId: number = 1;
  paginate: Models.ReqBodyPaginate = null;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.qFilter = {
			has_answer: null,
			category: null,
			account: null,
			tranche: null,
			type: null,
      id: this.questionId,
		};
    console.log(this.question);
this.question=createDefaultRespPostData();
    this.getQuestions(this.paginate, this.projectId).subscribe({
      next: (data: Models.RespGetPost) => {
      
       
        this.question = data[0];
        console.log(data);
       
      },
      error: e => {
        console.error('There was an error!', e);
      }
      });
  }

  constructor(private route: ActivatedRoute, private qService: QuestionsService) {
   // const navigation = this.router.getCurrentNavigation();
   // const state = navigation?.extras?.state as {data: any};
    this.questionId = +this.route.snapshot.paramMap.get('id');
console.log(this.questionId+":questionId");
  // if (state?.data) {
  //   this.question = state.data;
  // }
     // This will log the passed question object
  }

  getQuestions(paginate: Models.ReqBodyPaginate, projectId: number): Observable<Models.RespGetPost> {
		this.qFilter.id= this.questionId;
    this.qFilter.type = "question";
		return this.qService.postGet(projectId, this.qFilter, paginate);
	  }
}
