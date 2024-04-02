// Angular import
import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

// project import
import { NavigationItem } from '../navigation/navigation';

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
	// public props
	@Input() type: string;
	//navigation;
	breadcrumbList = [];
	navigationList;
	
	@Input() navigation: NavigationItem[] = [];
	
	// Constructor
	constructor(private _router: Router, public nav: NavigationItem, private titleService: Title) {
		//this.navigation = NavigationItem.get();
		
		this.type = 'theme2';
	}
	
	ngOnInit() {
		this.refreshNavigation(this._router.url);
	}
	
	// public method
	setBreadcrumb() {
		let routerUrl: string;
		this._router.events.subscribe((router: NavigationEnd) => {
			routerUrl = router.urlAfterRedirects;
			if (routerUrl && typeof routerUrl === 'string') {
				this.refreshNavigation(router.url);
			}
		});
	}
	
	refreshNavigation(url: string) {
		this.breadcrumbList.length = 0;
		this.filterNavigation(url);
	}

	filterNavigation(activeLink) {
		let result: object;
		let title = 'Welcome';
		this.navigation.forEach(function (a) {
			if (a.type === 'item' && 'url' in a && a.url === activeLink) {
				result = [
					{
						url: 'url' in a ? a.url : false,
						title: a.title,
						breadcrumbs: 'breadcrumbs' in a ? a.breadcrumbs : true,
						type: a.type
					}
				];
				title = a.title;
			} else {
				if (a.type === 'group' && 'children' in a) {
					a.children.forEach(function (b) {
						if (b.type === 'item' && 'url' in b && b.url === activeLink) {
							result = [
								{
									url: 'url' in a ? a.url : false,
									title: a.title,
									breadcrumbs: 'breadcrumbs' in a ? a.breadcrumbs : true,
									type: a.type
								},
								{
									url: 'url' in b ? b.url : false,
									title: b.title,
									breadcrumbs: 'breadcrumbs' in b ? b.breadcrumbs : true,
									type: b.type
								}
							];
							title = b.title;
						} else {
							if (b.type === 'collapse' && 'children' in b) {
								b.children.forEach(function (c) {
									if (c.type === 'item' && 'url' in c && c.url === activeLink) {
										result = [
											{
												url: 'url' in b ? b.url : false,
												title: b.title,
												breadcrumbs: 'breadcrumbs' in b ? b.breadcrumbs : true,
												type: b.type
											},
											{
												url: 'url' in c ? c.url : false,
												title: c.title,
												breadcrumbs: 'breadcrumbs' in c ? c.breadcrumbs : true,
												type: c.type
											}
										];
										title = c.title;
									} else {
										if (c.type === 'collapse' && 'children' in c) {
											c.children.forEach(function (d) {
												if (d.type === 'item' && 'url' in d && d.url === activeLink) {
													result = [
														{
															url: 'url' in c ? c.url : false,
															title: c.title,
															breadcrumbs: 'breadcrumbs' in c ? c.breadcrumbs : true,
															type: c.type
														},
														{
															url: 'url' in d ? d.url : false,
															title: d.title,
															breadcrumbs: 'breadcrumbs' in d ? d.breadcrumbs : true,
															type: d.type
														}
													];
													title = d.title;
												}
											});
										}
									}
								});
							}
						}
					});
				}
			}
		});
		this.navigationList = result;
		this.titleService.setTitle(title + ' | NPL Portfolio Platform');
	}
}
