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
	
	constructor(private router: Router, private dataService: DataService,
		private securityService: SecurityService) { }
	
	hide = true;
	userType: string = '';

	Username = new FormControl('0@test.admin');
	Password = new FormControl('pasaworda55');
	Token: object;
	
	ngOnInit(): void {
		console.log(this.securityService.getToken());
	}

	onSelectRole(role: string) {
		this.userType = role;
	}
	
	onSubmit() {
		//console.log(this.Username.value, this.Password.value);
		
		this.securityService.tryLogin(this.Username.value ?? '', this.Password.value ?? '').subscribe({
			next: x => {
				this.securityService.saveLoginToken(x);
				this.router.navigate(['/sample-page']);
			},
			error: x => console.log(x),
		});
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
