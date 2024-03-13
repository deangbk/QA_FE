
// Angular import
import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DataService } from 'src/app/data/data.service';

// third party
import { FileUploadValidators, FileUploadModule } from '@iplab/ngx-file-upload';


@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss']
})
export class UploadDocumentsComponent {
  private filesControl = new UntypedFormControl(null, FileUploadValidators.filesLimit(2));
  constructor(private dataService: DataService) {
  }
  demoForm = new UntypedFormGroup({
    files: this.filesControl
   
  });

    // private method
    toggleStatus() {
      this.filesControl.disabled ? this.filesControl.enable() : this.filesControl.disable();
    }

    uploadFiles() {
      const files: File[] = this.demoForm.get('files').value;
      const formData = new FormData();
    
      files.forEach((file, index) => {
        formData.append(`file${index}`, file, file.name);
      });
      formData.append('upType', 'question');
      formData.append('qID', '40');
      this.dataService.documentUploadToQuestion(40, formData).subscribe(
        response => {
       //   this.showNotification("success", notifMess); // handle the response here
          // console.log(response);
        //  this.displayAApproveBy(approvals);
  
        },
        error => {
     //     this.showNotification("error", "Error Approving Answer");
          // handle the error herethis.showNotification("Answer Approved", "sucess")
          console.log(error);
        }
      );
     // this.http.post('your-api-url', formData).subscribe(
     //   response => {
          // handle the response here
      //  },
     //   error => {
          // handle the error here
     //   }
     // );
    
      }
}
