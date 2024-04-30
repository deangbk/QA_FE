import {
	Injectable,
	Component, OnInit, OnChanges,
	Input, Output, EventEmitter,
	SimpleChanges,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { DataService } from 'app/data/data.service';
import { SecurityService } from 'app/security/security.service';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

import { SelectImageModalComponent } from 'app/modals/select-image-modal/select-image-modal.component'

@Component({
	selector: 'image-display-edit',
	templateUrl: './image-display-edit.component.html',
	styleUrls: ['./image-display-edit.component.scss']
})
export class ImageDisplayEditComponent implements OnInit, OnChanges {
	@Input() project!: Models.RespProjectData;
	@Input() logo: boolean = true;
	
	// -----------------------------------------------------

	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		
		public modalService: NgbModal,
		private notifier: NotifierService,
	) { }
	
	name: string;
	
	loading = true;
	urlResource: string = '';
	
	// -----------------------------------------------------

	ngOnInit(): void {
		this.fetchData();
	}
	ngOnChanges(changes: SimpleChanges): void {
		this.name = this.logo ? 'Logo' : 'Banner';
	}
	
	async fetchData() {
		this.loading = true;
		
		let res = await Helpers.observableAsPromise(this.logo ? 
			this.dataService.projectGetLogo() :
			this.dataService.projectGetBanner());
		if (res.ok) {
			let blob = res.val;
			this.readFileToBlobURL(blob);
		}
		else {
			let e = res.val as HttpErrorResponse;
			if (e.status == 404) {
				this.urlResource = '';
				this.loading = false;
			}
			else {
				this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(e));
			}
		}
	}
	
	// -----------------------------------------------------
	
	readFileToBlobURL(file: File | Blob) {
		let reader = new FileReader();

		reader.readAsDataURL(file);
		reader.onloadend = () => {
			this.urlResource = reader.result as string;
			this.loading = false;
		};
	}
	
	// -----------------------------------------------------
	
	callbackEditImage() {
		const modalRef = this.modalService.open(SelectImageModalComponent);
		const inst = modalRef.componentInstance as SelectImageModalComponent;
		
		inst.result.subscribe(async (result) => {
			if (result.some) {
				const file = result.val;
				
				this.loading = true;
				this.readFileToBlobURL(file);
				
				//console.log(data);
				{
					const obsUpload = this.logo ?
						this.dataService.projectEditLogo(file) :
						this.dataService.projectEditBanner(file);
					
					const res = await Helpers.observableAsPromise(obsUpload);
					if (res.ok) {
						this.notifier.notify('success', `Image updated successfully!`);
					}
					else {
						console.log(res.val);
						this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(res.val));
					}
				}
			}
		});
	}
}
