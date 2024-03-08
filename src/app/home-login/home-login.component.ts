import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DataService } from '../data/data.service';
import { SecurityService } from '../security/security.service';
import * as Models from "../data/data-models";

@Component({
  selector: 'app-home-login',
  templateUrl: './home-login.component.html',
  styleUrls: ['./home-login.component.scss']
})
export class HomeLoginComponent implements OnInit {
	// TODO: Replace with the actual projectId
	projectId = 1;
	
	constructor(private router: Router, private dataService: DataService,
		private securityService: SecurityService) { }
	
	hide = true;
	userType: string = '';

	username = new FormControl('0@test.admin');
	password = new FormControl('pasaworda55');
	token: object;
	
	ngOnInit(): void {
		console.log(this.securityService.getToken());
	}

	onSelectRole(role: string) {
		this.userType = role;
	}
	
	onSubmit() {
		//console.log(this.Username.value, this.Password.value);
		
		if (this.username != null && this.password != null) {
			this.securityService.tryLogin(this.projectId, this.username.value, this.password.value)
				.subscribe({
					next: x => {
						this.securityService.saveLoginToken(x);
						//console.log(x);
						//this.router.navigate(['/sample-page']);
					},
					error: x => console.log(x),
				});
		}
	}
	
	onForgotPasswordClick() {
		console.log('click');
		this.dataService.projectGetInfo(3).subscribe({
			next: x => console.log(x),
			error: x => console.log(x),
		});
		//this.securityService.removeLoginToken();
	}
}
