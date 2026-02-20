import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TVSeriesReviews } from './reviews';

describe('TVSeriesReviews', () => {
  let component: TVSeriesReviews;
  let fixture: ComponentFixture<TVSeriesReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TVSeriesReviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TVSeriesReviews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
