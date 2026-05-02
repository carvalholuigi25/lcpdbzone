import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMovies } from './delete-movies';
import { ActivatedRoute } from '@angular/router';

describe('DeleteMovies', () => {
  let component: DeleteMovies;
  let fixture: ComponentFixture<DeleteMovies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMovies],
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

    fixture = TestBed.createComponent(DeleteMovies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
