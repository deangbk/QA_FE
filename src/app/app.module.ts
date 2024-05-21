
// -----------------------------------------------------
// Angular modules

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// -----------------------------------------------------
// External library modules

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotifierModule, NotifierOptions } from 'angular-notifier';

// -----------------------------------------------------

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ConfigurationComponent } from './projects/configuration/configuration.component';

import { SharedModule } from './shared/shared.module';
import { ToggleFullScreenDirective } from './shared/full-screen/toggle-full-screen';

import { DataService } from './data/data.service';
import { TelemetryService } from './data/telemetry.service';
import { SecurityService } from './security/security.service';
import { JwtInterceptorService } from './security/jwt-interceptor.service';

import { InvalidPageComponent } from './invalid-page/invalid-page.component';

import { ProjectsModule } from './projects/projects.module';
import { AdminModule } from './admin/admin.module';

// -----------------------------------------------------

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
		ToggleFullScreenDirective,
		
		InvalidPageComponent,
	],
	providers: [
		DataService,
		TelemetryService,
		SecurityService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: JwtInterceptorService,
			multi: true,
		}
	],
	bootstrap: [AppComponent],
	imports: [
		CommonModule,
		
		BrowserModule, AppRoutingModule, SharedModule,
		BrowserAnimationsModule,
		
		HttpClientModule,
		
		NgbModule,
		FormsModule,
		NotifierModule.withConfig(customNotifierOptions),
		
		MatIconModule, MatButtonModule,
		
		ProjectsModule,
		//AdminModule,
	],
})
export class AppModule {}
