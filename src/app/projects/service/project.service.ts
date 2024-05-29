import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { NotifierService } from 'angular-notifier';

import * as Rx from 'rxjs';

import { DataService } from 'app/data/data.service';
import { SecurityService } from 'app/security/security.service';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

@Injectable()
export class ProjectService {
	projectData: Models.RespProjectData;
	projectContents: Models.RespCountContent;

	urlProjectBanner: string = '';
	urlProjectLogo: string = '';
	
	private obsProjectLoading: Rx.Subject<void>;
	private obsContentLoading: Rx.Subject<void>;
	private obsImagesLoading: Rx.Subject<void>;
	private loading = [false, false, false];
	
	constructor(
		private router: Router,
		
		private dataService: DataService,
		private securityService: SecurityService,
		
		private notifier: NotifierService,
	) { 
		this.obsProjectLoading = new Rx.Subject();
		this.obsContentLoading = new Rx.Subject();
		this.obsImagesLoading = new Rx.Subject();
	}
	
	// -----------------------------------------------------
	
	public reloadProject() {
		this.loading[0] = true;
		return Rx.from(this.fetchProjectData());
	}
	public reloadContent() {
		this.loading[1] = true;
		return Rx.from(this.fetchProjectContent());
	}
	public reloadImages() {
		this.loading[2] = true;
		return Rx.from(this.fetchProjectImages());
	}
	public reloadAll() {
		return Rx.forkJoin([
			this.reloadProject(),
			this.reloadContent(),
			this.reloadImages(),
		]);
	}
	
	public projectLoading() { return this.loading[0]; }
	public contentLoading() { return this.loading[1]; }
	public imagesLoading() { return this.loading[2]; }
	public anyLoading() {
		// any is true
		return this.loading.find(x => x) != null;
	}
	
	public observeProjectLoad() {
		return this.obsProjectLoading;
	}
	public observeContentLoad() {
		return this.obsContentLoading;
	}
	public observeImagesLoad() {
		return this.obsImagesLoading;
	}
	
	public waitForProjectLoad() {
		return Helpers.waitUntil(() => !this.projectLoading());
	}
	public waitForContentLoad() {
		return Helpers.waitUntil(() => !this.contentLoading());
	}
	public waitForImagesLoad() {
		return Helpers.waitUntil(() => !this.imagesLoading());
	}
	public waitForAllLoad() {
		return Helpers.waitUntil(() => !this.anyLoading());
	}
	
	// -----------------------------------------------------
	
	private async fetchProjectData() {
		let res = await Helpers.observableAsPromise(
			this.dataService.projectGetInfo());
		if (res.ok) {
			this.projectData = res.val;
			
			this.loading[0] = false;
			this.obsProjectLoading.next();
		}
		else {
			let e = res.val as HttpErrorResponse;
			this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(e));
		}
	}
	private async fetchProjectContent() {
		let res = await Helpers.observableAsPromise(
			this.dataService.projectCountContent());
		if (res.ok) {
			this.projectContents = res.val;

			this.loading[1] = false;
			this.obsContentLoading.next();
		}
		else {
			let e = res.val as HttpErrorResponse;
			this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(e));
		}
	}
	private async fetchProjectImages() {
		let _handleErr = (e: HttpErrorResponse) => {
			if (e.status != 404)
				return e;
			return null;
		};
		
		let res = await Helpers.observableAsPromise(
			Rx.forkJoin([
				this.dataService.projectGetLogo(),
				this.dataService.projectGetBanner(),
			])
				.pipe(
					Rx.catchError(e => {
						// Map 404 to null to make it so that they're not treated as critical errors
						
						const err = e as HttpErrorResponse;
						return err.status != 404 ?
							Rx.of(null) :
							Rx.throwError(() => err);
					}),
					Rx.mergeMap(
						(x: Blob[]) => Rx.forkJoin(
							x.map(f => f == null ? null : Helpers.fileToBlobURL(f))
						)
					)
				)
		);
		if (res.ok) {
			[this.urlProjectLogo, this.urlProjectBanner] = res.val;
			
			this.loading[2] = false;
			this.obsImagesLoading.next();
		}
		else {
			const err = res.val as HttpErrorResponse;
			if (err.status != 404)
				this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(res.val));
		}
	}
}
