import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSigninV2Component } from './auth-signin-v2.component';

describe('AuthSigninV2Component', () => {
  let component: AuthSigninV2Component;
  let fixture: ComponentFixture<AuthSigninV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthSigninV2Component]
    });
    fixture = TestBed.createComponent(AuthSigninV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
