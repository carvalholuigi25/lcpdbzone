import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvseriesDetails } from './tvseries-details';
import { ActivatedRoute } from '@angular/router';

describe('TvseriesDetails', () => {
  let component: TvseriesDetails;
  let fixture: ComponentFixture<TvseriesDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvseriesDetails],
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

    fixture = TestBed.createComponent(TvseriesDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
