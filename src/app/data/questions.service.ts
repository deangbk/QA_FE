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
export class QuestionsService extends DataService {
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
