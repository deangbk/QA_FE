import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Helpers } from "../helpers";
import * as Models from "./data-models";

@Injectable({
	providedIn: 'root'
})
export class DataService {
	baseUrl: string = '';

	constructor(private http: HttpClient) {
		this.baseUrl = 'https://localhost:7203/api';
	}
	
	// -----------------------------------------------------

	protected handleError(error: HttpErrorResponse) {
		console.log(error);
		const err = new Error('Http error.')
		return throwError(() => err);
	}
	
	protected _get(url: string) {
		return this.http
			.get(`${this.baseUrl}/${url}`)
			.pipe(catchError(this.handleError));
	}
	protected _post(url: string, body?: any) {
		return this.http
			.post(`${this.baseUrl}/${url}`, body)
			.pipe(catchError(this.handleError));
	}
	protected _put(url: string, body?: any) {
		return this.http
			.put(`${this.baseUrl}/${url}`, body)
			.pipe(catchError(this.handleError));
	}
	protected _delete(url: string) {
		return this.http
			.delete(`${this.baseUrl}/${url}`)
			.pipe(catchError(this.handleError));
	}

	protected _post_as_form(url: string, body?: any) {
		var form = body != null ? Helpers.bodyToHttpFormData(body) : null;
		return this.http
			.post(`${this.baseUrl}/${url}`, form)
			.pipe(catchError(this.handleError));
	}
	protected _put_as_form(url: string, body?: any) {
		var form = body != null ? Helpers.bodyToHttpFormData(body) : null;
		return this.http
			.put(`${this.baseUrl}/${url}`, form)
			.pipe(catchError(this.handleError));
	}

	// -----------------------------------------------------
	// Auth

	public login(username: string, password: string) {
		var body: Models.ReqBodyLogin = {
			email: username,
			password: password,
		};
		return <Observable<Models.RespLoginToken>>
			this._post(`auth/login`, body);
	}

	// -----------------------------------------------------
	// Admin

	public adminGrantRole(userId: number, role: string) {
		return this._put(`admin/grant/role/${userId}/${role}`);
	}
	public adminRemoveRole(userId: number, role: string) {
		return this._delete(`admin/ungrant/role/${userId}/${role}`);
	}

	public adminGrantManager(projectId: number, userId: number) {
		return <Observable<number>>
			this._put(`admin/grant/manage/${projectId}/${userId}`);
	}
	public adminGrantManagerFromFile(projectId: number, file: File) {
		var form = new FormData();
		form.append('file', file, file.name);
		return <Observable<number>>
			this._put(`admin/grant/manage/file/${projectId}`, form);
	}

	public adminRemoveManager(projectId: number, userId: number) {
		return <Observable<number>>
			this._delete(`admin/ungrant/manage/${projectId}/${userId}`);
	}
	
	// -----------------------------------------------------
	// Manager

	public managerGrantAccess(trancheId: number, userId: number) {
		return <Observable<number>>
			this._put(`manage/grant/access/${trancheId}/${userId}`);
	}
	public managerGrantAccessFromFile(trancheId: number, file: File) {
		var form = new FormData();
		form.append('file', file, file.name);
		return <Observable<number>>
			this._put(`manage/grant/access/file/${trancheId}`, form);
	}

	public managerRemoveAccess(trancheId: number, userId: number) {
		return <Observable<number>>
			this._delete(`manage/ungrant/access/${trancheId}/${userId}`);
	}

	public managerBulkAddUsers(projectId: number, file: File) {
		var form = new FormData();
		form.append('file', file, file.name);
		return <Observable<Models.RespBulkUserCreate[]>>
			this._post(`manage/bulk/create_user/${projectId}`, form);
	}

