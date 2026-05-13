import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeleteMovies } from './delete-movies';
import { ActivatedRoute } from '@angular/router';
import { MoviesDataService } from '@/app/services';
import { myFunctionsService } from '@/app/services';
import { MoviesModel } from '@/app/models';

const mockUserDetails = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'admin',
  token: 'testtoken'
};

const mockMovieData = {
  movieId: 1,
  title: 'Test Movie',
  description: 'Test Description',
  studio: 'Test Studio',
  image: 'test.jpg',
  artwork: 'artwork.jpg',
  isFeatured: true,
  releaseDate: '2024-01-01',
  genre: ['Action'],
  format: ['TV'],
  scoreRating: 8
} as MoviesModel;

describe('DeleteMovies', () => {
  let component: DeleteMovies;
  let fixture: ComponentFixture<DeleteMovies>;
  let mockMoviesDataService: any;
  let mockMyFunctionsService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockMoviesDataService = {
      getMovies: vi.fn().mockReturnValue(of(mockMovieData)),
      delMovies: vi.fn().mockReturnValue(of({ success: true })),
      destroy: vi.fn()
    };

    mockMyFunctionsService = {
      getAlertWarning: vi.fn().mockReturnValue({
        type: 'warning',
        message: 'NO Movies data has been found!'
      })
    };

    mockActivatedRoute = {
      snapshot: { data: { userDetails: mockUserDetails } },
      paramMap: of(new Map([['id', '1']]))
    };

    await TestBed.configureTestingModule({
      imports: [DeleteMovies],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MoviesDataService, useValue: mockMoviesDataService },
        { provide: myFunctionsService, useValue: mockMyFunctionsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteMovies);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default id', () => {
    expect(component.id).toBe(1);
  });

  it('should set up data alert on init', () => {
    fixture.detectChanges();
    expect(mockMyFunctionsService.getAlertWarning).toHaveBeenCalledWith('NO Movies data has been found!');
  });

  it('should initialize form with movieId control', () => {
    const form = component.formDeleteMovies;
    expect(form.get('movieId')).toBeTruthy();
    expect(form.get('movieId')?.hasError('required')).toBeTruthy();
  });

  it('should load data on component init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockMoviesDataService.getMovies).toHaveBeenCalledWith(1);
  });

  it('should set isLoading to false after data loads', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.isLoading).toBe(false);
  });

  it('should reset form to default id', () => {
    component.id = 5;
    component.onReset();
    expect(component.formDeleteMovies.get('movieId')?.value).toBe(5);
  });

  it('should call destroy on service during ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(mockMoviesDataService.destroy).toHaveBeenCalled();
  });

  it('should reset moviesdata$ observable on destroy', () => {
    fixture.detectChanges();
    component.ngOnDestroy();
    expect(component.isLoading).toBe(true);
  });
});
