import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forgotpass } from './forgotpass';

describe('Forgotpass', () => {
  let component: Forgotpass;
  let fixture: ComponentFixture<Forgotpass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forgotpass]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Forgotpass);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
