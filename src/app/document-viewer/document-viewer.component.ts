import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Input, Output } from '@angular/core';

import { lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Md5 } from 'ts-md5';

import { DataService } from '../data/data.service';
import { SecurityService } from '../security/security.service';

import * as Models from "../data/data-models";

import { Helpers } from '../helpers';

@Component({
	selector: 'document-viewer',
	templateUrl: './document-viewer.component.html',
	styleUrls: ['./document-viewer.component.scss']
})
export class DocumentViewerComponent implements OnInit {
	//@Input() documentId: number = undefined;
	documentId: number = 2002;
	
	// https://stackblitz.com/edit/angular-10-pdf-viewer-example
	// https://www.npmjs.com/package/ng2-pdf-viewer#render-text-mode
	
	constructor(
		private dataService: DataService,
		private securityService: SecurityService,
		private changeDetector: ChangeDetectorRef) { }
	
	documentReady = false;
	documentInfo: Models.RespDocumentData;
	
	pdfReady = false;
	pdfSource: string = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
	
	ngOnInit(): void {
		this.fetchPdf();
	}
	
	async fetchPdf() {
		if (this.documentId != undefined) {
			const info = await Helpers.observableAsPromise(
				this.dataService.documentGetInfo(this.documentId, 3));
			
			if (info.ok) {
				this.documentInfo = info.val;
				this.documentReady = true;
				
				console.log(this.documentInfo);
				
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
}
