import {
	Component, OnInit, ChangeDetectorRef,
	Input, Output,
	ViewChild, ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as XLSX from 'xlsx';

import { DataService } from '../../data/data.service';
import { SecurityService } from '../../security/security.service';

import * as Models from "../../data/data-models";
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { Helpers } from '../../helpers';

interface ExcelDataRow {
	email: string;
	name: string;
	company: string;
	tranches: string;
}

@Component({
	selector: 'app-add-users',
	templateUrl: './add-users.component.html',
	styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {
	// TODO: Replace with the actual projectId
	projectId = 1;
	
	@ViewChild("file") file: ElementRef;
	
	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		private router: Router,
	) {
		this.projectId = securityService.getProjectId();
	}
	
	

	// -----------------------------------------------------

	ngOnInit(): void {
		
	}
	
	// -----------------------------------------------------
	
	callbackClickUpload(): void {
		this.file.nativeElement.click(); 
	}
	callbackGetUploadFile(event: any): void {
		const file: File = event.target.files[0];
		
		var reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
			var workbook = XLSX.read(e.target.result, { type: 'binary' });
			
			var sheet = workbook.Sheets[workbook.SheetNames[0]];
			var sheetData = XLSX.utils.sheet_to_json<ExcelDataRow>(sheet);
			
			var listReqDto = sheetData
				.map(x => ({
					email: x.email,
					name: x.name,
					company: x.company ?? null,
					tranches: x.tranches == null ? ""
						: x.tranches.split(','),
				} as Models.ReqBodyCreateUser));
			console.log(listReqDto);
		};
		reader.readAsBinaryString(file);
	}
}
