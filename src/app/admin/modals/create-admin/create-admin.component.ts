import {
	Component, OnInit, OnChanges,
	SimpleChanges
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import {
	FormBuilder, FormGroup,
	Validators, ValidatorFn, AbstractControl, ValidationErrors,
} from '@angular/forms';

import {
	NgbModal, NgbActiveModal,
	NgbDate, NgbDateStruct, NgbDateAdapter, NgbDatepicker,
} from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { Option, Some, None } from 'ts-results';

import { Helpers } from 'app/helpers';

export interface CreateAdminModel {
	email: string,
}

@Component({
	selector: 'app-create-admin',
	templateUrl: './create-admin.component.html',
	styleUrls: ['./create-admin.component.scss']
})
export class CreateAdminModalComponent {
	@Output() result = new EventEmitter<Option<CreateAdminModel>>();
	
	// -----------------------------------------------------
	
	form: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		
		public activeModal: NgbActiveModal,
	) {
		
	}

	ngOnInit() {
		this.form = this.formBuilder.group({
			email: [null, [Validators.required, Validators.email]],
		});
	}
	
	// -----------------------------------------------------
	
	get f() {
		return this.form.controls;
	}
	
	async callbackAction(confirm: boolean) {
		if (confirm) {
			if (!this.form.invalid) {
				const model: CreateAdminModel = {
					email: this.form.value['email'],
				};
				
				this.result.emit(Some(model));
				this.activeModal.close();
			}
		}
		else {
			this.result.emit(None);
			this.activeModal.close();
		}
	}
}
