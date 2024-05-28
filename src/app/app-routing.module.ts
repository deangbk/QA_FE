import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvalidPageComponent } from './invalid-page/invalid-page.component';

const routes: Routes = [
	// Broken for some reason
	/* {
		path: '',
		redirectTo: 'project',
	}, */
	
	// Admin portal
	{
		path: 'admin',
		loadChildren: () => import('./admin/admin.module').then(x => x.AdminModule),
	},
	
	// User portal
	{
		path: 'project',
		loadChildren: () => import('./projects/projects.module').then(x => x.ProjectsModule),
	},
	
	//{ path: '**', component: InvalidPageComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
