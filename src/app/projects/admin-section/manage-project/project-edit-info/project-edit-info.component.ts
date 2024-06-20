import {
	Injectable,
	Component, OnInit, OnDestroy,
	Input, Output, EventEmitter,
	ViewChild, ElementRef,
} from '@angular/core';

import { NgbDate, NgbDateStruct, NgbDateAdapter, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { Editor, Toolbar } from 'ngx-editor';

import { DataService, AuthService } from 'app/service';
import * as Models from 'app/service/data-models';

import { Helpers } from 'app/helpers';

@Injectable()
export class CustomDateAdapter extends NgbDateAdapter<string> {
	fromModel(value: string | null): NgbDateStruct | null {
		if (value) {
			const date = new Date(value);
			return DateHelper.fromDate(date);
		}
		return null;
	}
	
	toModel(ngDate: NgbDateStruct | null): string | null {
		if (ngDate) {
			const date = DateHelper.toDate(ngDate);
			return date.toISOString();
		}
		return null;
	}
}

export class DateHelper {
	static makeNeutral(date: Date): Date {
		return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
	}
	
	static fromDate(date: Date): NgbDateStruct {
		return {
			day: date.getUTCDate(),
			month: date.getUTCMonth() + 1,
			year: date.getUTCFullYear(),
		};
	}
	static toDate(ngDate: NgbDateStruct): Date {
		let date = new Date(ngDate.year, ngDate.month - 1, ngDate.day);
		return date;
	}
	
	static fromISO(date: string): NgbDateStruct {
		return DateHelper.fromDate(new Date(date));
	}
	static toISO(ngDate: NgbDateStruct): string {
		return DateHelper.toDate(ngDate).toISOString();
	}
}

@Component({
	selector: 'project-edit-info',
	templateUrl: './project-edit-info.component.html',
	styleUrls: ['./project-edit-info.component.scss'],
	
	providers: [
		{ provide: NgbDateAdapter, useClass: CustomDateAdapter },
	],
})
export class ProjectEditInfoComponent implements OnInit, OnDestroy {
	@Input() project!: Models.RespProjectData;
	@Output() onrefresh = new EventEmitter<void>();
	
	// -----------------------------------------------------
	
	constructor(
		private dataService: DataService,
		private authService: AuthService,
		
		private notifier: NotifierService,
		
		private dateAdapter: NgbDateAdapter<string>,
	) {}
	
	modelEdit: Models.ReqBodyEditProject = {};
	
	editorToolbar: Toolbar = [
		['bold', 'italic'],
		['underline', 'strike'],
		['code', 'blockquote'],
		['ordered_list', 'bullet_list'],
		[{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
		['text_color', 'background_color'],
		['align_left', 'align_center', 'align_right', 'align_justify']
	];
	editor: Editor = null;
	
	dateHover: NgbDate = null;
	dateFrom: NgbDate;
	dateTo: NgbDate;
	
	// -----------------------------------------------------
	
	ngOnInit(): void {
		this.modelEdit = {
			name: this.project.name,
			display_name: this.project.display_name,
			description: this.project.description ?? '',
			company: this.project.company ?? '',
			
			date_start: this.project.date_start,
			date_end: this.project.date_end,
		};
		
		this.editor = new Editor();
	}
	ngOnDestroy(): void {
		this.editor?.destroy();
	}
	
	// -----------------------------------------------------
	
	rangeStartDate(): NgbDateStruct[] {
		let date = new Date(this.project.date_end);
		date.setDate(date.getDate() - 1);
		
		let ngDate = {
			day: date.getUTCDate(),
			month: date.getUTCMonth(),
			year: date.getUTCFullYear(),
		};
		return [null, ngDate];
	}
	rangeEndDate(): NgbDateStruct[] {
		let date = new Date(this.project.date_start);
		date.setDate(date.getDate() + 1);
		
		let ngDate = {
			day: date.getUTCDate(),
			month: date.getUTCMonth(),
			year: date.getUTCFullYear(),
		};
		return [ngDate, null];
	}
	
	// -----------------------------------------------------
	
	callbackEditTitle() {
		let name = this.modelEdit.display_name;
		if (name.length > 256) {
			name = name.substring(0, 256);
		}
		this.modelEdit.display_name = name;
	}

	callbackEditorChange(html: object) {
		//this.modelEdit.description = sanitizeHtml(this.modelEdit.description);
	}
	
	async callbackUpdateInfo() {
		this.callbackEditTitle();
		this.callbackEditorChange(null);
		
		{
			console.log(this.modelEdit);
			
			let res = await Helpers.observableAsPromise(
				this.dataService.projectEdit(this.modelEdit));
			if (res.ok) {
				this.notifier.notify('success', "Project edited!");
				this.onrefresh.emit();
			}
			else {
				let e = res.val;
				this.notifier.notify('error', 'Server Error: ' + Helpers.formatHttpError(e));
			}
		}
	}
}
