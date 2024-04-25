import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { NotifierService } from 'angular-notifier';

import { DataService } from './data.service';
import * as Models from 'app/data/data-models';

import { Helpers } from 'app/helpers';

const DISPLAY_ERR = true;

@Injectable({
	providedIn: 'root',
})
export class TelemetryService extends DataService {
	constructor(
		private http2: HttpClient,
		private notifier: NotifierService,
	) {
		super(http2);
	}
	
	private sendLogQuestionView(id: number) {
		return this._post(`log/add/question/${id}`);
	}
	private sendLogAccountView(id: number) {
		return this._post(`log/add/account/${id}`);
	}
	private sendLogTrancheView(id: number) {
		return this._post(`log/add/tranche/${id}`);
	}
	private sendLogDocumentView(id: number) {
		return this._post(`log/add/document/${id}`);
	}
	private displayErr(e: HttpErrorResponse) {
		if (DISPLAY_ERR) {
			let eMsg = Helpers.formatHttpError(e);
			this.notifier.notify('error', `Activity tracking failed: ${eMsg}`);
		}
	}
	
	public logQuestionView(id: number) {
		this.sendLogQuestionView(id).subscribe({
			error: e => this.displayErr(e),
		})
	}
	public logAccountView(id: number) {
		this.sendLogAccountView(id).subscribe({
			error: e => this.displayErr(e),
		})
	}
	public logTrancheView(id: number) {
		this.sendLogTrancheView(id).subscribe({
			error: e => this.displayErr(e),
		})
	}
	public logDocumentView(id: number) {
		this.sendLogDocumentView(id).subscribe({
			error: e => this.displayErr(e),
		})
	}
}
