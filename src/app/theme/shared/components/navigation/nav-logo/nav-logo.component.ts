import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ProjectService } from 'app/data/project.service';

@Component({
	selector: 'app-nav-logo',
	templateUrl: './nav-logo.component.html',
	styleUrls: ['./nav-logo.component.scss']
})
export class NavLogoComponent {
	@Input() navCollapsed!: boolean;
	@Output() NavCollapse = new EventEmitter();
	public windowWidth: number;
	
	logoUrl = '';
	
	constructor(private projectService: ProjectService) {
		this.windowWidth = window.innerWidth;
		
		this.projectService.observeImagesLoad()
			.subscribe(_ => {
				this.logoUrl = this.projectService.urlProjectLogo;
			});
	}
	
	navCollapse() {
		if (this.windowWidth >= 992) {
			this.navCollapsed = !this.navCollapsed;
			this.NavCollapse.emit();
		}
	}
}
