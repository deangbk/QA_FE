import {
	Component, OnInit,
	Input, Output,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import * as Rx from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { DataService, AuthService } from 'app/service';
import * as Models from 'app/service/data-models';

import { Helpers } from 'app/helpers';

import { CreateAdminModalComponent } from '../modals/create-admin/create-admin.component';
import { EditUserModalComponent } from '../modals/edit-user/edit-user.component';

@Component({
	selector: 'app-admins-list',
	templateUrl: './admins-list.component.html',
	styleUrls: ['./admins-list.component.scss']
})
export class AdminsListComponent implements OnInit {
	constructor(
		private dataService: DataService,
		private authService: AuthService,
		
		private modalService: NgbModal,
		private notifier: NotifierService,
	) {
		
	}
	
	dataReady = false;
	listAdmin: Models.RespUserData[] = [];
	
	// -----------------------------------------------------

	ngOnInit(): void {
		this.refresh();
	}
	
	setError(e: HttpErrorResponse) {
		console.log(e);
		this.notifier.notify('error', Helpers.formatHttpError(e));
	}

	async refresh() {
		let res = await Helpers.observableAsPromise(
			this.dataService.adminGetAll());
		if (res.ok) {
			this.listAdmin = res.val;
			this.dataReady = true;
		}
		else {
			this.setError(res.val);
		}
	}
	
	// -----------------------------------------------------
	
	isSelf(user: Models.RespUserData) {
		return user.id == this.authService.getUserID();
	}
	
	// -----------------------------------------------------
	
	callbackEditSelf(user: Models.RespUserData) {
		const modalRef = this.modalService.open(EditUserModalComponent);
		const inst = modalRef.componentInstance as EditUserModalComponent;
		{
			inst.user = user;
		}
		
		inst.ok.subscribe(() => {
			this.notifier.notify('success', 'Info edited!');
			this.refresh();
		})
	}
	
	callbackAddAdmin() {
		const modalRef = this.modalService.open(CreateAdminModalComponent);
		const inst = modalRef.componentInstance as CreateAdminModalComponent;

		inst.result.subscribe(res => {
			if (res.some) {
				this.dataReady = false;
				
				const create: Models.ReqBodyCreateAdmin = {
					email: res.val.email,
				};
				this.dataService.adminCreate(create)
					.subscribe({
						next: () => {
							this.notifier.notify('success', 'New admin added!');
							this.refresh();
						},
						error: e => {
							this.setError(e);
						},
					});
			}
		});
	}
}
