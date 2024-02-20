import { Component, OnInit } from '@angular/core';

import { DataService } from '../data/data.service';
import * as Models from "../data/data-models"; // Import your models

@Component({
  selector: 'app-questions-display',
  templateUrl: './questions-display.component.html',
  styleUrls: ['./questions-display.component.scss']
})
export class QuestionsDisplayComponent implements OnInit {
  questions: Models.RespPostData[];
searchText: string;
qfilter:Models.QuestionFilter;

  constructor(private dataService: DataService) { }

  ngOnInit() {

    const projectId = 1; // Replace with your actual projectId
    const filter: Models.ReqBodyGetPosts = {}; // Replace with your actual filter
    const details = 0; // Replace with your actual details value
    this.qfilter = {
      answered: null,
      category: null,
      account: null,
      tranche: null
    };
	
	const paginate: Models.ReqBodyPaginate = null;
    
    this.dataService.postGet(projectId, filter, paginate).subscribe(
      (data: Models.RespGetPost) => {
        this.questions = data.posts;
        console.log(this.questions);
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }
}
