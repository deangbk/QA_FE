import {
	Component, OnInit, ChangeDetectorRef,
	Input, Output, EventEmitter,
	ViewChild, ElementRef,
} from '@angular/core';

import { NotifierService } from 'angular-notifier';

import * as XLSX from 'xlsx';

import { DataService, AuthService } from 'app/service';
import * as Models from 'app/service/data-models';

import { Helpers } from 'app/helpers';

import { ExcelDataRow } from 'app/projects/staff-section/add-users/add-users.component';

@Component({
	selector: 'app-add-users',
	templateUrl: './add-users.component.html',
	styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent {
	@Input() trancheCheck: (t: string) => boolean = null;
	@Output() update = new EventEmitter<Models.ReqBodyCreateUser[]>();
	
	@ViewChild("file") file: ElementRef;
	
	constructor(
		private notifier: NotifierService,
	) {
		
	}

	uploaded = false;
	loading = false;
	listUsers: Models.ReqBodyCreateUser[] = [];
	
	// -----------------------------------------------------
	
	public reset() {
		this.uploaded = false;
		this.loading = false;
		this.listUsers = [];
	}
	
	callbackClickUpload(): void {
		this.file.nativeElement.click();
	}
	callbackGetUploadFile(event: any): void {
		const file: File = event.target.files[0];

		this.uploaded = true;
		this.loading = true;
		this.listUsers = [];
		
		var reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
			var workbook = XLSX.read(e.target.result, { type: 'binary' });
			
			var sheet = workbook.Sheets[workbook.SheetNames[0]];
			var sheetData = XLSX.utils.sheet_to_json<ExcelDataRow>(sheet);
			
			this.loadUsersFromExcelData(sheetData);
			this.loading = false;
		};
		setTimeout(() => reader.readAsArrayBuffer(file), 400);
	}
	
	loadUsersFromExcelData(data: ExcelDataRow[]) {
		this.listUsers = data
			.map(x => ({
				email: x.email,
				name: x.name,
				company: x.company ?? null,
				tranches: x.tranches == null ? []
					: x.tranches.split(','),
				staff: x.staff ?? false,
			} as Models.ReqBodyCreateUser));
		
		// Verify data
		{
			let addingTranches = new Set<string>();
			this.listUsers.forEach(x => {
				x.tranches.forEach(y => addingTranches.add(y));
			});
			
			if (this.trancheCheck != null) {
				for (let t of addingTranches.values()) {
					if (!this.trancheCheck(t)) {
						this.uploaded = false;
						this.notifier.notify('error',
							`Cannot add user to tranche "${t}" because it doesn't exist`);
						
						return;
					}
				}
			}
		}
		
		this.update.emit(this.listUsers);
	}
}
