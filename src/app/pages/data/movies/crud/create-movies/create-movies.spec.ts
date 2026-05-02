import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMovies } from './create-movies';
import { ActivatedRoute } from '@angular/router';

describe('CreateMovies', () => {
  let component: CreateMovies;
  let fixture: ComponentFixture<CreateMovies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMovies],
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

    fixture = TestBed.createComponent(CreateMovies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
