
import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef, Input } from '@angular/core';

import { DataService } from '../../data/data.service';
import { SecurityService } from '../../security/security.service';
import * as Models from "../../data/data-models"; // Import your models
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent {
  question:any;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.question);
  }

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as {data: any};

  if (state?.data) {
    this.question = state.data;
  }
     // This will log the passed question object
  }
}
