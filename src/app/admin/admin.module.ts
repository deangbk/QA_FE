// -----------------------------------------------------
// Angular modules

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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

import {
	AdminAuthService,
	AdminDataService,
} from './service';
import { DataService, AuthService } from 'app/service';

import { AdminGuard } from './guards/admin.guard';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutAdminComponent } from './admin.component';

import { AuthAdminComponent } from './admin-signin/admin-signin.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';

import { ProjectsListComponent } from './projects-list/projects-list.component';
import { EditProjectComponent } from './projects-list/edit-project/edit-project.component';
import { CreateProjectComponent } from './create-project/create-project.component';

import { AdminsListComponent } from './admins-list/admins-list.component';

import { ModalsModule } from './modals/modals.module';

import { ManageProjectModule } from '../projects/admin-section/manage-project/manage-project.module';

// -----------------------------------------------------

@NgModule({
	imports: [
		CommonModule,
		FormsModule, ReactiveFormsModule,
		MatIconModule, MatButtonModule,

		NgbModule,

		NgSelectModule,
		FileUploadModule,
		
		SharedModule,
		
		AdminRoutingModule,
		
		ModalsModule,
		
		ManageProjectModule,
	],
	declarations: [
		LayoutAdminComponent,
		
		AuthAdminComponent,
		AdminHomeComponent,
		
		ProjectsListComponent,
		CreateProjectComponent,
		AdminsListComponent,
		EditProjectComponent,
	],
	providers: [
		{
			provide: DataService,
			useClass: AdminDataService
		},
		{
			provide: AuthService,
			useClass: AdminAuthService
		},
		
		AdminGuard,
	],
})
export class AdminModule { }
