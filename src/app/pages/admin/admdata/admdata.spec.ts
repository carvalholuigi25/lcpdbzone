import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Admdata } from './admdata';

describe('Admdata', () => {
  let component: Admdata;
  let fixture: ComponentFixture<Admdata>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admdata]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Admdata);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
