import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsDisplayComponent } from './questions-display.component';

describe('QuestionsDisplayComponent', () => {
  let component: QuestionsDisplayComponent;
  let fixture: ComponentFixture<QuestionsDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionsDisplayComponent]
    });
    fixture = TestBed.createComponent(QuestionsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
