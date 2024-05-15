import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { ProjectGuard } from './guards/project.guard';

import { LayoutAnyComponent } from './theme/layout/any/any.component';

import { AuthSigninV2Component } from './public/auth-signin-v2/auth-signin-v2.component';
import { QuestionsDisplayComponent } from './questions-display/questions-display.component';
import { DocumentViewerComponent } from './document-viewer/document-viewer.component';
import { RecentDocumentsComponent } from './recent-documents/recent-documents.component';
import { QuestionsAccountComponent } from './questions-account/questions-account.component';
import { QuestionsGeneralComponent } from './questions-general/questions-general.component';
import { SubmitQuestionComponent } from './submit-question/submit-question.component';

import { QuestionApproveComponent } from './staff-section/question-approve/question-approve.component';
import { EditQuestionComponent } from './staff-section/edit-question/edit-question.component';
import { AddUsersComponent } from './staff-section/add-users/add-users.component';
import { ViewUsersComponent } from './staff-section/view-users/view-users.component';
import { UploadDocumentsComponent } from './staff-section/upload-documents/upload-documents.component';
import { ViewStatsComponent } from './staff-section/view-stats/view-stats.component';
import { ProjectHomeComponent } from './project-home/project-home.component';

import { ManageProjectComponent } from './admin-section/manage-project/manage-project.component';
import { ManageStaffComponent } from './admin-section/manage-staff/manage-staff.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full',
	},
	{
		path: 'login',
		component: AuthSigninV2Component,
	},
	
	{
		path: ':project',
		component: LayoutAnyComponent,
		
		canActivate: [AuthGuard, ProjectGuard],
		data: {
			roles: ['user'],
		},
		
		children: [
			{ path: 'home', component: ProjectHomeComponent },

			{ path: 'question/:id', component: QuestionsDisplayComponent },
			{ path: 'questions/account', component: QuestionsAccountComponent },
			{ path: 'questions/general', component: QuestionsGeneralComponent },
			{ path: 'questions/submit', component: SubmitQuestionComponent },

			{ path: 'docs/pdf/:id', component: DocumentViewerComponent },
			{ path: 'docs/recent/:type', component: RecentDocumentsComponent },
			{ path: 'docs/recent', redirectTo: 'docs/recent/all' },
			
			{
				path: 'staff',
				canActivate: [AuthGuard],
				data: {
					roles: ['manager', 'admin'],
				},

				children: [
					{ path: 'viewusers', component: ViewUsersComponent },
					{ path: 'addusers', component: AddUsersComponent },
					{ path: 'qmanage/:id', component: EditQuestionComponent },
					{ path: 'qapprove', component: QuestionApproveComponent },
					{ path: 'docupload/:qId', component: UploadDocumentsComponent },

					{ path: 'stats', component: ViewStatsComponent },
				],
			},
			{
				path: 'admin',
				canActivate: [AuthGuard],
				data: {
					roles: ['admin'],
				},

				children: [
					{ path: 'project', component: ManageProjectComponent },
					{ path: 'staff', component: ManageStaffComponent },
				],
			},
		]
	},
	{
		path: 'admin',
		component: ProjectHomeComponent,
		
		canActivate: [AuthGuard],
		data: {
			roles: ['admin'],
		},
	},
	
	{ path: '**', redirectTo: 'login' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
