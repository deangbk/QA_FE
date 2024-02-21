import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';
import { NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavLogoComponent } from './theme/layout/admin/navigation/nav-logo/nav-logo.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { NavSearchComponent } from './theme/layout/admin/nav-bar/nav-left/nav-search/nav-search.component';
import { ChatMsgComponent } from './theme/layout/admin/nav-bar/nav-right/chat-msg/chat-msg.component';
import { ChatUserListComponent } from './theme/layout/admin/nav-bar/nav-right/chat-user-list/chat-user-list.component';
import { FriendComponent } from './theme/layout/admin/nav-bar/nav-right/chat-user-list/friend/friend.component';
import { SharedModule } from './theme/shared/shared.module';
import { NavigationItem } from './theme/layout/admin/navigation/navigation';
import { ToggleFullScreenDirective } from './theme/shared/full-screen/toggle-full-screen';
import { BreadcrumbModule } from './theme/shared/components/breadcrumb/breadcrumb.module';
import { QuestionsDisplayComponent } from './questions-display/questions-display.component';
import { DataService } from './data/data.service';
import { SecurityService } from './security/security.service';
import { JwtInterceptorService } from './security/jwt-interceptor.service';

import { HomeLoginComponent } from './home-login/home-login.component';
import { DocumentViewerComponent } from './document-viewer/document-viewer.component';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SearchPipe } from './Pipes/search.pipe';
import { SearchBasicPipe } from './Pipes/search-basic.pipe';

@NgModule({
	declarations: [
		AppComponent,
		AdminComponent,
		GuestComponent,
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
		ChatMsgComponent,
		ChatUserListComponent,
		FriendComponent,
		ToggleFullScreenDirective,
		QuestionsDisplayComponent,
		HomeLoginComponent,
		DocumentViewerComponent,
		SearchPipe,
		SearchBasicPipe,
		
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
		
		MatIconModule, MatButtonModule, 
	]
})
export class AppModule {}
