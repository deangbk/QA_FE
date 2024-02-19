import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Helpers } from "../helpers";
import * as Models from "./data-models";

@Injectable({
	providedIn: 'root'
})
export class QuestionsService {
	baseUrl: string = '';

	constructor(private http: HttpClient) {
		this.baseUrl = 'https://localhost:7203/api';
	}
	private handleError(error: HttpErrorResponse) {
		console.log(error);
		const err = new Error('Http error.')
		return throwError(() => err);
	}
	private _get(url: string) {
		return this.http
			.get(`${this.baseUrl}/${url}`)
			.pipe(catchError(this.handleError));
	}
	private _post(url: string, body?: any) {
		return this.http
			.post(`${this.baseUrl}/${url}`, body)
			.pipe(catchError(this.handleError));
	}
	private _put(url: string, body?: any) {
		return this.http
			.put(`${this.baseUrl}/${url}`, body)
			.pipe(catchError(this.handleError));
	}
	private _delete(url: string) {
		return this.http
			.delete(`${this.baseUrl}/${url}`)
			.pipe(catchError(this.handleError));
	}

	////questions
	public questionGet(projectId: number, filter: Models.ReqBodyGetPosts, details: number = 0) {
		var query = Helpers.bodyToHttpQueryString(filter,
			["details", details]);
		return <Observable<Models.RespPostData[]>>
			this._get(`post/get_posts/${projectId}?${query}`);
	}

}
