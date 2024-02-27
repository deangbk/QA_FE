import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { QuestionsDisplayComponent } from './questions-display/questions-display.component';
import { HomeLoginComponent } from './home-login/home-login.component';
import {AuthSigninV2Component} from './public/auth-signin-v2/auth-signin-v2.component';
import { AuthGuard } from './Guards/auth.guard';
import { DocumentViewerComponent } from './document-viewer/document-viewer.component';
import { RecentDocumentsComponent } from './recent-documents/recent-documents.component';

const routes: Routes = [
	{
		path: '',
		component: AdminComponent,
		canActivate: [AuthGuard],
		data: { roles: ['admin', 'manager', 'user'] },
		
		children: [
			{ path: '', redirectTo: 'sign', pathMatch: 'full' },
			
			{
				path: 'main',
				loadComponent: () => import('./demo/sample-page/sample-page.component'),
				
			},
			{ path: 'question/:id', component: QuestionsDisplayComponent,
		//	canActivate: [AuthGuard],
		//data: { roles: ['admin', 'manager'] }
	 },
			
			//{ path: 'test/document', component: DocumentViewerComponent },
			{ path: 'docs/pdf/:id', component: DocumentViewerComponent },
			{ path: 'docs/recent', component: RecentDocumentsComponent },
		]
	},
	{
		path: '',
		component: GuestComponent,
		children: [
			{ path: 'login', component: HomeLoginComponent },
			
			// {
			
			//   loadChildren: () => import('./public/public.module').then((m) => m.PublicModule)
			// },
			{
				path: 'sign',component: AuthSigninV2Component
			},
			{
				path: 'maintenance',
			//  loadChildren: () => import('./demo/pages/maintenance/maintenance.module').then((m) => m.MaintenanceModule)
			},
		]
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
