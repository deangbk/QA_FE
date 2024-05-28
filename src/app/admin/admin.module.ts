// -----------------------------------------------------
// Angular modules

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// -----------------------------------------------------
// External library modules

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgSelectModule } from '@ng-select/ng-select';
import { FileUploadModule } from '@iplab/ngx-file-upload';

// -----------------------------------------------------

import { SharedModule } from '../shared/shared.module';

import { SecurityService } from 'app/security/security.service';
import { JwtInterceptorService } from 'app/security/jwt-interceptor.service';
import { AdminSecurityService } from './service/security.service';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutAdminComponent } from './admin.component';

import { AuthAdminComponent } from './admin-signin/admin-signin.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';

// -----------------------------------------------------

@NgModule({
	imports: [
		CommonModule,
		FormsModule, ReactiveFormsModule,
		MatIconModule, MatButtonModule,

		NgbModule,

		NgSelectModule,
		FileUploadModule,

		AdminRoutingModule,

		SharedModule,
	],
	declarations: [
		LayoutAdminComponent,
		
		AuthAdminComponent,
		AdminHomeComponent,
	],
	providers: [
		{
			provide: SecurityService,
			useClass: AdminSecurityService
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: JwtInterceptorService,
			multi: true,
		},
	],
})
export class AdminModule { }
