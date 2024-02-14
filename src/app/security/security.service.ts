import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { DataService } from '../data/data.service';
import * as Models from "../data/data-models";

import { Helpers } from '../helpers';

@Injectable({
	providedIn: 'root'
})
export class SecurityService {
	
	constructor(private dataService: DataService) { }
	
	private tokenData: any = null;
	
	public isAuthenticated(): boolean {
		//return true;
		//this.removeLoginToken();
		
		const token = localStorage.getItem('l-token');
		//console.log(token+" token");
		if (!token) return false;
		
		const expiration = <string>localStorage.getItem('l-expire');
		const expirationDate = new Date(expiration);
		if (expirationDate <= new Date()) {
			// Session already expired, nuke the token
			this.removeLoginToken();
			return false;
		}
		
		return true;
	}
	
	public getToken(): string {
		return localStorage.getItem('l-token') ?? '';
	}
	
	public getUserID(): number {
		if (!this.isAuthenticated()) return -1;

		var idClaim = this.getTokenField('id');
		return idClaim;
	}
	public hasRole(role: string): boolean {
		if (!this.isAuthenticated()) return false;
		
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
	public isStaff() {
		return this.isAdmin() || this.isManager();
	}
	
	public tryLogin(username: string, password: string) : Observable<Models.RespLoginToken> {
		return this.dataService.login(username, password);
	}
	public logout() {
		this.removeLoginToken();
	}
	
	public saveLoginToken(authRes: Models.RespLoginToken) {
		// Remove existing token storage
		this.removeLoginToken();
		
		console.log('Storing tokens...');
		
		localStorage.setItem('l-token', authRes.token);
		localStorage.setItem('l-expire', authRes.expiration);
	}
	public removeLoginToken() {
		console.log('Removing stored tokens...');
		
		localStorage.removeItem('l-token');
		localStorage.removeItem('l-expire');
		
		this.tokenData = null;
	}
	
	private fetchToken() {
		// Decode JWT token
		const tokenData = Helpers.parseJwt(this.getToken());
		this.tokenData = tokenData;

		console.log('Identity claims: ' + JSON.stringify(this.tokenData));
	}
	
	public getTokenField(field: string) {
		if (this.tokenData === null)
			this.fetchToken();
		return this.tokenData[field];
	}
}
