import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TVSeriesReviews } from './reviews';
import { ActivatedRoute } from '@angular/router';

describe('TVSeriesReviews', () => {
  let component: TVSeriesReviews;
  let fixture: ComponentFixture<TVSeriesReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TVSeriesReviews],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            data: {
              userDetails: {
                id: 1,
                username: 'testuser',
                email: '',
                role: 'admin',
                token: 'testtoken'
              }
            }
          }
        }
      }]
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
