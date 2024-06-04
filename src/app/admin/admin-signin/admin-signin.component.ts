// Angular import
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import {
	FormBuilder, FormGroup,
	Validators, ValidatorFn, AbstractControl, ValidationErrors,
} from '@angular/forms';

import { DataService } from 'app/data/data.service';
import { SecurityService } from 'app/security/security.service';

import { Helpers } from 'app/helpers';

@Component({
	selector: 'app-admin-signin',
	templateUrl: './admin-signin.component.html',
	styleUrls: ['./admin-signin.component.scss']
})
export class AuthAdminComponent implements OnInit {
	loginForm!: FormGroup;
	
	loading = false;
	submitted = false;
	error = '';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		
		private formBuilder: FormBuilder,
		
		private dataService: DataService,
		private securityService: SecurityService,
	) {
		
	}
	
	ngOnInit() {
		const targetProject = this.route.snapshot.paramMap.get('project');
		
		{
			this.loginForm = this.formBuilder.group({
				email: ['', Validators.required],
				password: ['', Validators.required],
			});
		}
	}
	
	// convenience getter for easy access to form fields
	get f() {
		return this.loginForm.controls;
	}
	
	onSubmit() {
		this.submitted = true;
		
		if (this.loginForm.invalid)
			return;
		
		let formUsername = this.f['email'];
		let formPassword = this.f['password'];
		
		this.error = '';
		this.loading = true;
		this.securityService
			.tryLogin(null, formUsername.value ?? '', formPassword.value ?? '')
			.subscribe({
				next: x => {
					this.securityService.storeLoginToken(x);
					if (this.securityService.hasRole('admin')) {
						let tree = this.router.createUrlTree(['/', 'admin', 'home']);
						let url = this.router.serializeUrl(tree);
						alert(url);
						this.router.navigateByUrl(url);
					}
					else {
						this.securityService.removeLoginToken();
						formUsername.reset();
						formPassword.reset();
						
						this.loading = false;
						this.error = 'Account has no admin access';
					}
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
