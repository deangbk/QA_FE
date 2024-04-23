import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Helpers } from 'app/helpers';

import { DataService } from './data.service';
import * as Models from 'app/data/data-models';

@Injectable({
	providedIn: 'root'
})
export class QuestionsService extends DataService {
	public questionEdit(postID: number, edit: Models.RespPostData) {
		const qUpdate = {
			id: postID,
			q_num: edit.q_num,
			type: edit.type,
			category: edit.category,
			q_text: edit.q_text,
			a_text: edit.a_text,
		} 
		return this._post(`manage/editq`, qUpdate);
		
		/* const qUpdate: Models.ReqBodyEditPost = {
			id: postID,
			category: edit.category,
			q_text: edit.q_text,
			a_text: edit.a_text,
		}
		return this._post(`post/edit`, qUpdate); */
	}
	
	public postQ(edit: Models.RespPostData)
	{
		
		//var body= { "id": edit.id,"category": edit.category, "q_text": edit.q_text, "a_text": edit.a_text}
		
		//return <Observable<Models.RespGetPost>>
		//	this._post(`manage/editq`, body);
		
		const qUpdate: Models.ReqBodyEditPost = {
			id: edit.id,
			category: edit.category,
			q_text: edit.q_text,
			a_text: edit.a_text,
		}
		return this._post(`post/edit`, qUpdate);
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
}
