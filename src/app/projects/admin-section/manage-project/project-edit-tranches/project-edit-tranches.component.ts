import {
	Component, OnInit,
	Input, Output, EventEmitter,
	ViewChild, ElementRef,
} from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { DataService } from 'app/data/data.service';
import { SecurityService } from 'app/security/security.service';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

import { ModalLine, ConfirmDeleteModalComponent } from 'app/projects/modals/confirm-delete-modal/confirm-delete-modal.component';
import { TrancheEditModalComponent, FnCheckDuplicate } from 'app/projects/modals/tranche-edit-modal/tranche-edit-modal.component';
import { Observable } from 'rxjs';

@Component({
	selector: 'project-edit-tranches',
	templateUrl: './project-edit-tranches.component.html',
	styleUrls: ['./project-edit-tranches.component.scss']
})
export class ProjectEditTranchesComponent implements OnInit {
	@Input() tranches: Models.RespTrancheDataEx[] = [];
	@Output() onrefresh = new EventEmitter<void>();
	
	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		
		private modalService: NgbModal,
		private notifier: NotifierService,
	) { }
	
	// -----------------------------------------------------
	
	ngOnInit(): void {
		console.log(this.tranches);
	}
	
	// -----------------------------------------------------
	
	checkDuplicatedTranche: FnCheckDuplicate = (name: string) => {
		return this.tranches.findIndex(x => x.name == name) != -1;
	};
	
	// -----------------------------------------------------
	
	sendObservableAndResult<T>(obs: Observable<T>, successMsg: string) {
		obs.subscribe({
			next: x => {
				this.notifier.notify('success', successMsg);
				this.onrefresh.emit();
			},
			error: x => {
				this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(x));
			},
		});
	}
	
	callbackEdit(tranche: Models.RespTrancheDataEx) {
		console.log(tranche.id);
		
		const modalRef = this.modalService.open(TrancheEditModalComponent);
		const inst = modalRef.componentInstance as TrancheEditModalComponent;
		{
			inst.tranche = tranche;
			inst.fnCheckDuplicate = this.checkDuplicatedTranche;
		}
		
		inst.result.subscribe((result) => {
			if (result.some) {
				let edit = result.val as Models.ReqBodyEditTranche;
				if (edit.name != tranche.name) {
					let obs = this.dataService.trancheEdit(tranche.id, edit);
					this.sendObservableAndResult(obs, "Tranche edited");
				}
			}
		});
	}
	
	callbackCreate() {
		const modalRef = this.modalService.open(TrancheEditModalComponent);
		const inst = modalRef.componentInstance as TrancheEditModalComponent;
		{
			inst.creating = true;
			inst.fnCheckDuplicate = this.checkDuplicatedTranche;
		}

		inst.result.subscribe((result) => {
			if (result.some) {
				let create = result.val as Models.ReqBodyCreateTranche;
				
				let obs = this.dataService.trancheCreate(create);
				this.sendObservableAndResult(obs, "Tranche created!");
			}
		});
	}
	
	callbackDelete(tranche: Models.RespTrancheDataEx) {
		console.log(tranche.id);
		
		const modalRef = this.modalService.open(ConfirmDeleteModalComponent, {
			backdrop: 'static',
		});
		const inst = modalRef.componentInstance as ConfirmDeleteModalComponent;
		{
			inst.title = `Delete tranche \"${tranche.name}\"?`;
			inst.content = [
				ModalLine.danger(`ALL associated accounts, questions, and documents will be deleted.`),
				ModalLine.danger(`This action cannot be undone!`),
			];
		}
		
		inst.result.subscribe((result: boolean) => {
			if (result) {
				let obs = this.dataService.trancheDelete(tranche.id);
				this.sendObservableAndResult(obs, "Tranche deleted");
			}
		});
	}
}
