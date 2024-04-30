
// -----------------------------------------------------
// Angular modules

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// -----------------------------------------------------
// External library modules

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { NgSelectModule } from '@ng-select/ng-select';

import { FileUploadModule } from '@iplab/ngx-file-upload';

import { NgxEditorModule } from 'ngx-editor';

// -----------------------------------------------------

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LayoutAnyComponent } from './theme/layout/any/any.component';

import { ConfigurationComponent } from './theme/shared/components/configuration/configuration.component';
import { NavBarComponent } from './theme/shared/components/nav-bar/nav-bar.component';
import { NavigationComponent } from './theme/shared/components/navigation/navigation.component';
import { NavContentComponent } from './theme/shared/components/navigation/nav-content/nav-content.component';
import { NavLogoComponent } from './theme/shared/components/navigation/nav-logo/nav-logo.component';
import { NavCollapseComponent } from './theme/shared/components/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './theme/shared/components/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './theme/shared/components/navigation/nav-content/nav-item/nav-item.component';
import { NavLeftComponent } from './theme/shared/components/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/shared/components/nav-bar/nav-right/nav-right.component';
import { NavSearchComponent } from './theme/shared/components/nav-bar/nav-left/nav-search/nav-search.component';
import { NavigationItem } from './theme/shared/components/navigation/navigation';

import { SharedModule } from './theme/shared/shared.module';
import { ToggleFullScreenDirective } from './theme/shared/full-screen/toggle-full-screen';
import { BreadcrumbModule } from './theme/shared/components/breadcrumb/breadcrumb.module';

import { QuestionsDisplayComponent } from './questions-display/questions-display.component';

import { DataService } from './data/data.service';
import { SecurityService } from './security/security.service';
import { JwtInterceptorService } from './security/jwt-interceptor.service';

import { HomeLoginComponent } from './home-login/home-login.component';
import { DocumentViewerComponent } from './document-viewer/document-viewer.component';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SearchPipe } from './pipes/search.pipe';
import { SearchBasicPipe } from './pipes/search-basic.pipe';
import { QApprovePipe } from './pipes/q-approve.pipe';
import { RecentDocumentsComponent } from './recent-documents/recent-documents.component';


import { QuestionsGeneralComponent } from './questions-general/questions-general.component';
import { QuestionsAccountComponent } from './questions-account/questions-account.component';


import { QuestionApproveComponent } from './staff-section/question-approve/question-approve.component';
import { UploadDocumentsComponent } from './staff-section/upload-documents/upload-documents.component';
import { AddUsersComponent } from './staff-section/add-users/add-users.component';
import { EditQuestionComponent } from './staff-section/edit-question/edit-question.component';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { ViewUsersComponent } from './staff-section/view-users/view-users.component';
import { SubmitQuestionComponent } from './submit-question/submit-question.component';
import { BaseChartComponent } from './charts/base-chart/base-chart.component';
import { CircleChartComponent } from './charts/circle-chart/circle-chart.component';
import { ViewStatsComponent } from './staff-section/view-stats/view-stats.component';
import { ProjectHomeComponent } from './project-home/project-home.component';

import { ProjectNoteComponent } from './project-home/project-note/project-note.component';
//import { QApprovePipe } from './pipes/q-approve.pipe';

import { QuestionModalComponent } from './modals/question-modal/question-modal.component';
import { ConfirmDeleteModalComponent } from './modals/confirm-delete-modal/confirm-delete-modal.component';
import { AddNoteModalComponent } from './modals/add-note-modal/add-note-modal.component';
import { ManageProjectComponent } from './admin-section/manage-project/manage-project.component';
import { ProjectEditInfoComponent } from './admin-section/manage-project/project-edit-info/project-edit-info.component';
import { ProjectEditTranchesComponent } from './admin-section/manage-project/project-edit-tranches/project-edit-tranches.component';
import { TrancheEditModalComponent } from './modals/tranche-edit-modal/tranche-edit-modal.component';
import { ManageStaffComponent } from './admin-section/manage-staff/manage-staff.component';
import { SelectImageModalComponent } from './modals/select-image-modal/select-image-modal.component';

const customNotifierOptions: NotifierOptions = {
	position: {
	  horizontal: {
		position: 'right',
		distance: 12
	  },
	  vertical: {
		position: 'top',
		distance: 12,
		gap: 10
	  }
	},
	theme: 'material',
	behaviour: {
	  autoHide: 5000,
	  onClick: 'hide',
	  onMouseover: 'pauseAutoHide',
	  showDismissButton: true,
	  stacking: 4
	},
	animations: {
	  enabled: true,
	  show: {
		preset: 'slide',
		speed: 300,
		easing: 'ease'
	  },
	  hide: {
		preset: 'fade',
		speed: 300,
		easing: 'ease',
		offset: 50
	  },
	  shift: {
		speed: 300,
		easing: 'ease'
	  },
	  overlap: 150
	}
  };




@NgModule({
	declarations: [
		AppComponent,
		LayoutAnyComponent,
		ConfigurationComponent,
		NavBarComponent,
		NavigationComponent,
		NavContentComponent,
		NavLogoComponent,
		NavCollapseComponent,
		NavGroupComponent,
		NavItemComponent,
		NavLeftComponent,
		NavRightComponent,
		NavSearchComponent,
		ToggleFullScreenDirective,
		QuestionsDisplayComponent,
		HomeLoginComponent,
		DocumentViewerComponent,
		SearchPipe,
		SearchBasicPipe,
		QApprovePipe ,
  RecentDocumentsComponent,
  QuestionModalComponent,
  
  QuestionsGeneralComponent,
  QuestionsAccountComponent,

  ConfirmDeleteModalComponent,
     QuestionApproveComponent,
    UploadDocumentsComponent,
    AddUsersComponent,
    EditQuestionComponent,
    ViewUsersComponent,
    SubmitQuestionComponent,
    BaseChartComponent,
    CircleChartComponent,
    ViewStatsComponent,
    ProjectHomeComponent,
    AddNoteModalComponent,
    ProjectNoteComponent,
    ManageProjectComponent,
    ProjectEditInfoComponent,
    ProjectEditTranchesComponent,
    TrancheEditModalComponent,
    ManageStaffComponent,
    SelectImageModalComponent,
   // QApprovePipe,




		
	],
	providers: [NavigationItem,
		DataService,
			SecurityService,
			{
				provide: HTTP_INTERCEPTORS,
				useClass: JwtInterceptorService,
				multi: true,
			}
	],
	bootstrap: [AppComponent],
	imports: [
		BrowserModule, AppRoutingModule, SharedModule,
		BrowserAnimationsModule, BreadcrumbModule,
		
		HttpClientModule,
		PdfViewerModule,
		NgSelectModule,
		
		NgbModule,
		NgbPaginationModule, NgbDatepickerModule,
		FormsModule,
		FileUploadModule,
		NgxEditorModule,
		
		MatIconModule, MatButtonModule, 
		NotifierModule.withConfig(customNotifierOptions),
	],
})
export class AppModule {}
