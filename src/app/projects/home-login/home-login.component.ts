import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DataService } from 'app/service/data.service';
import { AuthService } from 'app/service/auth.service';
import * as Models from 'app/service/data-models';

@Component({
  selector: 'app-home-login',
  templateUrl: './home-login.component.html',
  styleUrls: ['./home-login.component.scss']
})
export class HomeLoginComponent implements OnInit {
	// Warning: Currently unused, login page is handled by AuthSigninV2Component at the moment
	
	project = "BayPortfolioSale";
	
	constructor(private router: Router, private dataService: DataService,
		private authService: AuthService) { }
	
	hide = true;
	userType: string = '';

	username = new FormControl('');
	password = new FormControl('');
	token: object;
	
	ngOnInit(): void {
		//console.log(this.authService.getToken());
	}

	onSelectRole(role: string) {
		this.userType = role;
	}
	
	onSubmit() {
		if (this.username != null && this.password != null) {
			this.dataService.login(this.project, this.username.value, this.password.value)
				.subscribe({
					next: x => {
						this.authService.storeLoginToken(x);
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
		//this.authService.removeLoginToken();
	}
}
