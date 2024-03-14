import {
	Component, OnInit, ChangeDetectorRef,
	Input, Output,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { NotifierService } from 'angular-notifier';

import { DataService } from '../data/data.service';
import { SecurityService } from '../security/security.service';

import * as Models from "../data/data-models";

import { Helpers } from '../helpers';

class AddQuestionEntry {
	isAccount: boolean;
	trancheId?: number;
	accountId?: number;
	
	category: string;
	text: string;
	
	postAs?: string;
}

@Component({
	selector: 'app-submit-question',
	templateUrl: './submit-question.component.html',
	styleUrls: ['./submit-question.component.scss'],
})
export class SubmitQuestionComponent {
	projectId = 1;
	isStaff: boolean;

	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		
		private notifier: NotifierService,
	) {
		this.projectId = securityService.getProjectId();
		this.isStaff = securityService.isStaff();
	}
	
	buttonLoading = '';
	
	headerLoaded = false;
	tranchesData: Models.RespTrancheData[] = [];
	
	addingQuestionsData: AddQuestionEntry[] = [];
	addError = '';
	
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
			let err = res.val as HttpErrorResponse;
			
			console.log(err);
			this.notifier.notify('error', "Server Error: " + err.message);
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
					label: x.id_pretty,
					id: x.id,
				}));
			
			return res;
		}
		return [];
	}
	
	isOnlyNumbers(text?: string) {
		return text != null && text.length == 0 || !(/[^0-9]/.test(text));
	}
	
	// -----------------------------------------------------
	
	// TODO: Add animations
	addNewQuestion() {
		this.addingQuestionsData.push({
			isAccount: false,

			category: this.categorySelectItems[0].id,
			text: '',
			
			postAs: '',
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
	
	async callbackAddAllQuestions() {
		let count = this.addingQuestionsData.length;
	
		// Check input validity first
		{
			this.addError = '';
			
			let i = 1;
			try {
				for (let entry of this.addingQuestionsData) {
					if (entry.isAccount && (entry.trancheId == null || entry.accountId == null)) {
						throw new Error("Please select Tranche and Account");
					}
					else if (entry.text.length == 0) {
						throw new Error("Please add question text");
					}
					else if (!this.isOnlyNumbers(entry.postAs)) {
						throw new Error("Invalid user ID");
					}
					else if (this.categorySelectItems.findIndex(x => x.id == entry.category) == -1) {
						throw new Error("Invalid category");
					}
					
					++i;
				}
			}
			catch (e) {
				this.addError = `Question ${i}: ` + (e as Error).message;
				this.notifier.notify('error', this.addError);
				return;
			}
		}
		
		this.buttonLoading = 'add';
		
		{
			let questionsData = this.addingQuestionsData.map(x => ({
				account: x.isAccount ? x.accountId : null,
				text: x.text,
				category: x.category,
				post_as: this.isStaff ? (Helpers.parseInt(x.postAs).unwrapOr(null)) : null,
			} as Models.ReqBodyCreatePost));
			
			console.log(questionsData);
			
			let res = await Helpers.observableAsPromise(
				this.dataService.postBulkCreate(this.projectId, questionsData));
			if (res.ok) {
				console.log(res.val);
				
				this.notifier.notify("success",
					`Submitted ${count} question${count > 1 ? 's' : ''}`);
				
				this.addingQuestionsData = [];
				this.addNewQuestion();
			}
			else {
				console.log(res.val);
				this.notifier.notify('error', "Server Error: " + res.val.message);
				
				this.addError = res.val;
			}
		}
		
		this.buttonLoading = '';
	}
}
