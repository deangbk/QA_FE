// angular import
import { NgModule, Type } from '@angular/core';
import { LoadChildrenCallback, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { ProjectGuard } from './guards/project.guard';

import { LayoutProjectsComponent } from './projects.component';

import { AuthSigninV2Component } from './auth-signin-v2/auth-signin-v2.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

import { HomeComponent } from './home/home.component';

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

import { ManageProjectComponent } from './admin-section/manage-project/manage-project.component';
import { ManageStaffComponent } from './admin-section/manage-staff/manage-staff.component';

const routes: Routes = [
	{
		path: '',
		component: LandingPageComponent,
	},
	
	{
		path: ':project',
		
		children: [
			{
				path: 'login',
				component: AuthSigninV2Component,
			},
			
			{
				path: '',
				component: LayoutProjectsComponent,
				
				canActivate: [AuthGuard, ProjectGuard],
				data: {
					roles: ['user'],
				},
				
				children: [
					{ path: '', redirectTo: 'home', pathMatch: 'full' },
					
					{ path: 'home', component: HomeComponent },
					
					{ path: 'question/:id', component: QuestionsDisplayComponent },
					{ path: 'questions/account', component: QuestionsAccountComponent },
					{ path: 'questions/general', component: QuestionsGeneralComponent },
					{ path: 'questions/submit', component: SubmitQuestionComponent },
					
					{ path: 'docs/pdf/:id', component: DocumentViewerComponent },
					{ path: 'docs/recent/:type', component: RecentDocumentsComponent },
					{ path: 'docs/recent', redirectTo: 'docs/recent/all', pathMatch: 'full' },
					
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
export class ProjectRoutingModule {}