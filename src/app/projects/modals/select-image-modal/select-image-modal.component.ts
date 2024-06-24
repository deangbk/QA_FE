import {
	Component, OnInit, OnChanges,
	SimpleChanges,
	ViewChild, ElementRef,
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Option, Some, None } from 'ts-results';

import * as Models from 'app/service/data-models';
import { Helpers } from 'app/helpers';

@Component({
	selector: 'app-select-image-modal',
	templateUrl: './select-image-modal.component.html',
	styleUrls: ['./select-image-modal.component.scss'],
	
	standalone: true,
	imports: [
		CommonModule,
	],
})
export class SelectImageModalComponent implements OnInit {
	@Input() title: string = 'Select image';
	@Output() public result: EventEmitter<Option<File>>
		= new EventEmitter();
	
	@ViewChild("fileModal") fileModal: ElementRef;
	
	constructor(public activeModal: NgbActiveModal) { }
	
	file: File = null;
	fileUrl = '';
	
	// -----------------------------------------------------
	
	ngOnInit() {
	}
	
	// -----------------------------------------------------
	
	callbackClickUpload() {
		this.fileModal.nativeElement.click(); 
	}
	callbackGetUploadFile(event: any): void {
		const file: File = event.target.files[0];

		{
			let reader = new FileReader();
			
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				this.file = file;
				this.fileUrl = reader.result as string;
			};
		}
	}
	
	callbackAction(confirm: boolean) {
		if (confirm) {
			this.result.emit(Some(this.file));
		}
		else {
			this.result.emit(None);
		}

		this.activeModal.close();
	}
}
