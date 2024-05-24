import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgScrollbarModule } from 'ngx-scrollbar';

import { NavigationComponent } from './navigation.component';
import { NavContentComponent } from './nav-content/nav-content.component';
import { NavLogoComponent } from './nav-logo/nav-logo.component';
import { NavCollapseComponent } from './nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './nav-content/nav-item/nav-item.component';


@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		
		NgScrollbarModule,
	],
	declarations: [
		NavigationComponent,
		NavContentComponent,
		NavLogoComponent,
		NavCollapseComponent,
		NavGroupComponent,
		NavItemComponent,
	],
	exports: [
		NavigationComponent,
	],
})
export class NavigationModule { }
