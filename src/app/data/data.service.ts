
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
	
	private _post_as_form(url: string, body?: any) {
		var form = body != null ? Helpers.bodyToHttpFormData(body) : null;
		return this.http
			.post(`${this.baseUrl}/${url}`, form)
			.pipe(catchError(this.handleError));
	}
	private _put_as_form(url: string, body?: any) {
		var form = body != null ? Helpers.bodyToHttpFormData(body) : null;
		return this.http
			.put(`${this.baseUrl}/${url}`, form)
			.pipe(catchError(this.handleError));
	}
	
	// -----------------------------------------------------
	// Auth
	
	public login(username: string, password: string) {
		var body: Models.ReqBodyLogin = {
			Email: username,
			Password: password,
		};
		return <Observable<Models.RespLoginToken>>
			this._post(`auth/login`, body);
	}
	
	// -----------------------------------------------------
	// Admin
	
	public adminGrantRole(userId: number, role: string) {
		return this._put(`admin/grant_role/${userId}/${role}`);
	}
	public adminRemoveRole(userId: number, role: string) {
		return this._delete(`admin/remove_role/${userId}/${role}`);
	}
	
	public adminCreateProject(create: Models.ReqBodyCreateProject) {
		return <Observable<number>>
			this._post(`admin/create_project`, create);
	}
	
	public adminGrantManager(projectId: number, userId: number) {
		return <Observable<number>>
			this._put(`admin/grant_manage/${projectId}/${userId}`);
	}
	public adminGrantManagerFromFile(projectId: number, file: File) {
		var form = new FormData();
		form.append('file', file, file.name);
		return <Observable<number>>
			this._put(`admin/grant_manage_withfile/${projectId}`, form);
	}
	public adminRemoveManager(projectId: number, userId: number) {
		return <Observable<number>>
			this._delete(`admin/remove_manage/${projectId}/${userId}`);
	}
	/*
	public adminRemoveManagerFromFile(projectId: number, file: File) {
		var form = new FormData();
		form.append('file', file, file.name);
		return this.http
			.delete(`${this.baseUrl}admin/remove_manage_withfile/${projectId}`, form)
			.pipe(catchError(this.handleError));
	}
	*/

	// -----------------------------------------------------
	// Manager
	
	public managerGrantAccess(trancheId: number, userId: number) {
		return <Observable<number>>
			this._put(`manage/grant_access/${trancheId}/${userId}`);
	}
	public managerGrantAccessFromFile(trancheId: number, file: File) {
		var form = new FormData();
		form.append('file', file, file.name);
		return <Observable<number>>
			this._put(`manage/grant_access_withfile/${trancheId}`, form);
	}
	public managerRemoveAccess(trancheId: number, userId: number) {
		return <Observable<number>>
			this._delete(`manage/remove_access/${trancheId}/${userId}`);
	}
	
	public managerBulkAddUsers(projectId: number, file: File) {
		var form = new FormData();
		form.append('file', file, file.name);
		return <Observable<number[]>>
			this._post(`manage/add_project_users/${projectId}`, form);
	}
	
	// -----------------------------------------------------
	// User
	
	public logout() {
		return this._post(`user/logout`);
	}
	
	// -----------------------------------------------------
	// Project
	
	public projectGetInfo(projectId: number) {
		return <Observable<Models.RespProjectInfo>>
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
	
	
	
	// -----------------------------------------------------
	// Account
	
	
	
	// -----------------------------------------------------
	// Question

	public questionGet(projectId: number, filter: Models.ReqBodyGetPosts, details: number = 0) {
		var query = Helpers.bodyToHttpQueryString(filter,
			["details", details]);
		return <Observable<Models.RespQuestionInfo[]>>
			this._get(`post/get_post/${projectId}?${query}`);
	}
	public questionGetPaginate(projectId: number,
		filter: Models.ReqBodyGetPosts, paginate: Models.ReqBodyPaginate,
		details: number = 0) {
		
		var queryFilter = Helpers.bodyToHttpQueryString(filter);
		var queryPaginate = Helpers.bodyToHttpQueryString(paginate);
		var query = [queryFilter, queryPaginate].join('&');
		return <Observable<Models.RespQuestionInfo[]>>
			this._get(`post/get_post/${projectId}?${query}`);
	}
	
	public questionGetComments(questionId: number) {
		return <Observable<Models.RespCommentInfo[]>>
			this._get(`post/get_comments/${questionId}`);
	}
	
	// -----------------------------------------------------
	// Document
	
	public documentGetInfo(documentId: number, details: number = 0) {
		return <Observable<Models.RespDocumentInfo>>
			this._get(`document/get_info/${documentId}?details=${details}`);
	}
	public documentGetFileData(documentId: number) {
		const httpOptions = {
			'responseType' : 'arraybuffer' as 'json'
		};
		let res = this.http
			.get(`${this.baseUrl}/document/get/${documentId}`, httpOptions)
			.pipe(catchError(this.handleError));
		return <Observable<ArrayBuffer>>res;
	}
	
	public documentGetProjectGeneralDocuments(projectId: number, details: number = 0) {
		return <Observable<Models.RespDocumentInfo[]>>
			this._get(`document/with_proj/${projectId}?details=${details}`);
	}
	public documentGetAccountDocuments(accountId: number, details: number = 0) {
		return <Observable<Models.RespDocumentInfo[]>>
			this._get(`document/with_acc/${accountId}?details=${details}`);
	}
	public documentGetQuestionDocuments(questionId: number, details: number = 0) {
		return <Observable<Models.RespDocumentInfo[]>>
			this._get(`document/with_post/${questionId}?details=${details}`);
	}
	
	public documentUploadGeneralDocument(projectId: number, data: Models.ReqBodyUploadDocument) {
		return <Observable<number>>
			this._post(`document/upload_proj/${projectId}`, data);
	}
	public documentUploadAccountDocument(accountId: number, data: Models.ReqBodyUploadDocument) {
		return <Observable<number>>
			this._post(`document/upload_acc/${accountId}`, data);
	}
	public documentUploadQuestionDocument(questionId: number, data: Models.ReqBodyUploadDocument) {
		return <Observable<number>>
			this._post(`document/upload_post/${questionId}`, data);
	}
	
	
	
	
	public getUserPassword(username: string, password: string) {
		return this.http
		.get(`${this.baseUrl}/auth/login/Email=${username}&Password=${password}`)
		.pipe(catchError(this.handleError));
	}
	
	public getQuestions() {
		return this.http
		.get(`${this.baseUrl}/post/get_page/1`)
		.pipe(catchError(this.handleError));
	}
}
