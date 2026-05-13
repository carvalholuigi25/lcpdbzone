import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MoviesDetails } from './movies-details';
import { ActivatedRoute } from '@angular/router';
import { MoviesDataService } from '@/app/services';
import { MoviesModel } from '@models/movies';

describe('MoviesDetails', () => {
  let component: MoviesDetails;
  let fixture: ComponentFixture<MoviesDetails>;
  let mockActivatedRoute: any;
  let mockMoviesDataService: any;
  const mockMovieData: MoviesModel = {
    id: 1,
    title: 'Test Movie',
  } as MoviesModel;

  beforeEach(async () => {
    mockActivatedRoute = {
      paramMap: of(new Map([['id', '1']]))
    };

    mockMoviesDataService = {
      getMovies: vi.fn().mockReturnValue(of(mockMovieData)),
      destroy: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [MoviesDetails],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MoviesDataService, useValue: mockMoviesDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesDetails);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read id from route params on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.id).toBe(1);
  });

  it('should load movie data on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockMoviesDataService.getMovies).toHaveBeenCalledWith(1);
    expect(component.isLoading).toBe(false);
  });

  it('should set moviesdata$ observable', (done) => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.moviesdata$.subscribe(data => {
        expect(data).toEqual(mockMovieData);
      });
    });
  });

  it('should not load data if id is invalid', async () => {
    mockActivatedRoute.paramMap = of(new Map([['id', 'invalid']]));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockMoviesDataService.getMovies).not.toHaveBeenCalled();
  });

  it('should toggle loadedVideo state', () => {
    expect(component.loadedVideo).toBe(false);
    component.toggleLoadVideo();
    expect(component.loadedVideo).toBe(true);
    component.toggleLoadVideo();
    expect(component.loadedVideo).toBe(false);
  });

  it('should call destroy on service during ngOnDestroy', () => {
    fixture.detectChanges();
    component.ngOnDestroy();
    expect(mockMoviesDataService.destroy).toHaveBeenCalled();
    vi.spyOn(mockMoviesDataService, 'destroy'); // Reset the mock to avoid affecting other tests
  });
});
