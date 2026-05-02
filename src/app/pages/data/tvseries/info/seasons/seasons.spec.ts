import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TVSeriesSeasons } from './seasons';
import { ActivatedRoute } from '@angular/router';

describe('TVSeriesSeasons', () => {
  let component: TVSeriesSeasons;
  let fixture: ComponentFixture<TVSeriesSeasons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TVSeriesSeasons],
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

    fixture = TestBed.createComponent(TVSeriesSeasons);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
