
// Angular import
import { Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { initializeFileUploadDTO,initializeRespAccountData,initializeRespTrancheData } from 'src/app/data/model-initializers';
import { NotifierService } from 'angular-notifier';

import { DataService } from '../../data/data.service';
import { SecurityService } from '../../security/security.service';

import * as Models from "../../data/data-models";

import { Helpers } from '../../helpers';

// third party
import { FileUploadValidators, FileUploadModule } from '@iplab/ngx-file-upload';


@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss']
})
export class UploadDocumentsComponent {
	projectId = 1;
	
	upDetails: Models.FileUploadDTO = initializeFileUploadDTO();
  questionId: number;
  isAccount:boolean = false;
    upReady:boolean=false; 
    uploading:boolean=false;
    tranchesData: Models.RespTrancheData[] = []; ///disables the upload button if false
  tranches = ['Tranche 1', 'Tranche 2', 'Tranche 3']; // replace with your actual tranches
accounts:Models.RespAccountData[]; // replace with your actual accounts
selectedTranche:Models.RespTrancheData;
selectedAccount:Models.RespAccountData;
private notifier: NotifierService;


  private filesControl = new UntypedFormControl(null, FileUploadValidators.filesLimit(2));


	constructor(
		private dataService: DataService, private securityService: SecurityService,
		private route: ActivatedRoute, notifier: NotifierService,) {
    this.questionId = +this.route.snapshot.paramMap.get('qId');
    console.log(this.questionId);
    this.notifier = notifier;
  }
  

	demoForm = new UntypedFormGroup({
		files: this.filesControl
	
	
	});
	ngOnInit(): void {
		this.projectId = this.securityService.getProjectId();
		
		this.selectedAccount =initializeRespAccountData(); 
		this.selectedTranche = initializeRespTrancheData();
		
		if (this.questionId) {
			this.upDetails.questionID = this.questionId;
			this.upDetails.upType = 'question';
			this.upReady = true;
		}
		else {
			this.upDetails.questionID = 0;
			this.upDetails.upType = '';
			this.upDetails.accountId = 0;
			this.upDetails.account = null;
		}
		
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
		
		
	}
  // get selectedAccount(): Models.RespAccountData {
  //   return this._selectedAccount;
  // }
  
  // set selectedAccount(value: Models.RespAccountData) {
  //   this._selectedAccount = value;
  //   //this.setAccount();
  // }
 // selectedTranche = this.tranches[0];
//selectedAccount = this.accounts[0];
  // private method
  toggleStatus() {
    this.filesControl.disabled ? this.filesControl.enable() : this.filesControl.disable();
  }
  showNotification(type: string, message: string): void {
    this.notifier.notify(type, message);
  }
	async uploadFiles() {
		this.uploading = true;
		//// this part is the old code
		 const files: File[] = this.demoForm.get('files').value;
		const formData = new FormData();

		files.forEach((file, index) => {
			formData.append(`file${index}`, file, file.name);
		});
		//   this.upDetails.accountId=+this.selectedAccount.id;
		//  formData.append('upType', 'question');
		formData.append("QuestionID", this.upDetails.questionID.toString());
		formData.append("upType", this.upDetails.upType || '');
		formData.append("Account", this.upDetails.account || '');
		formData.append("AccountId", this.upDetails.accountId.toString());
		this.dataService.documentUploadToQuestion(40, formData).subscribe(
			response => {
				//   this.showNotification("success", notifMess); // handle the response here
				// console.log(response);
				//  this.displayAApproveBy(approvals);
				this.uploading = false;
				this.demoForm.get('files').reset([]);
				this.showNotification('success', 'Document uploaded successfully');


			},
			error => {
				//     this.showNotification("error", "Error Approving Answer");
				// handle the error herethis.showNotification("Answer Approved", "sucess")
				console.log(error);
				this.uploading = false;
				this.showNotification('error', 'Error when uplaoding document, try again');
			}
		); 
		
		
		const fnMapCorrectType = (x: string) => {
			switch (x) {
				case 'Bid':
					return 'Bid';
				case 'Account':
					return 'Account';
				case 'Transaction':
					return 'Transaction';
					case 'Question':
						return 'Question';
			}
			return x;
		};
		const docType = fnMapCorrectType(this.upDetails.upType);
		
	//	const files: File[] = this.demoForm.get('files').value;
		
		let model: Models.ReqBodyUploadDocumentWithFile = {
			type: docType,
			with_post: this.upDetails.questionID,
			with_account: this.upDetails.accountId,
		};
		
		console.log(this.upDetails);
		console.log(model);
	
		{
			

			let res = await Helpers.observableAsPromise(
				this.dataService.documentUploadFromFiles(files, model));
			if (res.ok) {
				this.showNotification('success', 'Document uploaded successfully');
				
				this.demoForm.get('files').reset([]);
			}
			else {
				this.showNotification('error', 'Document upload error: '
					+ Helpers.formatHttpError(res.val));
			}

			// let res = await Helpers.observableAsPromise(
			// 	this.dataService.documentUploadFromFiles(models, files));
			// if (res.ok) {
			// 	this.showNotification('success', 'Document uploaded successfully');
				
			// 	this.demoForm.get('files').reset([]);
			// }
			// else {
			// 	this.showNotification('error', 'Document upload error: '
			// 		+ Helpers.formatHttpError(res.val));
			// }
			
			this.uploading = false;
		}
	}

chooseDocType(){
switch(this.upDetails.upType){

  case 'Bid':this.isAccount=false;this.upReady=true;
  break;
  case 'Account':this.isAccount=true;this.upReady=false;
  break;
  case 'Transaction':this.isAccount=false;this.upReady=true;
  break;
  default:this.isAccount=false;this.upReady=false;
   break;

}
}
getAccounts(accounts:Models.RespAccountData[]){
  //this.selectedAccount = accounts[0];
  
  this.upReady=false;
 
  this.accounts= accounts;
  console.log("selected account");
  console.log(this.selectedAccount);
  this.selectedAccount = this.accounts[0];
 //this.setAccount()
 // this.selectedAccount= accounts;
  // let res =
  // this.tranchesData.map(x => ({
  //   label: x.name,
  //   id: x.id,
  // }));

//return res;

}
setAccount(){
this.upReady=true;
this.upDetails.accountId = +this.selectedAccount;
console.log(this.upDetails); // if tranche s changed and a default acount is set then this is not triggered
}
}
