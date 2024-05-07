import {
	Component, OnInit,
	Input, Output,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, combineLatestWith } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { DataService } from '../../data/data.service';
import { SecurityService } from '../../security/security.service';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

import { ConfirmDeleteModalComponent, ModalLine } from '../../modals/confirm-delete-modal/confirm-delete-modal.component';
import { EditUserModalComponent, UserEditModel } from '../../modals/edit-user-modal/edit-user-modal.component';

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
	listTranches: Models.RespTrancheData[] = [];
	listManagers: Models.RespUserData[] = [];
	listUsers: Models.RespUserData[] = [];
	
	// -----------------------------------------------------

	ngOnInit(): void {
		this.fetchData();
	}
	
	async refreshUsers() {
		[this.listUsers, this.listManagers] = await this.fetchData_Users();
		
		setTimeout(() => {
			this.dataReady = true;
		}, 100);
	}
	
	async fetchData_Tranches() {
		let res = await Helpers.observableAsPromise(
			this.dataService.projectGetInfo());
		if (res.ok) {
			return res.val.tranches;
		}
		throw res.val as HttpErrorResponse;
	}
	async fetchData_Users() {
		const obsUsers = this.dataService.projectGetUsers(1) as Observable<Models.RespUserData[]>;
		const obsManagers = this.dataService.projectGetManagers(1) as Observable<Models.RespUserData[]>;

		let res = await Helpers.observableAsPromise(
			obsUsers.pipe(combineLatestWith(obsManagers)));
		if (res.ok) {
			return res.val;
		}
		throw res.val as HttpErrorResponse;
	}
	async fetchData() {
		this.dataReady = false;
		
		await this.catchErr(async () => {
			this.listTranches = await this.fetchData_Tranches();
			await this.refreshUsers();
		});
	}
	
	async catchErr(fn: () => Promise<void>) {
		try {
			await fn();
		}
		catch (e) {
			console.log(e);
			this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(e));
		}
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
		await this.catchErr(async () => {
			let res = await Helpers.observableAsPromise(
				this.dataService.userDelete(id));
			if (res.ok) {
				this.notifier.notify('success', `User deleted`);
				
				await this.catchErr(async () => {
					await this.refreshUsers();
				});
			}
			else throw res.val;
		});
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
		
		await this.catchErr(async () => {
			let obsCall = promote ?
				this.dataService.adminGrantManagers(this.projectId, [id]) :
				this.dataService.adminRemoveManager(this.projectId, id);

			let res = await Helpers.observableAsPromise(obsCall);
			if (res.ok) {
				this.notifier.notify('success', `User role changed!`);

				await this.catchErr(async () => {
					await this.refreshUsers();
				});
			}
			else throw res.val;
		});
	}
	
	callbackEditUser(user: Models.RespUserData) {
		const modalRef = this.modalService.open(EditUserModalComponent);
		const modalInst = modalRef.componentInstance as EditUserModalComponent;
		{
			modalInst.tranches = this.listTranches;
			modalInst.user = user;
		}
		
		modalInst.result.subscribe((result) => {
			if (result.some) {
				let resultVal = result.unwrap();
				let editModel = {
					display_name: resultVal.display_name,
					tranches: resultVal.tranches.map(x => x.name),
				} as Models.ReqBodyEditUser;
				
				this.dataReady = false;
				
				this.catchErr(async () => {
					let res = await Helpers.observableAsPromise(
						this.dataService.userEdit(user.id, editModel));
					if (res.ok) {
						this.notifier.notify('success', `User edited!`);
						
						user.display_name = resultVal.display_name;
						user.tranches = resultVal.tranches;
					
						this.dataReady = true;
					}
					else throw res.val;
				});
			}
		});
	}
}
