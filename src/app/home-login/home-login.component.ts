import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DataService } from '../data/data.service';
import { SecurityService } from '../security/security.service';
import * as Models from 'app/data/data-models';

@Component({
  selector: 'app-home-login',
  templateUrl: './home-login.component.html',
  styleUrls: ['./home-login.component.scss']
})
export class HomeLoginComponent implements OnInit {
	// Warning: Currently unused, login page is handled by AuthSigninV2Component at the moment
	
	project = "BayPortfolioSale";
	
	constructor(private router: Router, private dataService: DataService,
		private securityService: SecurityService) { }
	
	hide = true;
	userType: string = '';

	username = new FormControl('');
	password = new FormControl('');
	token: object;
	
	ngOnInit(): void {
		//console.log(this.securityService.getToken());
	}

	onSelectRole(role: string) {
		this.userType = role;
	}
	
	onSubmit() {
		if (this.username != null && this.password != null) {
			this.securityService.tryLogin(this.project, this.username.value, this.password.value)
				.subscribe({
					next: x => {
						this.securityService.saveLoginToken(x);
						//console.log(x);
						this.router.navigate(['/main']);
					},
					error: x => console.log(x),
				});
		}
	}
	
	onForgotPasswordClick() {
		// TODO: Remove this test code
		
		console.log('click');
		this.dataService.projectGetInfo().subscribe({
			next: x => console.log(x),
			error: x => console.log(x),
		});
		//this.securityService.removeLoginToken();
	}
}
