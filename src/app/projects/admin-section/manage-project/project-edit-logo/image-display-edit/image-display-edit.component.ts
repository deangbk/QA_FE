import {
	Injectable,
	Component, OnInit, OnChanges,
	Input, Output, EventEmitter,
	SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { Observable } from 'rxjs';

import { DataService, AuthService } from 'app/service';
import * as Models from 'app/service/data-models';

import { Helpers } from 'app/helpers';

import { ProjectService } from 'app/projects/service/project.service';

import { SelectImageModalComponent } from 'app/projects/modals/select-image-modal/select-image-modal.component'

@Component({
	selector: 'image-display-edit',
	templateUrl: './image-display-edit.component.html',
	styleUrls: ['./image-display-edit.component.scss'],
	
	standalone: true,
	imports: [
		CommonModule,
	],
})
export class ImageDisplayEditComponent implements OnInit {
	@Input() title: string;
	@Input() initial: string = '';
	@Output() upload = new EventEmitter<File>();
	
	// -----------------------------------------------------

	constructor(
		public modalService: NgbModal,
		private notifier: NotifierService,
	) { }
	
	loading = true;
	urlResource: string = '';
	
	// -----------------------------------------------------

	ngOnInit(): void {
		this.fetchData();
	}
	
	async fetchData() {
		this.loading = true;
		
		this.urlResource = this.initial;
		this.loading = false;
		
		//console.log(this.urlResource);
	}
	
	// -----------------------------------------------------
	
	callbackEditImage() {
		const modalRef = this.modalService.open(SelectImageModalComponent);
		const inst = modalRef.componentInstance as SelectImageModalComponent;
		
		inst.result.subscribe(async (result) => {
			if (result.some) {
				const file = result.val;
				
				this.loading = true;
				Helpers.fileToBlobURL(file).subscribe({
					next: x => {
						this.urlResource = x;
						this.loading = false;
					},
				})
				
				this.upload.emit(file);
			}
		});
	}
}
