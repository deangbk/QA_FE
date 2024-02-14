import { Component, Input } from '@angular/core';
import { NavigationItem } from '../../navigation';
import { animate, style, transition, trigger } from '@angular/animations';
import { DattaConfig } from 'src/app/app-config';

@Component({
  selector: 'app-nav-collapse',
  templateUrl: './nav-collapse.component.html',
  styleUrls: ['./nav-collapse.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', display: 'block' }),
        animate('250ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [animate('250ms ease-in', style({ transform: 'translateY(-100%)' }))])
    ])
  ]
})
export class NavCollapseComponent {
  visible;
  config;
  themeLayout: string;
  @Input() item!: NavigationItem;

  constructor() {
    this.visible = false;
    this.themeLayout = DattaConfig.layout;
  }

  navCollapse(e: MouseEvent) {
    this.visible = !this.visible;

    let parent = e.target as HTMLElement;
    if (this.themeLayout === 'vertical') {
      parent = (parent as HTMLElement).parentElement as HTMLElement;
    }

    const sections = document.querySelectorAll('.pcoded-hasmenu');
    for (let i = 0; i < sections.length; i++) {
      if (sections[i] !== parent) {
        sections[i].classList.remove('pcoded-trigger');
      }
    }

    let firstParent = parent.parentElement;
    let preParent = ((parent as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
    if (firstParent?.classList.contains('pcoded-hasmenu')) {
      do {
        firstParent?.classList.add('pcoded-trigger');
        firstParent = ((firstParent as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
      } while (firstParent.classList.contains('pcoded-hasmenu'));
    } else if (preParent.classList.contains('pcoded-submenu')) {
      do {
        preParent?.parentElement?.classList.add('pcoded-trigger');
        preParent = (((preParent as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
      } while (preParent.classList.contains('pcoded-submenu'));
    }
    parent.classList.toggle('pcoded-trigger');
  }
}
