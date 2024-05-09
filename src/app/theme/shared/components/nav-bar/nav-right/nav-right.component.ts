import { Component, DoCheck } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { animate, style, transition, trigger } from '@angular/animations';
import { DattaConfig } from '../../../../../app-config';

import { Router } from '@angular/router';

import { ProjectService } from 'app/data/project.service';
import { SecurityService } from 'app/security/security.service';

@Component({
	selector: 'app-nav-right',
	templateUrl: './nav-right.component.html',
	styleUrls: ['./nav-right.component.scss'],
	providers: [NgbDropdownConfig],
	animations: [
		trigger('slideInOutLeft', [
			transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
			transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
		]),
		trigger('slideInOutRight', [
			transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
			transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
		])
	]
})
export class NavRightComponent implements DoCheck {
	visibleUserList: boolean;
	chatMessage: boolean;
	friendId;
	config = DattaConfig;
	
	bannerUrl = '';

	constructor(
		config: NgbDropdownConfig,
		private router: Router,
		
		private projectService: ProjectService,
		private securityService: SecurityService,
	) {
		config.placement = 'bottom-right';
		this.visibleUserList = false;
		this.chatMessage = false;
		
		this.projectService.observeImagesLoad()
			.subscribe(_ => {
				this.bannerUrl = this.projectService.urlProjectBanner;
			});
	}
	
	getUserName() {
		let name: string = this.securityService.getTokenField('name');
		return name;
	}
	
	onChatToggle(friend_id) {
		this.friendId = friend_id;
		this.chatMessage = !this.chatMessage;
	}

	ngDoCheck() {
		if (document.querySelector('body')?.classList.contains('datta-rtl')) {
			this.config.isRtlLayout = true;
		} else {
			this.config.isRtlLayout = false;
		}
	}

	callbackLogout() {
		this.securityService.logout();
		this.router.navigate([`/login/sign`]);
	}
}
