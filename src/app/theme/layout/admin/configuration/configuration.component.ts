import { Component, OnInit, NgZone } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { DattaConfig } from 'src/app/app-config';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  isColorIcon!: boolean;
  headerBackgroundColor!: string;
  navbarBackgroundColor!: string;
  brandBackgroundColor!: string;
  navBackgroundImage;
  rtlLayout!: boolean;
  menuFixedLayout!: boolean;
  headerFixedLayout!: boolean;
  boxLayout!: boolean;
  menuDropdownIcon!: string;
  menuListIcon!: string;
  navActiveColor!: string;
  navTitleColor!: string;
  menuTitleHide!: boolean;

  constructor(private zone: NgZone, private location: Location, private locationStrategy: LocationStrategy) {}

  ngOnInit() {
    if ((this.isColorIcon = DattaConfig.isNavIconColor)) {
      (document.querySelector('.pcoded-navbar') as HTMLDivElement).classList.add('icon-colored');
    }
    if ((this.headerBackgroundColor = DattaConfig.headerBackColor)) {
      (document.querySelector('.pcoded-header') as HTMLDivElement).classList.add(this.headerBackgroundColor);
    }
    if ((this.navbarBackgroundColor = DattaConfig.navBackColor)) {
      (document.querySelector('.pcoded-navbar') as HTMLDivElement).classList.add(this.navbarBackgroundColor);
    }
    if ((this.brandBackgroundColor = DattaConfig.navBrandColor)) {
      (document.querySelector('.pcoded-navbar') as HTMLDivElement).classList.add(this.brandBackgroundColor);
    }
    if ((this.navBackgroundImage = DattaConfig.navBackImage)) {
      (document.querySelector('.pcoded-navbar') as HTMLDivElement).classList.add(this.navBackgroundImage);
    }
    if ((this.rtlLayout = DattaConfig.isRtlLayout)) {
      (document.querySelector('body') as HTMLBodyElement).classList.add('datta-rtl');
    }
    if ((this.menuFixedLayout = DattaConfig.isNavFixedLayout)) {
      (document.querySelector('.pcoded-navbar') as HTMLDivElement).classList.add('menupos-static');
    }
    if ((this.headerFixedLayout = DattaConfig.isHeaderFixedLayout)) {
      (document.querySelector('.pcoded-header') as HTMLDivElement).classList.add('headerpos-fixed');
      (document.querySelector('.pcoded-header') as HTMLDivElement).classList.add('header-blue');
    }
    if ((this.boxLayout = DattaConfig.isBoxLayout)) {
      (document.querySelector('body') as HTMLBodyElement).classList.add('container');
      (document.querySelector('body') as HTMLBodyElement).classList.add('box-layout');
    }
    if ((this.menuDropdownIcon = DattaConfig.navDropdownIcon)) {
      (document.querySelector('.pcoded-navbar') as HTMLDivElement).classList.add('drp-icon-' + this.menuDropdownIcon);
    }
    if ((this.menuListIcon = DattaConfig.navListIcon)) {
      (document.querySelector('.pcoded-navbar') as HTMLDivElement).classList.add('menu-item-icon-' + this.menuListIcon);
    }
    if ((this.navActiveColor = DattaConfig.navActiveListColor)) {
      (document.querySelector('.pcoded-navbar') as HTMLDivElement).classList.add(this.navActiveColor);
    }
    if ((this.navTitleColor = DattaConfig.navListTitleColor)) {
      (document.querySelector('.pcoded-navbar') as HTMLDivElement).classList.add(this.navTitleColor);
    }
    if ((this.menuTitleHide = DattaConfig.isNavListTitleHide)) {
      (document.querySelector('.pcoded-navbar') as HTMLDivElement).classList.add('caption-hide');
    }
  }
}
