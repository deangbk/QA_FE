// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from './guards/admin.guard';

import { LayoutAdminComponent } from './admin.component';

import { AuthAdminComponent } from './admin-signin/admin-signin.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';

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
					{ path: '', redirectTo: 'home' },
					
					{ path: 'home', component: AdminHomeComponent },
					
					// Redirect invalid paths back to home
					{ path: '**', redirectTo: 'home' },
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