	public managerGetPosts(projectId: number, filter: Models.ReqBodyGetPosts, details: number = 0) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		return <Observable<Models.RespPostData[]>>
			this._post(`manager/post/${projectId}?${query}`, filter);
	}

	// -----------------------------------------------------
	// User



	// -----------------------------------------------------
	// Project

	public projectGetInfo(projectId: number) {
		return <Observable<Models.RespProjectData>>
			this._get(`project/get/${projectId}`);
	}
	public projectGetUsers(projectId: number) {
		return <Observable<number[]>>
			this._get(`project/users/${projectId}`);
	}
	public projectGetManagers(projectId: number) {
		return <Observable<number[]>>
			this._get(`project/managers/${projectId}`);
	}
	public projectCountContent(projectId: number) {
		return <Observable<number[]>>
			this._get(`project/content/${projectId}`);
	}

	public projectCreate(create: Models.ReqBodyCreateProject) {
		return <Observable<number>>
			this._post(`project/create`, create);
	}

	// -----------------------------------------------------
	// Note

	public noteGetInProject(projectId: number) {
		return <Observable<Models.RespNoteData[]>>
			this._get(`note/${projectId}`);
	}
	public noteAdd(projectId: number, add: Models.ReqBodyAddNote) {
		return <Observable<number>>
			this._post(`note/${projectId}`, add);
	}
	public noteDelete(projectId: number, num: number) {
		var query = Helpers.bodyToHttpQueryString({},
			["num", num]);
		return <Observable<number>>
			this._delete(`note/${projectId}?${query}`);
	}

	// -----------------------------------------------------
	// Account

	public accountGetInfo(accountId: number, details: number = 0) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		return <Observable<Models.RespAccountData>>
			this._get(`account/${accountId}?${query}`);
	}
	public accountCreate(accountId: number, create: Models.ReqBodyCreateAccount) {
		return <Observable<Models.RespAccountData>>
			this._post(`account/${accountId}`, create);
	}
	public accountEdit(accountId: number, edit: Models.ReqBodyEditAccount) {
		return this._put(`account/edit/${accountId}`, edit);
	}
	public accountDelete(accountId: number) {
		return this._delete(`account/${accountId}`);
	}

	// -----------------------------------------------------
	// Post

	public postGet(projectId: number,
		filter: Models.ReqBodyGetPosts, paginate?: Models.ReqBodyPaginate,
		details: number = 0)
	{
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		var body: Models.ReqBodyGetPostsWithPaginate = {
			filter: filter,
			paginate: paginate,
		};
		return <Observable<Models.RespGetPost>>
			this._post(`post/page/${projectId}?${query}`, body);
	}

	public postCreateAsGeneral(projectId: number, create: Models.ReqBodyCreatePost) {
		return <Observable<number>>
			this._post(`post/general/${projectId}`, create);
	}
	public postCreateAsAccount(projectId: number, create: Models.ReqBodyCreatePost) {
		return <Observable<number>>
			this._post(`post/account/${projectId}`, create);
	}

	public postSetAnswer(postID: number, set: Models.ReqBodySetAnswer) {
		return this._put(`post/answer/${postID}`, set);
	}
	public postEdit(postID: number, edit: Models.ReqBodyEditPost) {
		return this._put(`post/edit/${postID}`, edit);
	}

	public postApproveQuestion(postID: number, approve: Models.ReqBodySetApproval) {
		return this._put(`approve/q/${postID}`, approve);
	}
	public postApproveAnswer(postID: number, approve: Models.ReqBodySetApproval) {
		return this._put(`approve/a/${postID}`, approve);
	}

	public postBulkCreateAsGeneral(projectId: number, creates: Models.ReqBodyCreatePost[]) {
		return <Observable<number[]>>
			this._post(`post/bulk/general/${projectId}`, creates);
	}
	public postBulkCreateAsAccount(projectId: number, creates: Models.ReqBodyCreatePost[]) {
		return <Observable<number[]>>
			this._post(`post/bulk/account/${projectId}`, creates);
	}
	public postBulkEdit(postID: number, edits: Models.ReqBodyEditPost[]) {
		return this._put(`post/bulk/edit/${postID}`, edits);
	}
	public postBulkAnswer(postID: number, edits: Models.ReqBodySetAnswer[]) {
		return this._put(`post/bulk/edit/${postID}`, edits);
	}

	// -----------------------------------------------------
	// Comment

	public commentGetInPost(postID: number) {
		return <Observable<Models.RespCommentData[]>>
			this._get(`comment/${postID}`);
	}
	public commentAdd(postID: number, add: Models.ReqBodyAddComment) {
		return <Observable<number>>
			this._post(`comment/${postID}`, add);
	}
	public commentDelete(postID: number, num: number) {
		var query = Helpers.bodyToHttpQueryString({},
			["num", num]);
		return <Observable<number>>
			this._delete(`comment/${postID}?${query}`);
	}
	public commentClear(postID: number) {
		return <Observable<number>>
			this._delete(`comment/all/${postID}`);
	}

	// -----------------------------------------------------
	// Document

	public documentGetInfo(documentId: number, details: number = 0) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		return <Observable<Models.RespDocumentData>>
			this._get(`document/info/${documentId}?${query}`);
	}
	public documentGetFileData(documentId: number) {
		const httpOptions = {
			'responseType': 'arraybuffer' as 'json'
		};
		let res = this.http
			.get(`${this.baseUrl}/document/stream/${documentId}`, httpOptions)
			.pipe(catchError(this.handleError));
		return <Observable<ArrayBuffer>>res;
	}

	public documentGetInProject(projectId: number, details: number = 0) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		return <Observable<Models.RespDocumentData[]>>
			this._get(`document/with/project/${projectId}?${query}`);
	}
	public documentGetInPost(postID: number, details: number = 0) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		return <Observable<Models.RespDocumentData[]>>
			this._get(`document/with/post/${postID}?${query}`);
	}
	public documentGetInAccount(accountId: number, details: number = 0) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		return <Observable<Models.RespDocumentData[]>>
			this._get(`document/with/account/${accountId}?${query}`);
	}
	
	public documentGetRecents(projectId: number, details: number = 0) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		return <Observable<Models.RespDocumentData[]>>
			this._get(`document/recent/${projectId}?${query}`);
	}

	public documentUploadToProject(projectId: number, data: Models.ReqBodyUploadDocument) {
		return <Observable<number>>
			this._post(`document/upload/project/${projectId}`, data);
	}
	public documentUploadToPost(postID: number, data: Models.ReqBodyUploadDocument) {
		return <Observable<number>>
			this._post(`document/upload/post/${postID}`, data);
	}
	public documentUploadToAccount(accountId: number, data: Models.ReqBodyUploadDocument) {
		return <Observable<number>>
			this._post(`document/upload/account/${accountId}`, data);
	}

	// -----------------------------------------------------

	public getQuestions() {
		/* return this.http
		.get(`${this.baseUrl}/post/get_page/1`)
		.pipe(catchError(this.handleError)); */
		return this.postGet(1, {}, null);
	}
}
