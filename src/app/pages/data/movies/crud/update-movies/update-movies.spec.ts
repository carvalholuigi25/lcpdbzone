import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMovies } from './update-movies';
import { ActivatedRoute } from '@angular/router';

describe('UpdateMovies', () => {
  let component: UpdateMovies;
  let fixture: ComponentFixture<UpdateMovies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMovies],
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

    fixture = TestBed.createComponent(UpdateMovies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
