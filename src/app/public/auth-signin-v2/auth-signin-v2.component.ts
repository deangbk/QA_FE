// Angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule } from '@angular/router';
import { DataService } from '../../data/data.service';
import { SecurityService } from '../../security/security.service';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

//import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';

@Component({
  selector: 'app-auth-signin-v2',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './auth-signin-v2.component.html',
  styleUrls: ['./auth-signin-v2.component.scss']
})
export class AuthSigninV2Component implements OnInit {
  // public method
  usernameValue = '0@test.admin';
  userPassword = 'pasaworda55';

  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
		private securityService: SecurityService
   // private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    // if (this.authenticationService.userValue) {
    //   this.router.navigate(['/auth/signinv2']);
    // }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

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

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.error = '';
    this.loading = true;
    this.securityService.tryLogin(this.usernameValue ?? '', this.userPassword ?? '').subscribe({
			next: x => {
				this.securityService.saveLoginToken(x);
				this.router.navigate(['/main']);
			},
			error: x => console.log(x),
		});

  //   this.authenticationService
  //     .login(this.f?.['email']?.value, this.f?.['password']?.value)
  //     .pipe(first())
  //     .subscribe({
  //       next: () => {
  //         this.router.navigate(['/dashboard/default']);
  //       },
  //       error: (error) => {
  //         this.error = error;
  //         this.loading = false;
  //       }
  //     });
   }
}
