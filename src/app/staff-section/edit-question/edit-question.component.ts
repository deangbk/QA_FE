
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, TemplateRef, Input } from '@angular/core';

// import { DataService } from '../../data/data.service';
import { QuestionsService } from '../../data/questions.service';
import { DataService } from '../../data/data.service';
import { SecurityService } from '../../security/security.service';
import * as Models from "../../data/data-models"; // Import your models
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Mode } from 'fs';
import { createDefaultRespPostData, initReqBodyGetPosts } from '../../data/model-initializers';
import { NotifierService } from 'angular-notifier';
import { ConfirmDeleteModalComponent } from '../../recent-documents/confirm-delete-modal/confirm-delete-modal.component';
import { Helpers } from '../../helpers';


@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent {
  question: Models.RespPostData;
  questionId: number;
  qFilter: Models.ReqBodyGetPosts;
  paginate: Models.ReqBodyPaginate = null;
  loading: boolean = false;
  deleting: boolean = false;
  private notifier: NotifierService;
  deleteIds: number[] = [];
  idClicked: number;

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

		this.question = createDefaultRespPostData();
		this.getQuestions(this.paginate).subscribe({
			next: (data) => {
				this.question = data.posts[0];
				console.log(data);
			},
			error: e => {
				console.error('There was an error!', e);
			}
		});
	}

  constructor(private route: ActivatedRoute, private qService: QuestionsService, notifier: NotifierService, private dataService: DataService, public modalService: NgbModal,) {
    // const navigation = this.router.getCurrentNavigation();
    // const state = navigation?.extras?.state as {data: any};
    this.questionId = +this.route.snapshot.paramMap.get('id');
    this.notifier = notifier;
    console.log(this.questionId + ":questionId");
    // if (state?.data) {
    //   this.question = state.data;
    // }
    // This will log the passed question object
  }

  showNotification(type: string, message: string): void {
    this.notifier.notify(type, message);
  }

	getQuestions(paginate: Models.ReqBodyPaginate): Observable<Models.RespGetPost> {
		this.qFilter.id = this.questionId;
		this.qFilter.type = "question";
		return this.qService.postGet(this.qFilter, paginate);
	}
  
  subQuestions() {
    this.qFilter.id = this.questionId;
    this.qFilter.type = "question";
    return this.qService.postQ(this.question);
  }
  
	async deleteDocument(docId: number) {
		const modalRef = this.modalService.open(ConfirmDeleteModalComponent);
		modalRef.componentInstance.title = 'Delete Question';
		modalRef.componentInstance.message = 'Are you sure you want to delete this question?';

		modalRef.componentInstance.result.subscribe((result) => {
			if (result)
				this.deleteIds.push(docId);
			
			this.deleting = true;
			this.idClicked = docId;

			{
				this.dataService.documentBulkDelete(this.deleteIds).subscribe({
					next: res => {
						/* this.listDocuments = this.listDocuments
								.filter(x => deleteIds.findIndex(y => y == x.id) == -1)
							
							this.callbackUpdateList(); */
						//  this.fetchData();
						this.deleting = false;
						this.idClicked = 0;
						this.showNotification('success', 'Document deleted successfully');
						let index = this.question.attachments.findIndex(x => x.id === docId);
						if (index !== -1) {
							this.question.attachments.splice(index, 1);
						}
					},
					error: e => {
						this.deleting = false;
						this.idClicked = 0;
						this.showNotification('error', 'Unable to delete document');
					}
				})
			}
			// this.qService.deleteQuestion(this.question.id).subscribe({
			//   next: (data: any) => {
			//     this.showNotification('success', 'Question deleted successfully');
			//     this.loading = false;
			//     this.router.navigate(['/staff']);
			//   },
			//   error: e => {
			//     this.showNotification('error', 'Question was not deleted');
			//     this.loading = false;
			//   }
			// });

		});
	}

  submitQuestion() {
    // this.qService.questionEdit(this.question.id, this.question).subscribe(response => {
    //   // Handle the response here
    //   console.log(response);
    // }, error => {
    //   // Handle the error here
    //   console.log(error);
    // });

    this.loading = true;
    this.subQuestions().subscribe({
      next: (data: any) => {

        this.showNotification('success', 'Question updated successfully');
        //  this.question = data[0];
        // console.log(data);
        this.loading = false;

      },
      error: e => {
        // this.showNotification('error', 'Question updated successfully');
        // console.error('There was an error!', e);
        this.loading = false;
        this.showNotification('error', 'Question was not updated');
      }
    });

    // this.qFilter.id= this.questionId;
    // this.qFilter.type = "question";
    // return this.qService.postQ(this.projectId, this.qFilter, this.paginate);
  }
}
