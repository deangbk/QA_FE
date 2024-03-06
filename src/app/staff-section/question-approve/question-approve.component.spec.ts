import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionApproveComponent } from './question-approve.component';

describe('QuestionApproveComponent', () => {
  let component: QuestionApproveComponent;
  let fixture: ComponentFixture<QuestionApproveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionApproveComponent]
    });
    fixture = TestBed.createComponent(QuestionApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
