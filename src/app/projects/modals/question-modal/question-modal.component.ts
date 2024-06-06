import {
	Component, OnInit,
	TemplateRef, ViewChild,
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DataService } from 'app/service/data.service';
import { TelemetryService } from 'app/service/telemetry.service';
import { AuthService } from 'app/service/auth.service';

import * as Models from 'app/service/data-models';
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
		private router: Router,
		public activeModal: NgbActiveModal,
		
		private dataService: DataService,
		private telemetryService: TelemetryService,
		private authService: AuthService,
	) { 
		//console.log(this.modalData);
	}
	
	ngOnInit() {
		this.telemetryService.logQuestionView(this.question.id);
	}
	
	// -----------------------------------------------------
	
	
	
	// -----------------------------------------------------
	
	callbackClose(event) {
		this.activeModal.close();
	}
}
