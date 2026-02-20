import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TVSeriesSeasons } from './seasons';

describe('TVSeriesSeasons', () => {
  let component: TVSeriesSeasons;
  let fixture: ComponentFixture<TVSeriesSeasons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TVSeriesSeasons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TVSeriesSeasons);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
