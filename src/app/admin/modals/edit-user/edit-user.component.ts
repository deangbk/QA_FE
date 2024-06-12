import {
	Component, OnInit, OnChanges,
	SimpleChanges
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
	FormBuilder, FormGroup,
	Validators, ValidatorFn, AbstractControl, ValidationErrors,
	AbstractControlOptions,
} from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import * as Rx from 'rxjs';
import { Option, Some, None } from 'ts-results';

import { DataService, AuthService } from 'app/service';
import * as Models from 'app/service/data-models';

import { Helpers } from 'app/helpers';

export const validatePatternPassword = (c: AbstractControl) => {
	const val = c.value as string;
	if (val == null)
		return { required: true };
	
	if (val.length < 6)
		return { tooShort: true };
	
	let hasDigit = val.match(/[0-9]/) != null;
	if (!hasDigit)
		return { requireDigit: true };
	
	let uniqueChars = (new Set(val)).size;
	if (uniqueChars < 2)
		return { uniqueChars: true };
	
	return null;
};

@Component({
	selector: 'app-edit-user',
	templateUrl: './edit-user.component.html',
	styleUrls: ['./edit-user.component.scss']
})
export class EditUserModalComponent implements OnInit {
	@Input() user!: Models.RespUserData;
	@Output() ok = new EventEmitter<boolean>();
	
	// -----------------------------------------------------

	form: FormGroup;
	
	loading = false;
	error = '';
	
	constructor(
		private dataService: DataService,
		private authService: AuthService,
		
		private formBuilder: FormBuilder,
		
		public activeModal: NgbActiveModal,
		private notifier: NotifierService,
	) {
	
	}
	
	ngOnInit() {
		const matchPassword = (g: FormGroup) => {
			const password = g.controls['new'];
			const confirm = g.controls['con'];
			const errs = password.value !== confirm.value ?
				{ notmatch: true } :
				null
			confirm.setErrors(errs);
			return errs;
		};
		
		this.form = this.formBuilder.group(
			{
				name: [this.user.display_name, Validators.required],
				password: this.formBuilder.group(
					{
						old: [null, [Validators.required]],
						new: [null, [Validators.required, validatePatternPassword]],
						con: [null, Validators.required],
					},
					<AbstractControlOptions> {
						validators: matchPassword,
					},
				),
			},
		);
		this.form.valueChanges
			.subscribe({
				next: () => this.loadFormErrors(),
			});
		
		this.f['password'].disable();
	}
	
	// -----------------------------------------------------
	
	enablePassword = false;
	togglePasswordEnable() {
		this.enablePassword = !this.enablePassword;
		
		const fp = this.f['password'];
		this.enablePassword ? fp.enable() : fp.disable();
	}
	
	// -----------------------------------------------------

	get f() {
		return this.form.controls;
	}
	get name() {
		return this.form.get('name');
	}
	get passwordOld() {
		return this.form.get('password.old');
	}
	get passwordNew() {
		return this.form.get('password.new');
	}
	get passwordCon() {
		return this.form.get('password.con');
	}
	
	loadFormErrors() {
		//console.log(this.name.errors);
		
		this.error = '';
		try {
			if (this.passwordNew.errors)
				throw 'Password must be at least 6 characters, and contains at least 1 digit';
			
			if (this.passwordCon.errors)
				throw 'Passwords must match';
		}
		catch (e) {
			this.error = e as string;
		}
	}
	
	async callbackAction(confirm: boolean) {
		if (confirm) {
			this.error = '';
			
			if (this.form.invalid)
				return;

			await this.editUser();
			if (this.error)
				return;
			
			this.ok.emit();
			this.activeModal.close();
		}
		else {
			this.activeModal.close();
		}
	}
	
	async editUser() {
		this.error = '';
		this.loading = true;
		
		let obsJoins = [
			this.dataService.userEdit(this.authService.getUserID(),
				{
					display_name: this.name.value,
				})
		];
		if (this.enablePassword) {
			obsJoins.push(this.dataService.userChangeSelfPassword(
				{
					old: this.passwordOld.value,
					new: this.passwordNew.value,
				}));
		}
		
		let obsCombine = Rx.forkJoin(obsJoins);
		let res = await Helpers.observableAsPromise(obsCombine);
		if (res.err) {
			let e = res.val as HttpErrorResponse;
			const eMsg = Helpers.formatHttpError(e);
			
			this.error = eMsg;
			this.loading = false;
		}
		
		// TODO: Maybe kick user back out to login on password change
	}
}
