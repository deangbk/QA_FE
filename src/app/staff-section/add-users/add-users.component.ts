import {
	Component, OnInit, ChangeDetectorRef,
	Input, Output,
	ViewChild, ElementRef,
} from '@angular/core';

import { NotifierService } from 'angular-notifier';

import * as XLSX from 'xlsx';

import { DataService } from '../../data/data.service';
import { SecurityService } from '../../security/security.service';

import * as Models from 'app/data/data-models';

import { Helpers } from 'app/helpers';

interface ExcelDataRow {
	email: string;
	name: string;
	company: string;
	tranches: string;
	staff: boolean;
}

@Component({
	selector: 'app-add-users',
	templateUrl: './add-users.component.html',
	styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {
	projectId = 1;
	isAdmin = false;
	
	@ViewChild("file") file: ElementRef;
	
	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		
		private notifier: NotifierService,
	) {
		this.projectId = securityService.getProjectId();
		this.isAdmin = securityService.isAdmin();
	}
	
	uploaded = false;
	listUsersDTO: Models.ReqBodyCreateUser[] = [];
	
	buttonLoading = '';
	
	listAddedUsersData: Models.RespBulkUserCreate[] = [];
	addReady = false;
	addError: string = null;
	
	// -----------------------------------------------------
	
	ngOnInit(): void {
		
	}
	
	// -----------------------------------------------------
	
	callbackClickUpload(): void {
		this.file.nativeElement.click(); 
	}
	callbackGetUploadFile(event: any): void {
		const file: File = event.target.files[0];
		
		this.uploaded = true;
		this.listUsersDTO = [];
		
		this.listAddedUsersData = [];
		this.addReady = false;
		this.addError = null;
		
		var reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
			var workbook = XLSX.read(e.target.result, { type: 'binary' });
			
			var sheet = workbook.Sheets[workbook.SheetNames[0]];
			var sheetData = XLSX.utils.sheet_to_json<ExcelDataRow>(sheet);
			
			this.listUsersDTO = sheetData
				.map(x => ({
					email: x.email,
					name: x.name,
					company: x.company ?? null,
					tranches: x.tranches == null ? []
						: x.tranches.split(','),
					staff: x.staff ?? false,
				} as Models.ReqBodyCreateUser));
			
			if (!this.isAdmin) {
				for (let u of this.listUsersDTO) {
					u.staff = false;
				}
			}
			
			//console.log(this.listUsersDTO);
		};
		setTimeout(() => reader.readAsBinaryString(file), 400);
	}
	
	async callbackAddUsers() {
		if (this.listUsersDTO.length == 0)
			return;
		
		this.buttonLoading = 'add';
		
		this.listAddedUsersData = [];
		this.addReady = false;
		this.addError = null;
		
		/* {
			await (new Promise(resolve => setTimeout(resolve, 500)));
			
			this.listAddedUsersData = this.listUsersDTO
				.map((x, i) => ({
					id: i + 1,
					user: x.email,
					pass: 'password',
				}))
			this.callbackCopyData();
			//this.addError = 'Error';
		} */
		let res = await Helpers.observableAsPromise(
			this.dataService.managerBulkAddUsers(this.listUsersDTO));
		if (res.ok) {
			this.listAddedUsersData = res.val;
			
			this.notifier.notify("success", `User(s) added successfully`);
			
			this.callbackCopyData();
		}
		else {
			console.log(res.val);
			this.notifier.notify('error', "Server Error: " + Helpers.formatHttpError(res.val));
			
			this.addError = res.val;
		}
		
		this.addReady = true;
		this.buttonLoading = '';
	}
	callbackCopyData() {
		// I hate JavaScript
		let str = this.listAddedUsersData.map(x => (
			'{\n' +
			`    id:       ${x.id},\n` +
			`    username: \"${x.user}\",\n` +
			`    password: \"${x.pass}\"\n` +
			'}'
		)).join(',\n');
		
		navigator.clipboard.writeText(str);
		
		return false;
	}
}
