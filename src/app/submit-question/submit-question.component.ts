import {
	Component, OnInit, ChangeDetectorRef,
	Input, Output,
} from '@angular/core';

import { DataService } from '../data/data.service';
import { SecurityService } from '../security/security.service';

import * as Models from "../data/data-models";

import { Helpers } from '../helpers';

class AddQuestionEntry {
	isAccount: boolean;
	trancheId?: number;
	accountId?: string;
	
	category: string;
	text: string;
}

@Component({
	selector: 'app-submit-question',
	templateUrl: './submit-question.component.html',
	styleUrls: ['./submit-question.component.scss'],
})
export class SubmitQuestionComponent {
	projectId = 1;

	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
	) {
		this.projectId = securityService.getProjectId();
	}

	headerLoaded = false;
	tranchesData: Models.RespTrancheData[] = [];
	
	addingQuestionsData: AddQuestionEntry[] = [];
	
	categorySelectItems = [
		{
			label: 'General',
			id: 'general',
		},
		{
			label: 'Collateral',
			id: 'collateral',
		},
		{
			label: 'Litigation',
			id: 'litigation',
		},
		{
			label: 'Guarantor',
			id: 'guarantor',
		},
	];
	
	// -----------------------------------------------------

	ngOnInit(): void {
		this.fetchData();
		
		this.addNewQuestion();
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
	
	tranchesToSelectItems() {
		let res =
			this.tranchesData.map(x => ({
				label: x.name,
				id: x.id,
			}));
		
		return res;
	}
	getAccountSelectItems(entry: AddQuestionEntry) {
		let tranche = this.tranchesData
			.find(x => x.id == entry.trancheId);
		if (tranche != null) {
			let res =
				tranche.accounts.map(x => ({
					label: x.id,
					id: x.id,
				}));
			
			return res;
		}
		return [];
	}
	
	// -----------------------------------------------------
	
	// TODO: Add animations
	addNewQuestion() {
		this.addingQuestionsData.push({
			isAccount: false,

			category: this.categorySelectItems[0].id,
			text: '',
		});
	}
	removeQuestion(row: number) {
		this.addingQuestionsData.splice(row, 1);
	}
	
	// -----------------------------------------------------

	callbackSetQuestionType(entry: AddQuestionEntry, value: boolean): void {
		entry.isAccount = value;
	}
	
	callbackSelectTranche(entry: AddQuestionEntry) {
		entry.accountId = null;
	}
}
