import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsAccountComponent } from './questions-account.component';

describe('QuestionsAccountComponent', () => {
  let component: QuestionsAccountComponent;
  let fixture: ComponentFixture<QuestionsAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionsAccountComponent]
    });
    fixture = TestBed.createComponent(QuestionsAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
