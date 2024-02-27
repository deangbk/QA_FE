// angular import
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// third party
import { BreadcrumbModule, CardModule, ModalModule } from './components';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { DataFilterPipe } from './filter/data-filter.pipe';

// bootstrap import
import { NgbDropdownModule,
  NgbNavModule,
  NgbModule,
  NgbCollapseModule,
  NgbProgressbar,
  NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [DataFilterPipe, SpinnerComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgScrollbarModule, CardModule, BreadcrumbModule, NgbModule, ModalModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    CardModule,
    BreadcrumbModule,
    NgbModule,
    ModalModule,
    DataFilterPipe,
    SpinnerComponent
  ]
})
export class SharedModule {}
