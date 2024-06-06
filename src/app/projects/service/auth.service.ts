import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DataService, AuthService } from 'app/service';
import * as Models from 'app/service/data-models';

import { Helpers } from 'app/helpers';

const KEY_TOKEN = 'TOKEN';
const KEY_EXPIRE = 'EXP';

@Injectable()
export class ProjectAuthService extends AuthService {
	constructor() {
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
}
