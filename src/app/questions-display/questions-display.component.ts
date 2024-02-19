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

    this.dataService.questionGet(projectId, filter, details).subscribe(
      (data: Models.RespPostData[]) => {
        this.questions = data;
        console.log(this.questions);
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }
}
