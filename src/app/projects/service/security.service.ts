import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { DataService } from 'app/data/data.service';
import * as Models from 'app/data/data-models';

import { SecurityService } from 'app/security/security.service';

import { Helpers } from 'app/helpers';

const KEY_TOKEN = 'TOKEN';
const KEY_EXPIRE = 'EXP';

@Injectable()
export class ProjectSecurityService extends SecurityService {
	constructor(private dataService: DataService) {
		super();
	}
	
	override getToken(): string {
		const value = localStorage.getItem(KEY_TOKEN);
		return value ?? '';
	}
	override getExpiration(): string {
		const value = localStorage.getItem(KEY_EXPIRE);
		return value ?? '';
	}
	
	override storeLoginToken(authRes: any): void {
		this.removeLoginToken();
		
		const authAsModel = authRes as Models.RespLoginToken;
		localStorage.setItem(KEY_TOKEN, authAsModel.token);
		localStorage.setItem(KEY_EXPIRE, authAsModel.expiration);
	}
	override removeLoginToken(): void {
		this.tokenData = null;
		
		localStorage.removeItem(KEY_TOKEN);
		localStorage.removeItem(KEY_EXPIRE);
	}
	
	override tryLogin(
		project: string | null, username: string, password: string
	)
		: Observable<any>
	{
		return this.dataService.login(project, username, password);
	}
}
