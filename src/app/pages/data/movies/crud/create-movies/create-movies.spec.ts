import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMovies } from './create-movies';

describe('CreateMovies', () => {
  let component: CreateMovies;
  let fixture: ComponentFixture<CreateMovies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMovies]
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
