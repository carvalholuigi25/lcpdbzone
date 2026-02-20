import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMovies } from './update-movies';

describe('UpdateMovies', () => {
  let component: UpdateMovies;
  let fixture: ComponentFixture<UpdateMovies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMovies]
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
