
// -----------------------------------------------------
// Angular modules

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// -----------------------------------------------------
// External library modules

import { NgSelectModule } from '@ng-select/ng-select';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxEditorModule } from 'ngx-editor';

// -----------------------------------------------------

import { SharedModule } from '../shared/shared.module';

import { SearchPipe } from 'app/pipes/search.pipe';
import { SearchBasicPipe } from 'app/pipes/search-basic.pipe';
import { QApprovePipe } from 'app/pipes/q-approve.pipe';

import { ProjectRoutingModule } from './projects-routing.module';
import { LayoutProjectsComponent } from './projects.component';

import { ConfigurationComponent } from './configuration/configuration.component';

import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';

import { NavigationComponent } from './navigation/navigation.component';
import { NavContentComponent } from './navigation/nav-content/nav-content.component';
import { NavLogoComponent } from './navigation/nav-logo/nav-logo.component';
import { NavCollapseComponent } from './navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './navigation/nav-content/nav-item/nav-item.component';
import { NavigationItem, NavigationBadgeFormatter } from './navigation/navigation';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavLeftComponent } from './nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './nav-bar/nav-right/nav-right.component';
import { NavSearchComponent } from './nav-bar/nav-left/nav-search/nav-search.component';

import { AddNoteModalComponent } from './modals/add-note-modal/add-note-modal.component';
import { ConfirmDeleteModalComponent } from './modals/confirm-delete-modal/confirm-delete-modal.component';
import { EditUserModalComponent } from './modals/edit-user-modal/edit-user-modal.component';
import { QuestionModalComponent } from './modals/question-modal/question-modal.component';
import { SelectImageModalComponent } from './modals/select-image-modal/select-image-modal.component';
import { TrancheEditModalComponent } from './modals/tranche-edit-modal/tranche-edit-modal.component';

// -----------------------------------------------------

import { AuthSigninV2Component } from './auth-signin-v2/auth-signin-v2.component';

import { HomeComponent } from './home/home.component';
import { ProjectNoteComponent } from './home/project-note/project-note.component';

import { QuestionsDisplayComponent } from './questions-display/questions-display.component';
import { DocumentViewerComponent } from './document-viewer/document-viewer.component';
import { RecentDocumentsComponent } from './recent-documents/recent-documents.component';
import { QuestionsAccountComponent } from './questions-account/questions-account.component';
import { QuestionsGeneralComponent } from './questions-general/questions-general.component';
import { SubmitQuestionComponent } from './submit-question/submit-question.component';

import { ChartsModule } from './charts/charts.module';
import { QuestionApproveComponent } from './staff-section/question-approve/question-approve.component';
import { EditQuestionComponent } from './staff-section/edit-question/edit-question.component';
import { AddUsersComponent } from './staff-section/add-users/add-users.component';
import { ViewUsersComponent } from './staff-section/view-users/view-users.component';
import { UploadDocumentsComponent } from './staff-section/upload-documents/upload-documents.component';
import { ViewStatsComponent } from './staff-section/view-stats/view-stats.component';

import { ManageProjectComponent } from './admin-section/manage-project/manage-project.component';
import { ProjectEditInfoComponent } from './admin-section/manage-project/project-edit-info/project-edit-info.component';
import { ProjectEditLogoComponent } from './admin-section/manage-project/project-edit-logo/project-edit-logo.component';
import { ImageDisplayEditComponent } from './admin-section/manage-project/project-edit-logo/image-display-edit/image-display-edit.component';
import { ProjectEditTranchesComponent } from './admin-section/manage-project/project-edit-tranches/project-edit-tranches.component';
import { ManageStaffComponent } from './admin-section/manage-staff/manage-staff.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

// -----------------------------------------------------

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MatIconModule, MatButtonModule,
		NgSelectModule,
		FileUploadModule,
		PdfViewerModule,
		NgxEditorModule,
		
		ProjectRoutingModule,
		
		SharedModule,
		BreadcrumbModule,
		
		ChartsModule,
	],
	declarations: [
		ConfigurationComponent, LayoutProjectsComponent,
		
		NavigationComponent,
		NavContentComponent, NavLogoComponent,
		NavCollapseComponent, NavGroupComponent, NavItemComponent,
		
		NavBarComponent,
		NavLeftComponent, NavRightComponent, NavSearchComponent,
		
		AddNoteModalComponent,
		ConfirmDeleteModalComponent,
		EditUserModalComponent,
		QuestionModalComponent,
		SelectImageModalComponent,
		TrancheEditModalComponent,
		
		SearchPipe,
		SearchBasicPipe,
		QApprovePipe,
		
		AuthSigninV2Component,
		LandingPageComponent,
		
		HomeComponent, ProjectNoteComponent,

		QuestionsDisplayComponent,
		DocumentViewerComponent,
		RecentDocumentsComponent,
		QuestionsAccountComponent,
		QuestionsGeneralComponent,
		SubmitQuestionComponent,

		QuestionApproveComponent,
		EditQuestionComponent,
		AddUsersComponent,
		ViewUsersComponent,
		UploadDocumentsComponent,
		ViewStatsComponent,
		
		ManageProjectComponent,
		ProjectEditInfoComponent,
		ProjectEditLogoComponent, ImageDisplayEditComponent,
		ProjectEditTranchesComponent,
		ManageStaffComponent,
	],
	providers: [
		NavigationItem,
		NavigationBadgeFormatter,
	]
})
export class ProjectsModule { }
