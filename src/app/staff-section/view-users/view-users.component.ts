import {
	Component, OnInit, ChangeDetectorRef,
	Input, Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';

import { DataService } from '../../data/data.service';
import { SecurityService } from '../../security/security.service';

import * as Models from "../../data/data-models";

import { Helpers } from '../../helpers';

@Component({
	selector: 'app-view-users',
	templateUrl: './view-users.component.html',
	styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent {
	projectId = 1;

	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		private router: Router,
	) {
		this.projectId = securityService.getProjectId();
	}

	dataReady = false;
	listUsers: Models.RespUserData[] = [];
	
	enableStaff() {
		return this.securityService.isAdmin();
	}

	// -----------------------------------------------------

	ngOnInit(): void {
		this.fetchData();
	}
	
	async fetchData() {
		this.dataReady = false;
		
		let res = await Helpers.observableAsPromise(<Observable<Models.RespUserData[]>>
			this.dataService.projectGetUsers(1));
		if (res.ok) {
			this.listUsers = res.val;
		}
		else {
			console.log(res.val);
		}
		
		this.dataReady = true;
	}

	// -----------------------------------------------------

	getTrancheFormatted(u: Models.RespUserData) {
		return u.tranches.map(x => x.name).join(', ');
	}
}
