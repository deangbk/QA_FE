import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
	FormBuilder, FormGroup,
	Validators, ValidatorFn, AbstractControl, ValidationErrors,
	AbstractControlOptions,
} from '@angular/forms';

import { DataService } from 'app/service';

import { Helpers } from 'app/helpers';

import { validatePatternPassword } from 'app/admin/modals/edit-user/edit-user.component';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
	state = 'load';
	error = '';
	
	token = '';
	userId = -1;
	project = '';
	resetToken = ''
	
	dataLoading = false;
	
	visible = false;
	form: FormGroup;
	
	constructor(
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		
		private dataService: DataService,
	) {
		
	}

	ngOnInit() {
		{
			const matchPassword = (g: FormGroup) => {
				const password = g.controls['password'];
				const confirm = g.controls['confirm'];
				const errs = password.value !== confirm.value ?
					{ notmatch: true } :
					null;
				confirm.setErrors(errs);
				return errs;
			};

			this.form = this.formBuilder.group(
				{
					password: [null, [Validators.required, validatePatternPassword]],
					confirm: [null, Validators.required],
				},
				<AbstractControlOptions>{
					validators: matchPassword,
				},
			);
		}
		
		this.verifyToken();
	}
	
	verifyToken() {
		this.token = this.route.snapshot.paramMap.get('token');
		
		this.dataService.verifyResetPasswordToken(this.token)
			.subscribe({
				next: x => {
					// ok
					
					let parts = atob(this.token).split('&');
					this.userId = Helpers.parseInt(parts[0]).unwrapOr(-1);
					this.project = parts[1];
					this.resetToken = parts[2];
					
					this.state = 'form';
				},
				error: e => {
					this.state = 'error';
					this.error = 'This link has expired or is invalid';
				},
			});
	}
	
	// -----------------------------------------------------

	get f() {
		return this.form.controls;
	}
	get password() {
		return this.form.get('password');
	}
	get confirm() {
		return this.form.get('confirm');
	}
	
	// -----------------------------------------------------
	
	async onSubmit() {
		if (this.form.invalid)
			return;
		
		this.dataLoading = true;
		
		let res = await Helpers.observableAsPromise(
			this.dataService.resetPasswordWithToken({
				token: this.token,
				password: this.password.value,
			}));
		if (res.ok) {
			this.state = 'success';
		}
		else {
			this.dataLoading = false;
			this.error = Helpers.formatHttpError(res.val);
		}
	}
}
