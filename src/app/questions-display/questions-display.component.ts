import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../data/questions.service'; // Import your service
import * as Models from "../data/data-models"; // Import your models

@Component({
  selector: 'app-questions-display',
  templateUrl: './questions-display.component.html',
  styleUrls: ['./questions-display.component.scss']
})
export class QuestionsDisplayComponent implements OnInit {
  questions: Models.RespPostData[];


  constructor(private dataService: QuestionsService) { }

  ngOnInit() {

    const projectId = 1; // Replace with your actual projectId
    const filter: Models.ReqBodyGetPosts = {}; // Replace with your actual filter
    const details = 0; // Replace with your actual details value
    const paginate:Models.ReqBodyPaginate={}; // Replace with your actual paginate
    paginate.per_page = 10; // Replace with your actual per_page value
    paginate.page = -1; // Replace with your actual page value

    this.dataService.postGet(projectId, filter, paginate).subscribe(
      (data: Models.RespGetPostPage) => {
        this.questions = data.posts;
        console.log(this.questions);
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }
}
