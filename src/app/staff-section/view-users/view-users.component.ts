import {
	Component, OnInit,
	Input, Output,
} from '@angular/core';

import { Observable, combineLatestWith } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { DataService } from '../../data/data.service';
import { SecurityService } from '../../security/security.service';

import * as Models from "../../data/data-models";
import { Helpers } from '../../helpers';

import { ConfirmDeleteModalComponent, ModalLine } from '../../modals/confirm-delete-modal/confirm-delete-modal.component';

// TODO: Create system to assign/unassign project managers

@Component({
	selector: 'app-view-users',
	templateUrl: './view-users.component.html',
	styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent {
	projectId = 1;
	isAdmin = false;
	
	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		
		private modalService: NgbModal,
		private notifier: NotifierService,
	) {
		this.projectId = securityService.getProjectId();
		this.isAdmin = securityService.isAdmin();
	}

	dataReady = false;
	listManagers: Models.RespUserData[] = [];
	listUsers: Models.RespUserData[] = [];
	
	// -----------------------------------------------------

	ngOnInit(): void {
		this.fetchData();
	}
	
	async fetchData() {
		this.dataReady = false;
		
		const obspUsers$ = this.dataService.projectGetUsers(1) as Observable<Models.RespUserData[]>;
		const obspManagers$ = this.dataService.projectGetManagers(1) as Observable<Models.RespUserData[]>;
		
		obspUsers$.pipe(combineLatestWith(obspManagers$))
			.subscribe({
				next: ([users, managers]) => {
					this.listUsers = users;
					this.listManagers = managers;

					this.dataReady = true;
				},
				error: e => {
					console.log(e);
					this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(e));
				},
			});
	}
	
	// -----------------------------------------------------
	
	getTrancheFormatted(u: Models.RespUserData) {
		return u.tranches.map(x => x.name).join(', ');
	}
	
	// -----------------------------------------------------
	
	callbackDeleteUser(id: number) {
		const modalRef = this.modalService.open(ConfirmDeleteModalComponent);
		const modalInst = modalRef.componentInstance as ConfirmDeleteModalComponent;
		{
			modalInst.title = 'Delete user?';
			modalInst.content = [
				ModalLine.normal(`All questions made by the user will also be deleted.`),
				ModalLine.danger(`This action cannot be undone!`),
			];
		}
		
		modalInst.result.subscribe((result) => {
			if (result)
				this.deleteUser(id);
		});
	}
	async deleteUser(id: number) {
		let res = await Helpers.observableAsPromise(
			this.dataService.userDelete(id));
		if (res.ok) {
			await this.fetchData();
			
			this.notifier.notify('success', `User deleted`);
		}
		else {
			console.log(res.val);
			this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(res.val));
		}
	}
}
