// Angular import
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {
	FormBuilder, FormGroup,
	Validators, ValidatorFn, AbstractControl, ValidationErrors,
} from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DataService, AuthService } from 'app/service';
import { ProjectService } from '../service/project.service';

import { Helpers } from 'app/helpers';

import { ForgetPasswordModalComponent } from 'app/forget-password-modal/forget-password-modal.component';

interface LoginForm {
	username: string,
	password: string,
	save: boolean,
}

@Component({
	selector: 'app-auth-signin-v2',
	templateUrl: './auth-signin-v2.component.html',
	styleUrls: ['./auth-signin-v2.component.scss']
})
export class AuthSigninV2Component implements OnInit {
	targetProject: string;
	projectStatus = 'load';
	projectName: string;
	projectActualId: string;
	
	static savedLogin: LoginForm = {
		username: '',
		password: '',
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
		public authService: AuthService,
		
		private modalService: NgbModal,
	) {
		
	}
	
	ngOnInit() {
		this.targetProject = this.route.snapshot.paramMap.get('project');
		
		this.findProject();
	
		{
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
	}
	
	// TODO: Maybe load and display logo as well?
	findProject() {
		this.dataService.unauthFindProject(this.targetProject).subscribe({
			next: x => {
				{
					const saved = AuthSigninV2Component.savedLogin;
					this.loginForm = this.formBuilder.group({
						email: [saved.username, Validators.required],
						password: [saved.password, Validators.required],
					});
				}
				
				this.projectName = x.display_name;
				this.projectActualId = x.name;
				
				this.projectStatus = 'ok';
			},
			error: e => {
				this.projectStatus = 'error';
			},
		});
	}
	
	// convenience getter for easy access to form fields
	get f() {
		return this.loginForm.controls;
	}
	
	getHomeNavigation() {
		let projectName = this.authService.getProjectName();
		return ['/', 'project', projectName, 'home'];
	}
	
	onSubmit() {
		this.submitted = true;
		
		if (this.loginForm.invalid)
			return;
		
		let formVal = this.f;
		this.loginData.username = formVal['email'].value ?? '';
		this.loginData.password = formVal['password'].value ?? '';
		
		if (this.loginData.save) {
			AuthSigninV2Component.savedLogin.username = this.loginData.username;
			AuthSigninV2Component.savedLogin.password = this.loginData.password;
		}
		
		this.error = '';
		this.loading = true;
		this.dataService
			.login(this.projectActualId, this.loginData.username, this.loginData.password)
			.subscribe({
				next: x => {
					this.authService.storeLoginToken(x);
					
					let tree = this.router.createUrlTree(this.getHomeNavigation());
					let url = this.router.serializeUrl(tree);
					this.router.navigateByUrl(url);
				},
				error: (x: HttpErrorResponse) => {
					let err = Helpers.formatHttpError(x);
					
					console.log(err);
					
					this.loading = false;
					this.error = err;
				},
			});
	}
	
	forgotPassword() {
		const modalRef = this.modalService.open(ForgetPasswordModalComponent);
		const inst = modalRef.componentInstance as ForgetPasswordModalComponent;
		{
			inst.project = this.projectActualId;
		}
	}
}
