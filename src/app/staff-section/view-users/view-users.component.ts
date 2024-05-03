import {
	Component, OnInit,
	Input, Output,
} from '@angular/core';

import { Observable, combineLatestWith } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { DataService } from '../../data/data.service';
import { SecurityService } from '../../security/security.service';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

import { ConfirmDeleteModalComponent, ModalLine } from '../../modals/confirm-delete-modal/confirm-delete-modal.component';

// TODO: Create system to assign/unassign project managers

@Component({
	selector: 'app-view-users',
	templateUrl: './view-users.component.html',
	styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent implements OnInit {
	projectId = 1;
	isAdmin = false;
	isElevated = false;
	
	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		
		private modalService: NgbModal,
		private notifier: NotifierService,
	) {
		this.projectId = securityService.getProjectId();
		this.isAdmin = securityService.isAdmin();
		this.isElevated = securityService.isElevated();
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
		
		const obsUsers = this.dataService.projectGetUsers(1) as Observable<Models.RespUserData[]>;
		const obsManagers = this.dataService.projectGetManagers(1) as Observable<Models.RespUserData[]>;
		
		obsUsers.pipe(combineLatestWith(obsManagers))
			.subscribe({
				next: ([users, managers]) => {
					this.listUsers = users;
					this.listManagers = managers;
					
					setTimeout(() => {
						this.dataReady = true;
					}, 100);
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
	
	callbackChangeRole(id: number, promote: boolean) {
		const modalRef = this.modalService.open(ConfirmDeleteModalComponent);
		const modalInst = modalRef.componentInstance as ConfirmDeleteModalComponent;
		{
			if (promote) {
				modalInst.title = 'Promote user to staff?';
				modalInst.content = [
					ModalLine.normal(`Staffs have the ability to manage (approve/edit/delete) questions.`),
					ModalLine.normal(`They will also gain access to all tranches.`),
				];
			}
			else {
				modalInst.title = 'Demote staff to user?';
				modalInst.content = [
					ModalLine.normal(`User will lose management access, and will return to being a normal user.`),
					ModalLine.normal(`Demoting a staff will remove all their tranches access.`),
				];
			}
			modalInst.alternateColor = true;
		}
		
		modalInst.result.subscribe((result) => {
			if (result) {
				this.changeUserRole(id, promote);
			}
		});
	}
	async changeUserRole(id: number, promote: boolean) {
		this.dataReady = false;
		
		let obsCall = promote ?
			this.dataService.adminGrantManagers(this.projectId, [id]) :
			this.dataService.adminRemoveManager(this.projectId, id);
		
		let res = await Helpers.observableAsPromise(obsCall);
		if (res.ok) {
			await this.fetchData();
			
			this.notifier.notify('success', `User role changed!`);
		}
		else {
			console.log(res.val);
			this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(res.val));
		}
	}
}
