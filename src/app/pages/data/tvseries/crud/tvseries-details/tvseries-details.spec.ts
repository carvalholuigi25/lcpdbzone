import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvseriesDetails } from './tvseries-details';

describe('TvseriesDetails', () => {
  let component: TvseriesDetails;
  let fixture: ComponentFixture<TvseriesDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvseriesDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvseriesDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
