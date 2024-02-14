import { Component, NgZone } from '@angular/core';
import { DattaConfig } from '../../../app-config';
import { Location, LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  config;
  navCollapsed;
  navCollapsedMob: boolean;
  windowWidth: number;

  constructor(private zone: NgZone, private location: Location, private locationStrategy: LocationStrategy) {
    this.config = DattaConfig;

    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }

    this.windowWidth = window.innerWidth;

    if (
      current_url === baseHref + '/layout/collapse-menu' ||
      current_url === baseHref + '/layout/box' ||
      (this.windowWidth >= 992 && this.windowWidth <= 1024)
    ) {
      DattaConfig.isCollapseMenu = true;
    }

    this.navCollapsed = this.windowWidth >= 992 ? DattaConfig.isCollapseMenu : false;
    this.navCollapsedMob = false;
  }

  navMobClick() {
    if (this.navCollapsedMob && !document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }
}
