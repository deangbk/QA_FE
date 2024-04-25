import {
	Injectable,
	Component, OnInit, OnDestroy,
	Input, Output, EventEmitter,
	ViewChild, ElementRef,
} from '@angular/core';

import { NgbDateStruct, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

import { Editor, Toolbar } from 'ngx-editor';

import { DataService } from '../../../data/data.service';
import { SecurityService } from '../../../security/security.service';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

@Injectable()
export class CustomDateAdapter extends NgbDateAdapter<string> {
	fromModel(value: string | null): NgbDateStruct | null {
		if (value) {
			const date = new Date(value);
			return {
				day: date.getDate(),
				month: date.getMonth(),
				year: date.getFullYear(),
			};
		}
		return null;
	}
	
	toModel(ngDate: NgbDateStruct | null): string | null {
		if (ngDate) {
			let date = new Date();
			date.setDate(ngDate.day);
			date.setMonth(ngDate.month);
			date.setFullYear(ngDate.year);
			return date.toUTCString();
		}
		return null;
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
		private securityService: SecurityService,
		
		private notifier: NotifierService,
		
		private dateAdapter: NgbDateAdapter<string>,
	) {}
	
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
	
	modelEdit: Models.ReqBodyEditProject = {};
	
	// -----------------------------------------------------
	
	ngOnInit(): void {
		this.modelEdit = {
			name: this.project.name,
			display_name: this.project.display_name,
			description: this.project.description ?? '',
			company: this.project.company ?? '',
			
			date_end: this.project.date_end,
			
			url_logo: this.project.url_logo,
			url_banner: this.project.url_banner,
		};
		console.log(this.modelEdit);
		
		this.editor = new Editor();
	}
	ngOnDestroy(): void {
		this.editor?.destroy();
	}
	
	// -----------------------------------------------------
	
	minEndDate() : NgbDateStruct {
		let date = new Date();
		return {
			day: date.getDate() + 1,
			month: date.getMonth(),
			year: date.getFullYear(),
		};
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
		// TODO: Send data
	}
}
