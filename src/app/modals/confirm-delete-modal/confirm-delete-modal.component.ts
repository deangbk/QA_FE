import {
	Component, OnInit
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Helpers } from '../../helpers';

export class ModalLine {
	public str: string;
	public red: boolean;
	
	public static normal(str: string): ModalLine {
		return {
			str: str,
			red: false,
		};
	}
	public static danger(str: string): ModalLine {
		return {
			str: str,
			red: true,
		};
	}
}

@Component({
	selector: 'confirm-delete-modal',
	templateUrl: './confirm-delete-modal.component.html',
	styleUrls: ['./confirm-delete-modal.component.scss']
})
export class ConfirmDeleteModalComponent {
	@Input() public title = 'Confirm deletion?';
	@Input() public content: ModalLine[] = [
		ModalLine.danger('This action cannot be undone!'),
	];
	
	@Output() public result: EventEmitter<boolean> = new EventEmitter();
	
	constructor(public activeModal: NgbActiveModal) {}
	
	// -----------------------------------------------------
	
	callbackAction(confirm: boolean) {
		this.result.emit(confirm);
		this.activeModal.close();
	}
}
