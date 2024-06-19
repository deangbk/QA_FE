import {
	Component, OnInit, OnChanges,
	SimpleChanges
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormsModule, ReactiveFormsModule,
	FormBuilder, FormGroup,
	Validators, ValidatorFn, AbstractControl, ValidationErrors,
} from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Option, Some, None } from 'ts-results';

import { DataService } from 'app/service';

import { Helpers } from 'app/helpers';

@Component({
	selector: 'app-forget-password-modal',
	templateUrl: './forget-password-modal.component.html',
	styleUrls: ['./forget-password-modal.component.scss'],
	
	standalone: true,
	imports: [
		CommonModule,
		FormsModule, ReactiveFormsModule,
	],
	providers: [
		DataService,
	],
})
export class ForgetPasswordModalComponent implements OnInit {
	@Input() project: string = null;
	
	// -----------------------------------------------------
	
	state = 0;
	loading = false;
	
	form: FormGroup;
	
	constructor(
		private dataService: DataService,
		
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
	
	get email() {
		return this.form.get('email');
	}
	
	async callbackSend() {
		if (this.form.invalid)
			return;
		
		{
			this.loading = true;
		
			var obs = this.dataService.resetPassword({
				project: this.project,
				email: this.email.value,
			});
			await Helpers.observableAsPromise(obs);
		
			this.loading = false;
		}
		
		this.state = 1;
	}
	async callbackClose() {
		this.activeModal.close();
	}
}
