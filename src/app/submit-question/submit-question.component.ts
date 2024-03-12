import {
	Component, OnInit, ChangeDetectorRef,
	Input, Output,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { DataService } from '../data/data.service';
import { SecurityService } from '../security/security.service';

import * as Models from "../data/data-models";

import { Helpers } from '../helpers';

@Component({
	selector: 'app-submit-question',
	templateUrl: './submit-question.component.html',
	styleUrls: ['./submit-question.component.scss']
})
export class SubmitQuestionComponent {
	projectId = 1;

	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		private router: Router,
	) {
		this.projectId = securityService.getProjectId();
	}

	headerLoaded = false;
	
	tranchesData: Models.RespTrancheData[];

	// -----------------------------------------------------

	ngOnInit(): void {
		this.fetchData();
	}
	
	async fetchData() {
		let res = await Helpers.observableAsPromise(
			this.dataService.projectGetTranches());
		if (res.ok) {
			this.tranchesData = res.val;
			
			console.log(this.tranchesData);
		}
		else {
			console.log(res.val);
		}
		
		this.headerLoaded = true;
	}

	// -----------------------------------------------------

	callbackRadioChange(value: number): void {
		console.log(value);
	}
}
