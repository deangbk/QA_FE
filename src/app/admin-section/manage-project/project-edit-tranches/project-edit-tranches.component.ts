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

import { ModalLine, ConfirmDeleteModalComponent } from 'app/modals/confirm-delete-modal/confirm-delete-modal.component';
import { TrancheEditModalComponent } from 'app/modals/tranche-edit-modal/tranche-edit-modal.component';

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
	
	callbackEdit(tranche: Models.RespTrancheDataEx) {
		console.log(tranche.id);
		
		const modalRef = this.modalService.open(TrancheEditModalComponent);
		const inst = modalRef.componentInstance as TrancheEditModalComponent;
		{
			inst.tranche = tranche;
		}
		
		inst.result.subscribe((result) => {
			if (result.some) {
				let edit = result.val;
				
				this.dataService.trancheEdit(tranche.id, edit).subscribe({
					next: x => {
						this.notifier.notify('success', `Tranche edited`);
						this.onrefresh.emit();
					},
					error: x => {
						this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(x));
					},
				});
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
				this.dataService.trancheDelete(tranche.id).subscribe({
					next: x => {
						this.notifier.notify('success', `Tranche deleted`);
						this.onrefresh.emit();
					},
					error: x => {
						this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(x));
					},
				});
			}
		});
	}
}
