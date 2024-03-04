import {
	Component, OnInit,
	TemplateRef, ViewChild,
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Helpers } from '../../helpers';

@Component({
	selector: 'confirm-delete-modal',
	templateUrl: './confirm-delete-modal.component.html',
	styleUrls: ['./confirm-delete-modal.component.scss']
})
export class ConfirmDeleteModalComponent implements OnInit {
	@Input() public deleteCount: number = 0;
	@Output() public result: EventEmitter<any> = new EventEmitter();
	
	constructor(
		public activeModal: NgbActiveModal,
	) {
		
	}

	ngOnInit() {

	}

	// -----------------------------------------------------


	
	// -----------------------------------------------------
	
	callbackAction(confirm) {
		this.result.emit(confirm);
		this.activeModal.close();
	}
}
