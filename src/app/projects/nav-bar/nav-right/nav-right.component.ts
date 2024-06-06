import { Component, DoCheck } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { animate, style, transition, trigger } from '@angular/animations';
import { DattaConfig } from 'app/app-config';

import { Router } from '@angular/router';

import { AuthService } from 'app/service';
import { ProjectService } from '../../service/project.service';

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
		private authService: AuthService,
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
		return this.authService.getUserName();
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
		this.authService.removeLoginToken();
		this.router.navigate([`/login/sign`]);
	}
}
