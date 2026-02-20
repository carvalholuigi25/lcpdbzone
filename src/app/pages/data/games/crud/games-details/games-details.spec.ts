import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesDetails } from './games-details';

describe('GamesDetails', () => {
  let component: GamesDetails;
  let fixture: ComponentFixture<GamesDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
