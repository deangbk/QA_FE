import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvalidPageComponent } from './invalid-page/invalid-page.component';

const routes: Routes = [
	// Admin portal
	{
		path: 'admin',
		loadChildren: () => import('./admin/admin.module').then(x => x.AdminModule),
	},
	
	// Project portal
	{
		path: 'project',
		loadChildren: () => import('./projects/projects.module').then(x => x.ProjectsModule),
	},
	
	// User portal
	{
		path: 'user',
		loadChildren: () => import('./user/user.module').then(x => x.UserModule),
	},
	
	//{ path: '**', component: InvalidPageComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
