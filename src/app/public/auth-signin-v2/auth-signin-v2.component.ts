// Angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import {
	FormBuilder, FormGroup,
	Validators, ValidatorFn, AbstractControl, ValidationErrors,
} from '@angular/forms';

import { SharedModule } from 'app/theme/shared/shared.module';

import { DataService } from 'app/data/data.service';
import { ProjectService } from 'app/data/project.service';
import { SecurityService } from 'app/security/security.service';

import { Helpers } from 'app/helpers';

//import { AuthenticationService } from 'theme/shared/service/authentication.service';

interface LoginForm {
	username: string,
	password: string,
	project: string,
	save: boolean,
}

@Component({
	selector: 'app-auth-signin-v2',
	standalone: true,
	imports: [CommonModule, RouterModule, SharedModule],
	templateUrl: './auth-signin-v2.component.html',
	styleUrls: ['./auth-signin-v2.component.scss']
})
export class AuthSigninV2Component implements OnInit {
	// public method
	static savedLogin: LoginForm = {
		username: '',
		password: '',
		project: 'BayPortFolioSale',
		save: false,
	}
	loginData: LoginForm = AuthSigninV2Component.savedLogin;
	
	loginForm!: FormGroup;
	
	loading = false;
	submitted = false;
	error = '';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		
		private formBuilder: FormBuilder,
		
		private dataService: DataService,
		private projectService: ProjectService,
		private securityService: SecurityService,
	) {
		// Redirect to home if already logged in
		/* if (securityService.isAuthenticated()) {
			this.router.navigate(['/main']);
		} */
	}
	
	ngOnInit() {
		{
			const saved = AuthSigninV2Component.savedLogin;
			this.loginForm = this.formBuilder.group({
				email: [saved.username, Validators.required],
				password: [saved.password, Validators.required],
				project: [saved.project, [
					Validators.pattern(/[A-Za-z0-9_-]+/),
					Validators.required,
				]],
			});
		}
		
		const togglePassword = document.querySelector('#togglePassword');
		const password = document.querySelector('#password');

		togglePassword.addEventListener('click', function () {
			// toggle the type attribute
			const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
			password.setAttribute('type', type);

			// toggle the icon
			this.classList.toggle('ti-eye-off');
		});
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.loginForm.controls;
	}
	
	onSubmit() {
		this.submitted = true;
		
		if (this.loginForm.invalid)
			return;
		
		let formVal = this.f;
		this.loginData.username = formVal['email'].value ?? '';
		this.loginData.password = formVal['password'].value ?? '';
		this.loginData.project = formVal['project'].value ?? '';
		
		// TODO: Save auth info if checked
		
		this.error = '';
		this.loading = true;
		this.securityService
			.tryLogin(this.loginData.project,
				this.loginData.username, this.loginData.password)
			.subscribe({
				next: x => {
					this.securityService.saveLoginToken(x);
					
					let projectName = this.securityService.getProjectName();
					this.router.navigate([projectName, 'home']);
				},
				error: (x: HttpErrorResponse) => {
					let err = Helpers.formatHttpError(x);
					
					console.log(err);
					
					this.loading = false;
					this.error = err;
				},
			});
	}
}
