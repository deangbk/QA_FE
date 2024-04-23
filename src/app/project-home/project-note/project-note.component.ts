import {
	Component, OnInit, ChangeDetectorRef,
} from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

import { Helpers } from 'app/helpers';

@Component({
	selector: 'app-project-note',
	templateUrl: './project-note.component.html',
	styleUrls: ['./project-note.component.scss']
})
export class ProjectNoteComponent {
	@Input() text: string = 'Note';
	@Input() description: string = null;
	@Input() postBy: string = '';
	@Input() postDate: string = '';
	
	@Input() pinned: boolean = false;
	@Input() deletable: boolean = false;
	@Output("onDelete") deleteEvent = new EventEmitter();
	
	constructor() {
		
	}

	// -----------------------------------------------------
	
	callbackClickDelete() {
		if (this.deleteEvent != null)
			this.deleteEvent.emit();
	}
}
