import {
	Component, OnInit,
	TemplateRef, ViewChild,
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Option, Some, None } from 'ts-results';

import * as Models from 'app/service/data-models';
import { Helpers } from 'app/helpers';

@Component({
	selector: 'app-add-note-modal',
	templateUrl: './add-note-modal.component.html',
	styleUrls: ['./add-note-modal.component.scss']
})
export class AddNoteModalComponent implements OnInit {
	@Output() public result: EventEmitter<any> = new EventEmitter();
	
	constructor(
		public activeModal: NgbActiveModal,
	) {
		
	}
	
	model: Models.ReqBodyAddNote;
	
	ngOnInit() {
		this.model = {
			text: '',
			description: '',
			category: null,
			sticky: false,
		}
	}

	// -----------------------------------------------------
	
	validateData() {
		return this.model.text.length > 0;
	}

	// -----------------------------------------------------

	callbackAction(confirm: boolean) {
		if (!confirm) {
			this.result.emit(None);
			this.activeModal.close();
		}
		else {
			if (this.validateData()) {
				this.result.emit(Some(this.model));
				this.activeModal.close();
			}
		}
	}
}
