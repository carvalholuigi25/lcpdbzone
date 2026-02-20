import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Admsettings } from './admsettings';

describe('Admsettings', () => {
  let component: Admsettings;
  let fixture: ComponentFixture<Admsettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admsettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Admsettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
