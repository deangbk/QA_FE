import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { DataService } from '../data/data.service';
import * as Models from 'app/data/data-models';

import { Helpers } from 'app/helpers';

const FIELD_TOKEN = 'l-token';
const FIELD_EXP = 'l-expire';

@Injectable({
	providedIn: 'root'
})
export class SecurityService {
	constructor(private dataService: DataService) { }
	
	private tokenData: any = null;
	
	public isValid(): boolean {
		const token = localStorage.getItem(FIELD_TOKEN);
		if (!token)
			return false;
		
		const expiration = localStorage.getItem(FIELD_EXP);
		const expirationDate = new Date(expiration);
		if (expirationDate <= new Date())
			return false;
		
		return true;
	}
	public isAuthenticated(): boolean {
		let res = this.isValid();
		if (!res) {
			// Nuke the token if session expired
			this.removeLoginToken();
		}
		return res;
	}
	
	public getToken(): string {
		return localStorage.getItem(FIELD_TOKEN) ?? '';
	}
	
	public getProjectId(): number {
		if (!this.isValid()) return -1;
		
		var idProj = this.getTokenField('proj');
		return Number(idProj);
	}
	public getProjectName(): string {
		if (!this.isValid()) return "";
		
		var name = this.getTokenField('projn');
		return name ?? "";
	}
	public getUserID(): number {
		if (!this.isValid()) return -1;

		var idClaim = this.getTokenField('id');
		return Number(idClaim);
	}
	public hasRole(role: string): boolean {
		if (!this.isValid()) return false;
		
		var rolesClaim = this.getTokenField('role');
		if (Array.isArray(rolesClaim)) {
			// Role claim has multiple roles
			return (<string[]>rolesClaim).findIndex(x => x == role) != -1;
		}
		else {
			// Role claim has only one role
			return role == rolesClaim;
		}
	}
	
	public isAdmin() {
		return this.hasRole('admin');
	}
	public isManager() {
		return this.hasRole('manager');
	}
	public isUser() {
		return this.hasRole('user');
	}
	public isElevated() {
		return this.isAdmin() || this.isManager();
	}
	
	public tryLogin(project: string, username: string, password: string):
		Observable<Models.RespLoginToken>
	{
		return this.dataService.login(project, username, password);
	}
	public logout() {
		this.removeLoginToken();
	}
	
	public saveLoginToken(authRes: Models.RespLoginToken) {
		this.removeLoginToken();
		
		//console.log('Storing tokens...'+authRes.Token+' '+authRes.Expiration);
		
		localStorage.setItem(FIELD_TOKEN, authRes.token);
		localStorage.setItem(FIELD_EXP, authRes.expiration);
	}
	public removeLoginToken() {
		console.log('Removing stored tokens...');
		
		localStorage.removeItem(FIELD_TOKEN);
		localStorage.removeItem(FIELD_EXP);
		
		this.tokenData = null;
	}
	
	private fetchToken() {
		// Decode JWT token
		const tokenData = Helpers.parseJwt(this.getToken());
		this.tokenData = tokenData;

		//console.log('Identity claims: ' + JSON.stringify(this.tokenData));
	}
	
	public getTokenField(field: string): any | undefined {
		if (this.tokenData === null)
			this.fetchToken();
		return this.tokenData[field];
	}
}
