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
import { QuestionsAccountComponent } from './questions-account/questions-account.component';
import { QuestionsGeneralComponent } from './questions-general/questions-general.component';
import { QuestionApproveComponent } from './staff-section/question-approve/question-approve.component';
import { EditQuestionComponent } from './staff-section/edit-question/edit-question.component';
import { AddUsersComponent } from './staff-section/add-users/add-users.component';
import { ViewUsersComponent } from './staff-section/view-users/view-users.component';
import { SubmitQuestionComponent } from './submit-question/submit-question.component';
import { UploadDocumentsComponent } from './staff-section/upload-documents/upload-documents.component';
import { ViewStatsComponent } from './staff-section/view-stats/view-stats.component';
import { ProjectHomeComponent } from './project-home/project-home.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/login/sign',
		pathMatch: 'full'
	  },{

	
		path: '',
		component: AdminComponent,
		canActivate: [AuthGuard],
		data: { roles: ['admin', 'manager', 'user'] },

		children: [
			{
				path: '',
				redirectTo: '/login/sign',
				pathMatch: 'full'
			},
			
			{
				path: 'main',
				//loadComponent: () => import('./demo/sample-page/sample-page.component'),
				component: ProjectHomeComponent,
			},
			{
				path: 'question/:id', component: QuestionsDisplayComponent,
				//	canActivate: [AuthGuard],
				//data: { roles: ['admin', 'manager'] }
			},
			{
				path: 'questions/account', component: QuestionsAccountComponent
			},
			{
				path: 'questions/general', component: QuestionsGeneralComponent
			},
			
			{
				path: 'questions/submit', component: SubmitQuestionComponent
			},
			
			{
				path: 'docs/pdf/:id', component: DocumentViewerComponent
			},
			{
				path: 'docs/recent/:type', component: RecentDocumentsComponent,
			},
			{
				path: 'docs/recent', redirectTo: 'docs/recent/all',
			},
			
			///paths that should be protected staff and admin only
			{
				path: 'staff',
				canActivate: [AuthGuard],
				data: {
					roles: [
						'admin',
						'manager'
					]
				},
				
				children: [
					{
						path: 'viewusers', component: ViewUsersComponent,
					},
					{
						path: 'addusers', component: AddUsersComponent,
					},
					{
						path: 'qmanage/:id', component: EditQuestionComponent,
					},
					{
						path: 'qapprove', component: QuestionApproveComponent,
					},
					{
						path: 'docupload/:qId', component: UploadDocumentsComponent,
					},
						{
							path: 'stats', component: ViewStatsComponent,
						},
				
				],
			},
		]
	},
	{
		path: 'login',
		//component: GuestComponent,
		children: [
			//{ path: 'login', component: HomeLoginComponent },
			
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
