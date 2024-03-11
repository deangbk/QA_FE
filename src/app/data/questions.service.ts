import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Helpers } from "../helpers";

import { DataService } from './data.service';
import * as Models from "./data-models";

@Injectable({
	providedIn: 'root'
})
export class QuestionsService{
	baseUrl: string = '';

	constructor(private http: HttpClient) {
		this.baseUrl = 'https://localhost:7203/api';
	}
	protected handleError(error: HttpErrorResponse) {
		console.log(error);
		const err = new Error('Http error.')
		return throwError(() => err);
	}
	protected _post(url: string, body?: any) {
		const headers = { 'content-type': 'application/json' };
  
		return this.http
			.post(`${this.baseUrl}/${url}`, body, { 'headers': headers })
			.pipe(catchError(this.handleError));
	}
	protected _put(url: string, body?: any) {
		return this.http
			.put(`${this.baseUrl}/${url}`, body)
			.pipe(catchError(this.handleError));
	}

	public questionEdit(postID: number, edit: Models.RespPostData) {
		const qUpdate ={
			id: postID,
			q_num: edit.q_num,
			type: edit.type,
			category: edit.category,
			q_text: edit.q_text,
			a_text: edit.a_text,
		}
		return this._post(`manage/editq`, qUpdate);
	}

	///get questions as manager
	public postGet(projectId: number,
		filter: Models.ReqBodyGetPosts, paginate?: Models.ReqBodyPaginate,
		details: number = 1)
	{
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		var body= filter;
	//	var body= { "id": 34 }
		
		return <Observable<Models.RespPostData[]>>
			this._post(`manage/post/${projectId}?${query}`, body);
	}

	public postQ(edit: Models.RespPostData)
	{
		
		var body= { "id": edit.id,"category": edit.category, "q_text": edit.q_text, "a_text": edit.a_text}
		// var body= {
		// 	"id": edit.id,
		// 	"q_num": edit.q_num,
		// 	"type": edit.type,
		// 	"category": edit.category,
		// 	"q_text": edit.q_text,
		// 	"a_text": edit.a_text,
		// }
		
		return <Observable<Models.RespGetPost>>
			this._post(`manage/editq`, body);
	}
	/* ////questions
	public questionGet(projectId: number, filter: Models.ReqBodyGetPosts, details: number = 0) {
		var query = Helpers.bodyToHttpQueryString(filter,
			["details", details]);
		return <Observable<Models.RespPostData[]>>
			this._post(`post/page/${projectId}?${query}`);
	}

	public postGet(projectId: number,
		filter: Models.ReqBodyGetPosts, page: Models.ReqBodyPaginate,
		details: number = 0) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		var body = Helpers.bodyCombine(filter, paginate);
		return <Observable<Models.RespGetPost>>
			this._post(`post/page/${projectId}?${query}`, body);
	} */
// get questions as manager, not being used
	public getQuestions(filter: Models.ReqBodyGetPosts, projectId: number): Observable<Models.RespPostData[]> {
		/* return this.http
		.get(`${this.baseUrl}/post/get_page/1`)
		.pipe(catchError(this.handleError)); */
     
		return this.postGet(1, {}, null);
	}

}
