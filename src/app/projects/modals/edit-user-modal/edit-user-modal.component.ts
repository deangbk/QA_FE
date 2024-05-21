import {
	Component, OnInit,
	TemplateRef, ViewChild,
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Option, Some, None } from 'ts-results';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

export interface UserEditModel {
	display_name: string,
	tranches: Models.RespTrancheData[],
}
interface ItemTranche {
	tranche: Models.RespTrancheData,
	enabled: boolean,
}

@Component({
	selector: 'edit-user-modal',
	templateUrl: './edit-user-modal.component.html',
	styleUrls: ['./edit-user-modal.component.scss']
})
export class EditUserModalComponent implements OnInit {
	@Input() public user!: Models.RespUserData;
	@Input() public tranches!: Models.RespTrancheData[];
	@Output() public result: EventEmitter<Option<UserEditModel>>
		= new EventEmitter();
	
	constructor(
		public activeModal: NgbActiveModal,
	) { }
	
	displayName: string;
	userTranches: ItemTranche[];
	
	ngOnInit() {
		this.displayName = this.user.display_name;
		this.userTranches = this.tranches.map(x => ({
			tranche: x,
			enabled: this.user.tranches.find(y => y.id == x.id) != null,
		}));
	}
	
	// -----------------------------------------------------
	
	getInputError(): string | null {
		if (this.displayName == null || this.displayName.length == 0)
			return "Name must not be empty";
		if (this.userTranches.filter(x => x.enabled).length == 0)
			return "User must have access to at least 1 tranche";
		return null;
	}

	// -----------------------------------------------------
	
	callbackAction(confirm: boolean) {
		if (confirm) {
			let editModel: UserEditModel = {
				display_name: this.displayName,
				tranches: this.userTranches
					.filter(x => x.enabled)
					.map(x => x.tranche),
			};
			
			this.result.emit(Some(editModel));
		}
		else {
			this.result.emit(None);
		}
		
		this.activeModal.close();
	}
}
