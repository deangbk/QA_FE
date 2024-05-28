import {
	Injectable,
	Component, OnInit, OnChanges,
	Input, Output, EventEmitter,
	SimpleChanges,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { DataService } from 'app/data/data.service';
import { ProjectService } from 'app/data/project.service';
import { SecurityService } from 'app/security/security.service';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

import { SelectImageModalComponent } from 'app/projects/modals/select-image-modal/select-image-modal.component'

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
		private projectService: ProjectService,
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
		
		await this.projectService.waitForImagesLoad();
		{
			this.urlResource = this.logo ?
				this.projectService.urlProjectLogo :
				this.projectService.urlProjectBanner;
			this.loading = false;
		}
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
				
				//console.log(data);
				{
					const obsUpload = this.logo ?
						this.dataService.projectEditLogo(file) :
						this.dataService.projectEditBanner(file);
					
					const res = await Helpers.observableAsPromise(obsUpload);
					if (res.ok) {
						this.notifier.notify('success', `Image updated successfully!`);
						this.projectService.reloadImages();
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
