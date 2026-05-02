import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesDetails } from './movies-details';
import { ActivatedRoute } from '@angular/router';

describe('MoviesDetails', () => {
  let component: MoviesDetails;
  let fixture: ComponentFixture<MoviesDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesDetails],
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

    fixture = TestBed.createComponent(MoviesDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
