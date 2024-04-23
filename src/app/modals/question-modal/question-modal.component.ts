import {
	Component, OnInit,
	TemplateRef, ViewChild,
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DataService } from '../../data/data.service';
import { SecurityService } from '../../security/security.service';

import * as Models from 'app/data/data-models';

import { Helpers } from 'app/helpers';

export class QuestionModalData {
	question: Models.RespPostData;
}

@Component({
	selector: 'app-question-modal',
	templateUrl: './question-modal.component.html',
	styleUrls: ['./question-modal.component.scss']
})
export class QuestionModalComponent implements OnInit {
	@Input() public question: Models.RespPostData = undefined;
	
	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		private router: Router,
		public activeModal: NgbActiveModal,
		
		//private modalData: QuestionModalData,
	) { 
		//console.log(this.modalData);
	}
	
	ngOnInit() {
		
	}
	
	// -----------------------------------------------------
	
	
	
	// -----------------------------------------------------
	
	callbackClose(event) {
		this.activeModal.close();
	}
}
