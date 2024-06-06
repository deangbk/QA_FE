import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { DataService } from 'app/data/data.service';
import * as Models from 'app/data/data-models';

import { SecurityService } from 'app/security/security.service';

import { Helpers } from 'app/helpers';

@Injectable()
export class AdminSecurityService extends SecurityService {
	constructor(private dataService: DataService) {
		super();
	}
	
	token: string;
	expire: string;
	
	override getToken(): string {
		return this.token ?? '';
	}
	override getExpiration(): string {
		return this.expire ?? '';
	}
	
	override storeLoginToken(authRes: any): void {
		this.removeLoginToken();
		
		const authAsModel = authRes as Models.RespLoginToken;
		this.token = authAsModel.token;
		this.expire = authAsModel.expiration;
	}
	override removeLoginToken(): void {
		this.tokenData = null;
		
		this.token = null;
		this.expire = null;
	}

		localStorage.removeItem(KEY_TOKEN);
		localStorage.removeItem(KEY_EXPIRE);
	}
}
