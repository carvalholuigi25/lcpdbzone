import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateMovies } from './update-movies';
import { ActivatedRoute } from '@angular/router';
import { MoviesDataService } from '@/app/services';
import { AuthService } from '@/app/services/auth.service';
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
  genre: ['Action', 'Adventure'],
  format: ['TV'],
  scoreRating: 8
} as MoviesModel;

describe('UpdateMovies', () => {
  let component: UpdateMovies;
  let fixture: ComponentFixture<UpdateMovies>;
  let mockMoviesDataService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockMoviesDataService = {
      getMovies: vi.fn().mockReturnValue(of(mockMovieData)),
      updateMovies: vi.fn().mockReturnValue(of(mockMovieData))
    };

    mockActivatedRoute = {
      snapshot: { data: { userDetails: mockUserDetails } },
      paramMap: of(new Map([['id', '1']]))
    };

    await TestBed.configureTestingModule({
      imports: [UpdateMovies],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MoviesDataService, useValue: mockMoviesDataService },
        { provide: AuthService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateMovies);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct validators', () => {
    const form = component.formUpdateMovies;
    expect(form.get('title')?.hasError('required')).toBeTruthy();
    expect(form.get('description')?.hasError('required')).toBeTruthy();
    expect(form.get('studio')?.hasError('required')).toBeTruthy();
    expect(form.get('image')?.hasError('required')).toBeTruthy();
  });

  it('should initialize with default movie id', () => {
    expect(component.movieId).toBe(1);
  });

  it('should call getMovies on component init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockMoviesDataService.getMovies).toHaveBeenCalledWith(1);
  });

  it('should load movie data and populate form', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const form = component.formUpdateMovies;
    expect(form.get('title')?.value).toBe(mockMovieData.title);
    expect(form.get('studio')?.value).toBe(mockMovieData.studio);
  });

  it('should set form as valid when all required fields are filled', () => {
    const form = component.formUpdateMovies;
    form.patchValue({
      title: 'Valid Title',
      description: 'Valid Description',
      studio: 'Valid Studio',
      image: 'valid.jpg'
    });
    expect(form.valid).toBeTruthy();
  });
});
