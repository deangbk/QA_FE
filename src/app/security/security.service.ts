import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { DataService } from 'app/data/data.service';
import * as Models from 'app/data/data-models';

import { Helpers } from 'app/helpers';

@Injectable()
export abstract class SecurityService {
	public abstract getToken(): string;
	protected abstract getExpiration(): string;
	
	public abstract tryLogin(
		project: string | null, username: string, password: string
	)
		: Observable<any>;
	
	protected isIdentityValid(): boolean { return true; }
	
	public abstract storeLoginToken(authRes: any): void;
	public abstract removeLoginToken(): void;
	
	// -----------------------------------------------------
	
	protected tokenData: any = null;
	
	public isValidToken(): boolean {
		if (!this.getToken())
			return false;
		
		const expirationDate = new Date(this.getExpiration());
		if (expirationDate <= new Date())
			return false;
		
		return this.isIdentityValid();
	}
	public isAuthenticated(): boolean {
		let res = this.isValidToken();
		if (!res) {
			// Nuke the token if session expired
			this.removeLoginToken();
		}
		return res;
	}
	
	public getProjectId(): number {
		if (!this.isValidToken()) return -1;
		
		var idProj = this.getTokenField('proj');
		return Number(idProj);
	}
	public getProjectName(): string {
		if (!this.isValidToken()) return "";
		
		var name = this.getTokenField('projn');
		return name ?? "";
	}
	public getUserID(): number {
		if (!this.isValidToken()) return -1;

		var idClaim = this.getTokenField('id');
		return Number(idClaim);
	}
	public getUserName(): string {
		if (!this.isValidToken()) return "";

		var name = this.getTokenField('name');
		return name ?? "";
	}
	public hasRole(role: string): boolean {
		if (!this.isValidToken()) return false;
		
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
	
	protected decodeToken() {
		// Decode JWT token
		const tokenData = Helpers.parseJwt(this.getToken());
		this.tokenData = tokenData;
	}
	
	protected getTokenField(field: string): any | undefined {
		if (this.tokenData === null)
			this.decodeToken();
		return this.tokenData[field];
	}
}
