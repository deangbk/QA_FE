import {
	Component, OnInit, OnChanges,
	SimpleChanges
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Option, Some, None } from 'ts-results';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

type ModelCreateOrEdit = Models.ReqBodyEditTranche | Models.ReqBodyCreateTranche;
export type FnCheckDuplicate = (name: string) => boolean;

@Component({
	selector: 'tranche-edit-modal',
	templateUrl: './tranche-edit-modal.component.html',
	styleUrls: ['./tranche-edit-modal.component.scss']
})
export class TrancheEditModalComponent implements OnInit {
	@Input() public tranche: Models.RespTrancheData = null;
	@Input() public fnCheckDuplicate: FnCheckDuplicate = null;
	@Input() public creating = false;
	
	@Output() public result: EventEmitter<Option<ModelCreateOrEdit>>
		= new EventEmitter();
	
	name: string;
	
	constructor(public activeModal: NgbActiveModal) { }
	
	// -----------------------------------------------------
	
	ngOnInit() {
		this.name = this.tranche.name;
	}
	
	getNameError(): string | null {
		if (this.name == null || this.name.length == 0)
			return "Name must not be empty";
		if (this.name.length > 16)
			return "Name must not be longer than 16 characters";
		if (this.tranche == null || this.name != this.tranche.name) {
			if (this.fnCheckDuplicate != null && this.fnCheckDuplicate(this.name))
				return "Name must be unique";
		}
		return null;
	}
	
	// -----------------------------------------------------
	
	callbackAction(confirm: boolean) {
		if (confirm) {
			let model: ModelCreateOrEdit;
			if (this.creating) {
				model = <Models.ReqBodyCreateTranche>{
					name: this.name,
				};
			}
			else {
				model = <Models.ReqBodyEditTranche>{
					name: this.name,
				};
			}
			this.result.emit(Some(model));
		}
		else {
			this.result.emit(None);
		}
		
		this.activeModal.close();
	}
}
