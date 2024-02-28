import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../data/data.service';
import { SecurityService } from '../security/security.service';

import * as Models from "../data/data-models";

import { Helpers } from '../helpers';

@Component({
	selector: 'recent-documents',
	templateUrl: './recent-documents.component.html',
	styleUrls: ['./recent-documents.component.scss']
})
export class RecentDocumentsComponent {
	// TODO: Replace with your actual projectId
	projectId = 1;
	
	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		private changeDetector: ChangeDetectorRef,
		private router: Router,
	) { }
	
	listDocuments: Models.RespDocumentData[] = null;
	
	ngOnInit(): void {
		this.fetchData();
	}
	
	async fetchData() {
		var page: Models.ReqBodyPaginate = {
			//per_page: 0,
			page: 0
		};
		this.dataService.documentGetRecents(this.projectId, null, page, -1).subscribe({
			next: data => {
				this.listDocuments = data;
				console.log(data);
			},
			error: x => console.log(x),
		});
	}
	
	// -----------------------------------------------------
	
	listReady(): boolean {
		return this.listDocuments !== null;
	}
	
	shortDesc(s: string): string {
		if (s.length > 28) {
			return s.substring(0, 28) + '...';
		}
		return s;
	}
	
	getFromDesc(data: Models.RespDocumentData): string {
		if (data.assoc_post !== undefined) {
			var id = <number>data.assoc_post;
			return `Question <i>#${id}</i>`;
		}
		else if (data.assoc_account !== undefined) {
			var id = <number>data.assoc_account;
			return `Account <i>#${id}</i>`;
		}
		return 'This project';
	}
	
	// -----------------------------------------------------
	
	callbackNavigateToDocView(id: number) {
		this.router.navigate([`/docs/pdf/${id}`]);
		return false;
	}
}
