import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Unauth } from './unauth';

describe('Unauth', () => {
  let component: Unauth;
  let fixture: ComponentFixture<Unauth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Unauth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Unauth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
