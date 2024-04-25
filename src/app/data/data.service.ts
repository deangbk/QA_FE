import { EnvironmentInjector, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from 'environments/environment';

import { Helpers } from 'app/helpers';
import * as Models from 'app/data/data-models';

@Injectable({
	providedIn: 'root'
})
export class DataService {
	baseUrl: string = '';
	
	constructor(private http: HttpClient) {
	//	this.baseUrl = 'https://localhost:7203/api';
		this.baseUrl = 'https://backendqa.azurewebsites.net/api';
		//this.baseUrl = environment.apiUrl;
	}
	
	// -----------------------------------------------------

	protected handleError(error: HttpErrorResponse) {
		console.log(error);
		return throwError(() => error);
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

	protected _post_as_form(url: string, form?: any) {
		const headers = new HttpHeaders();
		headers.append('Content-Type', 'multipart/form-data');
		
		return this.http
			.post(`${this.baseUrl}/${url}`, form, { 'headers': headers })
			.pipe(catchError(this.handleError));
	}
	protected _put_as_form(url: string, form?: any) {
		const headers = new HttpHeaders();
		headers.append('Content-Type', 'multipart/form-data');
		
		return this.http
			.put(`${this.baseUrl}/${url}`, form, { 'headers': headers })
			.pipe(catchError(this.handleError));
	}

	// -----------------------------------------------------
	// Auth

	public login(projectId: number, username: string, password: string) {
		var body: Models.ReqBodyLogin = {
			email: username,
			password: password,
		};
		return <Observable<Models.RespLoginToken>>
			this._post(`auth/login/${projectId}`, body);
	}

	// -----------------------------------------------------
	// Admin

	public adminGrantRole(userId: number, role: string) {
		return this._put(`admin/grant/role/${userId}/${role}`);
	}
	public adminRemoveRole(userId: number, role: string) {
		return this._delete(`admin/ungrant/role/${userId}/${role}`);
	}

	public adminGrantManagers(projectId: number, users: number[]) {
		return <Observable<number>>
			this._put(`admin/grant/manage/${projectId}`, users);
	}
	public adminGrantManagersFromFile(projectId: number, file: File) {
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
	/* public managerGrantAccessFromFile(trancheId: number, file: File) {
		var form = new FormData();
		form.append('file', file, file.name);
		return <Observable<number>>
			this._put(`manage/grant/access/file/${trancheId}`, form);
	} */
	public managerRemoveAccess(trancheId: number, userId: number) {
		return <Observable<number>>
			this._delete(`manage/ungrant/access/${trancheId}/${userId}`);
	}

	public managerBulkAddUsersFromFile(file: File) {
		var form = new FormData();
		form.append('file', file, file.name);
		return <Observable<Models.RespBulkUserCreate[]>>
			this._post(`manage/bulk/create_user`, form);
	}
	public managerBulkAddUsers(users: Models.ReqBodyCreateUser[]) {
		return <Observable<Models.RespBulkUserCreate[]>>
			this._post(`manage/bulk/create_user/json`, users);
	}
	
	public managerGetPosts(filter: Models.ReqBodyGetPosts, details: number = 0) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		return <Observable<Models.RespPostData[]>>
			this._post(`manage/post?${query}`, filter);
	}
	
	// -----------------------------------------------------
	// User
	
	public userGetSelfData(details: number = 0) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		return <Observable<Models.RespUserData>>
			this._get(`user?${query}`);
	}
	public userGetData(userId: number, details: number = 0) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		return <Observable<Models.RespUserData>>
			this._get(`user/${userId}?${query}`);
	}
	
	public userDelete(userId: number) {
		return this._delete(`user/${userId}`);
	}
	
	// -----------------------------------------------------
	// Project

	public projectGetInfo() {
		return <Observable<Models.RespProjectData>>
			this._get(`project`);
	}
	public projectGetTranches() {
		return <Observable<Models.RespTrancheData[]>>
			this._get(`project/tranches`);
	}
	public projectGetUsers(details = -1) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		return <Observable<number[]> | Observable<Models.RespUserData[]>>
			this._get(`project/users?${query}`);
	}
	public projectGetManagers(details = -1) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		return <Observable<number[]> | Observable<Models.RespUserData[]>>
			this._get(`project/managers?${query}`);
	}
	public projectCountContent() {
		return <Observable<number[]>>
			this._get(`project/content`);
	}

	public projectCreate(create: Models.ReqBodyCreateProject) {
		return <Observable<number>>
			this._post(`project/create`, create);
	}
	public projectEdit(edit: Models.ReqBodyEditProject) {
		return this._put(`project/edit`, edit);
	}
	
	// -----------------------------------------------------
	// Tranche
	
	public trancheGetInfo(trancheId: number, details: number = 0) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		return <Observable<Models.RespTrancheData>>
			this._get(`tranche/${trancheId}?${query}`);
	}
	public trancheGetInfoEx() {
		return <Observable<Models.RespTrancheDataEx[]>>
			this._get(`tranche/ex`);
	}
	
	public trancheCreate(create: Models.ReqBodyCreateTranche) {
		return <Observable<number>>
			this._post(`tranche/add`, create);
	}
	public trancheEdit(trancheId: number, edit: Models.ReqBodyEditTranche) {
		return <Observable<number>>
			this._put(`tranche/edit/${trancheId}`, edit);
	}
	public trancheDelete(trancheId: number) {
		return <Observable<number>>
			this._delete(`tranche/${trancheId}`);
	}

	// -----------------------------------------------------
	// Note

	public noteGetInProject(count = 3) {
		var query = Helpers.bodyToHttpQueryString({},
			["count", count]);
		return <Observable<Models.RespNoteData[]>>
			this._get(`note?${query}`);
	}
	public noteAdd(add: Models.ReqBodyAddNote) {
		return <Observable<number>>
			this._post(`note`, add);
	}
	public noteDelete(num: number) {
		return <Observable<number>>
			this._delete(`note/${num}`);
	}

	// -----------------------------------------------------
	// Account
	
	public accountGetInfo(accountId: number, details: number = 0) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		return <Observable<Models.RespAccountData>>
			this._get(`account/${accountId}?${query}`);
	}
	public accountCreate(projectId: number, create: Models.ReqBodyCreateAccount) {
		return <Observable<Models.RespAccountData>>
			this._post(`account/${projectId}`, create);
	}
	public accountEdit(accountId: number, edit: Models.ReqBodyEditAccount) {
		return this._put(`account/edit/${accountId}`, edit);
	}
	public accountDelete(accountId: number) {
		return this._delete(`account/${accountId}`);
	}

	// -----------------------------------------------------
	// Post

	public postGet(
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
			this._post(`post/page?${query}`, body);
	}

	public postSetAnswer(set: Models.ReqBodySetAnswer) {
		return this._put(`post/answer`, set);
	}
	public postEdit(edit: Models.ReqBodyEditPost) {
		return this._put(`post/edit`, edit);
	}

	public postApproveQuestion(approve: Models.ReqBodySetApproval) {
		return this._put(`post/approve?mode=q`, approve);
	}
	public postApproveAnswer(approve: Models.ReqBodySetApproval) {
		return this._put(`post/approve?mode=a`, approve);
	}
	
	public postBulkCreate(creates: Models.ReqBodyCreatePost[]) {
		return <Observable<number[]>>
			this._post(`post/bulk`, creates);
	}
	public postBulkEdit(edits: Models.ReqBodyEditPost[]) {
		return <Observable<number>>
			this._put(`post/bulk/edit`, edits);
	}
	public postBulkAnswer(edits: Models.ReqBodySetAnswer[]) {
		return <Observable<number>>
			this._put(`post/bulk/answer`, edits);
	}

	// -----------------------------------------------------
	// Comment

	public postGetComments(postId: number) {
		return <Observable<Models.RespCommentData[]>>
			this._get(`post/${postId}/comment`);
	}
	public postAddComment(postId: number, add: Models.ReqBodyAddComment) {
		return <Observable<number>>
			this._post(`post/${postId}/comment`, add);
	}
	public postDeleteComment(postId: number, num: number) {
		var query = Helpers.bodyToHttpQueryString({},
			["num", num]);
		return <Observable<number>>
			this._delete(`post/${postId}/comment?${query}`);
	}
	public postClearComment(postId: number) {
		return <Observable<number>>
			this._delete(`post/${postId}/comment/all`);
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

	public documentGetInProject(details: number = 0) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		return <Observable<Models.RespDocumentData[]>>
			this._get(`document/with/project?${query}`);
	}
	public documentGetInPost(postId: number, details: number = 0) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		return <Observable<Models.RespDocumentData[]>>
			this._get(`document/with/post/${postId}?${query}`);
	}
	public documentGetInAccount(accountId: number, details: number = 0) {
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		return <Observable<Models.RespDocumentData[]>>
			this._get(`document/with/account/${accountId}?${query}`);
	}
	
	public documentGetRecents(
		filter?: Models.ReqBodyFilterGetDocument, paginate?: Models.ReqBodyPaginate, 
		details: number = 0)
	{
		var query = Helpers.bodyToHttpQueryString({},
			["details", details]);
		var body: Models.ReqBodyGetDocument = {
			filter: filter,
			paginate: paginate,
		};
		return <Observable<Models.RespDocumentData[]>>
			this._post(`document/recent?${query}`, body);
	}
	
	public documentUploadFromFiles(
		files: File[],
		desc: Models.ReqBodyUploadDocumentWithFile)
	{
		var form = Helpers.bodyToHttpFormData(desc);
		
		files.forEach((file, index) => {
			form.append('files', file, file.name);
		});
		
		return <Observable<number>>
			this._post_as_form(`document/upload/file`, form);
	}
	/* public documentUploadEntryOnly(data: Models.ReqBodyUploadDocument[]) {
		return <Observable<number>>
			this._post(`document/upload`, data);
	} */
	
	/**
	 * @deprecate
	 * Deprecated, please use documentUploadFromFiles
	 */
	public documentUploadToQuestion(accountId: number, data: FormData) {
		return <Observable<number>>
			this._post(`manage/upQDoc`, data);
	}
	
	public documentBulkEdit(edits: Models.ReqBodyEditDocument[]) {
		return <Observable<number>>
			this._put(`document/bulk/edit`, edits);
	}
	public documentDelete(documentId: number) {
		return <Observable<number>>
			this._delete(`document/${documentId}`);
	}
	public documentBulkDelete(documentIds: number[]) {
		return <Observable<number>>
			this._post(`document/bulk/delete`, documentIds);
	}

	// -----------------------------------------------------
	
	public getQuestions(filter: Models.ReqBodyGetPosts): Observable<Models.RespGetPost> {
		/* return this.http
		.get(`${this.baseUrl}/post/get_page/1`)
		.pipe(catchError(this.handleError)); */
     
		return this.postGet({}, null);
	}
	public getQuestionss(filter: Models.ReqBodyGetPosts): Observable<Models.RespGetPost> {
		/* return this.http
		.get(`${this.baseUrl}/post/get_page/1`)
		.pipe(catchError(this.handleError)); */
     
		return this.postGet({}, null);
	}
	
	// -----------------------------------------------------
	
	public telemetryAddQuestionView(id: number) {
		return this._post(`log/add/question/${id}`);
	}
	public telemetryAddAccountView(id: number) {
		return this._post(`log/add/account/${id}`);
	}
	public telemetryAddTrancheView(id: number) {
		return this._post(`log/add/tranche/${id}`);
	}
	public telemetryAddDocumentView(id: number) {
		return this._post(`log/add/document/${id}`);
	}
}
