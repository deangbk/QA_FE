import {
	Component, OnInit, ChangeDetectorRef,
	ElementRef, ViewChild, AfterViewInit, AfterViewChecked,
	HostListener,
} from '@angular/core';
import { Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Md5 } from 'ts-md5';

import { DataService } from '../data/data.service';
import { SecurityService } from '../security/security.service';

import * as Models from "../data/data-models";

import { Helpers } from '../helpers';

@Component({
	selector: 'document-viewer',
	templateUrl: './document-viewer.component.html',
	styleUrls: ['./document-viewer.component.scss'],
})
export class DocumentViewerComponent implements OnInit, AfterViewInit {
	/* @Input() */ documentId: number = undefined;
	@Input() prevDocument: number = undefined;
	@Input() nextDocument: number = undefined;
	
	// https://stackblitz.com/edit/angular-10-pdf-viewer-example
	// https://www.npmjs.com/package/ng2-pdf-viewer#render-text-mode
	
	isStaff: boolean;
	
	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		private changeDetector: ChangeDetectorRef,
		private route: ActivatedRoute)
	{ 
		this.isStaff = securityService.isStaff();
	}
	
	documentReady = false;
	documentInfo: Models.RespDocumentData;
	
	descText: string = "";
	
	pdfReady = false;
	pdfSource: string = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
	
	ngOnInit(): void {
		if (this.documentId == undefined) {
			this.documentId = 2002;
		}
		//console.log(this.prevDocument, this.nextDocument);
		
		this.route.paramMap.subscribe(params => {
			var idFromRoute = params.get('id');
			this.documentId = idFromRoute != "" ? parseInt(idFromRoute) : undefined;
			
			console.log(this.documentId);
		});
		
		this.fetchPdf();
	}
	
	ngAfterViewInit(): void {
	}
	
	async fetchPdf() {
		if (this.documentId != undefined) {
			const info = await Helpers.observableAsPromise(
				this.dataService.documentGetInfo(this.documentId, 3));
			
			if (info.ok) {
				this.documentInfo = info.val;
				this.documentReady = true;
				
				console.log(this.documentInfo);
				
				{
					// TODO: Maybe add hover popups
					
					//this.descText = "Document is from post "
					//	+ `<i>#42069</i>`;
					
					if (this.documentInfo.assoc_post != null) {
						var postId = (<Models.RespPostData>this.documentInfo.assoc_post).id;
						this.descText = "Document is from question "
							+ `<i>#${postId}<i>`;
					}
					else if (this.documentInfo.assoc_account != null) {
						var accountName = (<Models.RespAccountData>this.documentInfo.assoc_account).id_pretty;
						this.descText = `Document is associated with account <i>${accountName}<i>`;
					}
					else {
						this.descText = "Document is from this project";
					}
				}
				
				this.dataService.documentGetFileData(this.documentId).subscribe({
					next: stream => {
						var decodedUint8Array: Uint8Array = Helpers.arrayBufferToByteArray(stream);
						
						var hashKeyBytes: number[];
						{
							const userID = this.securityService.getUserID();
							const md5 = Md5.hashStr(userID.toString());
							hashKeyBytes = Array.from(
								Helpers.chunkString(md5, 2), c => parseInt(c, 16));
						}
						
						for (let i = 0; i < decodedUint8Array.byteLength; ++i) {
							decodedUint8Array[i] ^= hashKeyBytes[i % hashKeyBytes.length];
						}
						
						var blobFile = new Blob([decodedUint8Array], { type: 'application/pdf' });
						var blobUrl = URL.createObjectURL(blobFile);
						
						this.pdfSource = blobUrl;
						this.pdfReady = true;
					},
					error: x => console.log(x),
				});
			}
			else {
				console.log(`Failed to get document information: ${info.val}`);
			}
		}
	}
	
	// -----------------------------------------------------
	
	callbackClickUsername(event: any) {
		event.preventDefault();
	}
	
	callbackArrow(dir: boolean) {
		if (this.documentInfo != null) {
			console.log("Arrow click: " + dir);
		}
	}
	
	callbackPrint() {
		console.log("Print click");
		if (this.documentInfo != null && this.documentInfo.allow_print) {
			// TODO: Maybe bring up the print menu without opening the pdf in another window
			window.open(this.pdfSource);
		}
	}
	
	@HostListener('window:scroll', ['$event']) 
	callbackScroll(event) {
		
	}
}
