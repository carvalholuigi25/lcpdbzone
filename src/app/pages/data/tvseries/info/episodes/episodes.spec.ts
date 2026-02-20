import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TVSeriesEpisodes } from './episodes';

describe('TVSeriesEpisodes', () => {
  let component: TVSeriesEpisodes;
  let fixture: ComponentFixture<TVSeriesEpisodes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TVSeriesEpisodes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TVSeriesEpisodes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
