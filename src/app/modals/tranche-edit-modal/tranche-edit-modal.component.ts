import {
	Component, OnInit, OnChanges,
	SimpleChanges
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Option, Some, None } from 'ts-results';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

@Component({
	selector: 'tranche-edit-modal',
	templateUrl: './tranche-edit-modal.component.html',
	styleUrls: ['./tranche-edit-modal.component.scss']
})
export class TrancheEditModalComponent implements OnInit {
	@Input() public tranche: Models.RespTrancheData = null;
	@Output() public result: EventEmitter<Option<Models.ReqBodyEditTranche>>
		= new EventEmitter();
	
	name: string;
	
	constructor(public activeModal: NgbActiveModal) { }
	
	// -----------------------------------------------------
	
	ngOnInit() {
		this.name = this.tranche.name;
	}
	
	// -----------------------------------------------------
	
	callbackAction(confirm: boolean) {
		if (confirm) {
			let edit: Models.ReqBodyEditTranche = {
				name: this.name,
			};
			this.result.emit(Some(edit));
		}
		else {
			this.result.emit(None);
		}
		
		this.activeModal.close();
	}
}
