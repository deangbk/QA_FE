// angular import
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// third party
import { BreadcrumbModule, CardModule } from './components';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { DataFilterPipe } from './filter/data-filter.pipe';

// bootstrap import
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [DataFilterPipe, SpinnerComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgScrollbarModule, CardModule, BreadcrumbModule, NgbModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    CardModule,
    BreadcrumbModule,
    NgbModule,
    DataFilterPipe,
    SpinnerComponent
  ]
})
export class SharedModule {}
