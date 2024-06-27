import {
	Component, OnInit, ChangeDetectorRef,
	Input, Output, EventEmitter,
	ViewChild, ElementRef,
} from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as Models from 'app/service/data-models';
import { Helpers } from 'app/helpers';

import { CreateTrancheModalComponent } from './create-tranche-modal/create-tranche-modal.component';

@Component({
	selector: 'app-create-tranches',
	templateUrl: './create-tranches.component.html',
	styleUrls: ['./create-tranches.component.scss']
})
export class CreateTranchesComponent {
	@Input() public tranches: string[] = [];
	@Output() public tranchesChange = new EventEmitter<string[]>();
	
	constructor(private modalService: NgbModal) {
		
	}
	
	// -----------------------------------------------------
	
	callbackCreate() {
		const modalRef = this.modalService.open(CreateTrancheModalComponent);
		const inst = modalRef.componentInstance as CreateTrancheModalComponent;
		{
			inst.nameChecker = (name: string) => {
				if (!name)
					return false;
				return this.tranches.findIndex(x => x == name) == -1;
			}
		}
		
		inst.result.subscribe((result) => {
			if (result !== null) {
				this.tranches.push(result);
				this.tranchesChange.emit(this.tranches);
			}
		});
	}
	
	callbackDelete(name: string) {
		this.tranches = this.tranches.filter(x => x !== name);
		this.tranchesChange.emit(this.tranches);
	}
}
