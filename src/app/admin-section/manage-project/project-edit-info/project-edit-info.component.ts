import {
	Component, OnInit, OnDestroy,
	Input, Output, EventEmitter,
	ViewChild, ElementRef,
} from '@angular/core';

import { Editor, Toolbar } from 'ngx-editor';
import * as sanitizeHtml from 'sanitize-html';

import { DataService } from '../../../data/data.service';
import { SecurityService } from '../../../security/security.service';

import * as Models from 'app/data/data-models';
import { Helpers } from 'app/helpers';

@Component({
	selector: 'project-edit-info',
	templateUrl: './project-edit-info.component.html',
	styleUrls: ['./project-edit-info.component.scss']
})
export class ProjectEditInfoComponent implements OnInit, OnDestroy {
	@Input() project!: Models.RespProjectData;
	
	@ViewChild('elemTitleTextInput') elemTitleTextInput: ElementRef;
	
	// -----------------------------------------------------
	
	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
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

	showTitleEditIcon = false;
	editingTitle = false;

	descHtml = '';
	editingDescription = false;
	
	// -----------------------------------------------------
	
	ngOnInit(): void {
		this.descHtml = this.project.description ?? '';
		this.editor = new Editor();
	}
	ngOnDestroy(): void {
		this.editor?.destroy();
	}
	
	// -----------------------------------------------------
	
	callbackClickEditTitle(state: boolean) {
		this.editingTitle = state;

		if (state) {
			setTimeout(() => {
				this.elemTitleTextInput.nativeElement.focus();
			}, 0);
		}
		else {
			let name = this.project.display_name;
			if (name.length > 256) {
				name = name.substring(0, 256);
			}

			//console.log(name);
			this.project.display_name = name;
		}
	}

	callbackClickEditDesc(state: boolean) {
		this.editingDescription = state;

		//console.log(this.descHtml);
	}

	callbackEditorChange(html: object) {
		//console.log(html);
		this.project.description = sanitizeHtml(this.descHtml);
	}
}
