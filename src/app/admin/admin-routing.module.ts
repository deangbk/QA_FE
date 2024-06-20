// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from './guards/admin.guard';

import { LayoutAdminComponent } from './admin.component';

import { AuthAdminComponent } from './admin-signin/admin-signin.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';

import { ProjectsListComponent } from './projects-list/projects-list.component';
import { EditProjectComponent } from './projects-list/edit-project/edit-project.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { AdminsListComponent } from './admins-list/admins-list.component';

const routes: Routes = [
	{
		path: '',
		
		children: [
			{
				path: 'login',
				component: AuthAdminComponent,
			},
			
			{
				path: '',
				component: LayoutAdminComponent,
				
				canActivate: [AdminGuard],
				
				children: [
					{ path: '', redirectTo: 'home', pathMatch: 'full' },
					
					{ path: 'home', component: AdminHomeComponent },
					
					{ path: 'projects/manage', component: ProjectsListComponent },
					{ path: 'projects/manage/:id', component: EditProjectComponent },
					{ path: 'projects/create', component: CreateProjectComponent },
					
					{ path: 'site/admin', component: AdminsListComponent },
					
					// Redirect invalid paths back to home
					{ path: '**', redirectTo: 'home', pathMatch: 'full' },
				]
			},
		]
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}