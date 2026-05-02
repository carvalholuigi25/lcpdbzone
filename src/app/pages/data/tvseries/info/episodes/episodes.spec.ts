import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TVSeriesEpisodes } from './episodes';
import { ActivatedRoute } from '@angular/router';

describe('TVSeriesEpisodes', () => {
  let component: TVSeriesEpisodes;
  let fixture: ComponentFixture<TVSeriesEpisodes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TVSeriesEpisodes],
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

    fixture = TestBed.createComponent(TVSeriesEpisodes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
