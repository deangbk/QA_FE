import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { NotifierService } from 'angular-notifier';

import * as Rx from 'rxjs';
import { Observable } from 'rxjs';

import { DataService } from 'app/data/data.service';
import { SecurityService } from 'app/security/security.service';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

@Injectable({
	providedIn: 'root'
})
export class ProjectService {
	projectData: Models.RespProjectData;
	projectContents: Models.RespCountContent;

	urlProjectBanner: string = '';
	urlProjectLogo: string = '';
	
	private obsProjectLoading: Rx.Subject<any>;
	private obsImagesLoading: Rx.Subject<any>;
	private loading = [false, false];
	
	constructor(
		private router: Router,
		
		private dataService: DataService,
		private securityService: SecurityService,
		
		private notifier: NotifierService,
	) { 
		this.obsProjectLoading = new Rx.Subject();
		this.obsImagesLoading = new Rx.Subject();
	}
	
	// -----------------------------------------------------
	
	public reloadProject() {
		this.loading[0] = true;
		//console.log('reloadProject');
		
		return Rx.from(this.fetchProjectData());
	}
	public reloadImages() {
		this.loading[1] = true;
		//console.log('reloadImages');
		
		return Rx.from(this.fetchProjectImages());
	}
	public reloadAll() {
		return Rx.forkJoin([
			this.reloadProject(),
			this.reloadImages(),
		]);
	}
	
	public projectLoading() {
		return this.loading[0];
	}
	public imagesLoading() {
		return this.loading[1];
	}
	public anyLoading() {
		return this.projectLoading() || this.imagesLoading();
	}
	
	public observeProjectLoad() {
		return this.obsProjectLoading;
	}
	public observeImagesLoad() {
		return this.obsImagesLoading;
	}
	
	public waitForProjectLoad() {
		return Helpers.waitUntil(() => !this.projectLoading());
	}
	public waitForImagesLoad() {
		return Helpers.waitUntil(() => !this.imagesLoading());
	}
	public waitForAllLoad() {
		return Helpers.waitUntil(() => !this.anyLoading());
	}
	
	// -----------------------------------------------------
	
	// TODO: These are probably still quite buggy
	
	private finishProjectLoad() {
		console.log('finishProjectLoad');
		
		this.loading[0] = false;
		this.obsProjectLoading.next(null);
	}
	private finishImagesLoad() {
		console.log('finishImagesLoad');
		
		this.loading[1] = false;
		this.obsImagesLoading.next(null);
	}
	
	private async fetchProjectData() {
		let res = await Helpers.observableAsPromise(
			Rx.forkJoin([
				this.dataService.projectGetInfo(),
				this.dataService.projectCountContent(),
			])
		);
		if (res.ok) {
			[this.projectData, this.projectContents] = res.val;
			this.finishProjectLoad();
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
						let propagate = _handleErr(e);
						if (propagate != null)
							return Rx.throwError(() => propagate);
						return null;
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
			this.finishImagesLoad();
		}
		else {
			this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(res.val));
		}
	}
}
