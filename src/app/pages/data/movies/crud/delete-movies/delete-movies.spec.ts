import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMovies } from './delete-movies';

describe('DeleteMovies', () => {
  let component: DeleteMovies;
  let fixture: ComponentFixture<DeleteMovies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMovies]
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
