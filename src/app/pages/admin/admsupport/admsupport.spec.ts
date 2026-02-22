import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Admsupport } from './admsupport';

describe('Admsupport', () => {
  let component: Admsupport;
  let fixture: ComponentFixture<Admsupport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admsupport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Admsupport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
