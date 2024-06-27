import {
	Component, OnInit, OnChanges,
	SimpleChanges
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Option, Some, None } from 'ts-results';

import * as Models from 'app/service/data-models';
import { Helpers } from 'app/helpers';

@Component({
	selector: 'app-create-tranche-modal',
	templateUrl: './create-tranche-modal.component.html',
	styleUrls: ['./create-tranche-modal.component.scss'],
	
	standalone: true,
	imports: [
		CommonModule, FormsModule,
	],
})
export class CreateTrancheModalComponent {
	@Input() public nameChecker: (name: string) => boolean = null;
	
	@Output() public result = new EventEmitter<string>();
	
	name: string;
	error = false;
	
	constructor(public activeModal: NgbActiveModal) { }
	
	// -----------------------------------------------------
	
	onChange() {
		this.name = this.name.trim();
		this.error = this.nameChecker != null ?
			this.nameChecker(this.name) :
			false;
	}

	callbackAction(confirm: boolean) {
		this.result.emit(confirm ? this.name : null);
		this.activeModal.close();
	}
}
