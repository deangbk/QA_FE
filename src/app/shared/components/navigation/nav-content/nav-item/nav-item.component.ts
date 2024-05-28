import { Component, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';

import { NavigationItem, NavigationBadgeFormatter } from '../../navigation';
import { DattaConfig } from 'app/app-config';

import * as Rx from 'rxjs';

import { SecurityService } from 'app/security/security.service';

import { NavContentComponent } from '../nav-content.component';

@Component({
	selector: 'app-nav-item',
	templateUrl: './nav-item.component.html',
	styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent implements OnInit, OnChanges, OnDestroy {
	@Input() item!: NavigationItem;
	config;
	themeLayout: string;
	
	subscription: Rx.Subscription;
	badgeTitle: string = null;

	constructor(
		private parent: NavContentComponent,
		
		private router: Router,
		private location: Location, private locationStrategy: LocationStrategy,
		
		private securityService: SecurityService,
		@Optional() private formatter: NavigationBadgeFormatter,
	) {
		this.themeLayout = DattaConfig.layout;
	}
	
	ngOnInit(): void {
		this.subscription = this.parent.obsUpdateBadge.subscribe({
			next: () => { this.formatBadgeTitle(); },
		});
	}
	ngOnChanges(changes: SimpleChanges) {
		this.formatBadgeTitle();
	}
	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
	
	formatBadgeTitle() {
		this.badgeTitle = this.formatter?.format(this.item);
		//console.log(this.badgeTitle);
	}
	
	getNavigateLink() {
		let orgUrl = this.item.url;
		let links = orgUrl.split('/');
		
		// TODO: Remove this hack
		if (!orgUrl.includes('login')) {
			return ['../', this.securityService.getProjectName(), ...links];
		}
		else {
			return ['../', ...links];
		}
	}
  
  closeOtherMenu(event: MouseEvent) {
    if (DattaConfig.layout === 'vertical') {
      const ele = event.target as HTMLElement;
      if (ele !== null && ele !== undefined) {
        const parent = ele.parentElement as HTMLElement;
        const up_parent = ((parent.parentElement as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
        const last_parent = up_parent.parentElement;
        const sections = document.querySelectorAll('.pcoded-hasmenu');
        for (let i = 0; i < sections.length; i++) {
          sections[i].classList.remove('active');
          sections[i].classList.remove('pcoded-trigger');
        }

        if (parent.classList.contains('pcoded-hasmenu')) {
          parent.classList.add('pcoded-trigger');
          parent.classList.add('active');
        } else if (up_parent.classList.contains('pcoded-hasmenu')) {
          up_parent.classList.add('pcoded-trigger');
          up_parent.classList.add('active');
        } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
          last_parent.classList.add('pcoded-trigger');
          last_parent.classList.add('active');
        }
      }
      if (document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
        document.querySelector('app-navigation.pcoded-navbar')?.classList.remove('mob-open');
      }
    } else {
      setTimeout(() => {
        const sections = document.querySelectorAll('.pcoded-hasmenu');
        for (let i = 0; i < sections.length; i++) {
          sections[i].classList.remove('active');
          sections[i].classList.remove('pcoded-trigger');
        }

        let current_url = this.location.path();
        const baseHref = this.locationStrategy.getBaseHref();
        if (baseHref) {
          current_url = baseHref + this.location.path();
        }
        const link = "a.nav-link[ href='" + current_url + "' ]";
        const ele = document.querySelector(link);
        if (ele !== null && ele !== undefined) {
          const parent = ele.parentElement;
          const up_parent = parent?.parentElement?.parentElement;
          const last_parent = up_parent?.parentElement;
          if (parent?.classList.contains('pcoded-hasmenu')) {
            parent.classList.add('active');
          } else if (up_parent?.classList.contains('pcoded-hasmenu')) {
            up_parent.classList.add('active');
          } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
            last_parent.classList.add('active');
          }
        }
      }, 500);
    }
  }
}
