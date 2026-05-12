import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeleteAnimes } from './delete-animes';
import { ActivatedRoute } from '@angular/router';
import { AnimesDataService } from '@/app/services';
import { myFunctionsService } from '@/app/services';

const mockUserDetails = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'admin',
  token: 'testtoken'
};

const mockAnimeData = {
  animeId: 1,
  title: 'Test Anime',
  description: 'Test Description',
  studio: 'Test Studio',
  image: 'test.jpg',
  artwork: 'artwork.jpg',
  isFeatured: true,
  releaseDate: '2024-01-01',
  genre: ['Action'],
  format: ['TV'],
  scoreRating: 8
};

describe('DeleteAnimes', () => {
  let component: DeleteAnimes;
  let fixture: ComponentFixture<DeleteAnimes>;
  let mockAnimesDataService: any;
  let mockMyFunctionsService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockAnimesDataService = {
      getAnimes: vi.fn().mockReturnValue(of(mockAnimeData)),
      delAnimes: vi.fn().mockReturnValue(of({ success: true })),
      destroy: vi.fn()
    };

    mockMyFunctionsService = {
      getAlertWarning: vi.fn().mockReturnValue({
        type: 'warning',
        message: 'NO Animes data has been found!'
      })
    };

    mockActivatedRoute = {
      snapshot: { data: { userDetails: mockUserDetails } },
      paramMap: of(new Map([['id', '1']]))
    };

    await TestBed.configureTestingModule({
      imports: [DeleteAnimes],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AnimesDataService, useValue: mockAnimesDataService },
        { provide: myFunctionsService, useValue: mockMyFunctionsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteAnimes);
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
    expect(mockMyFunctionsService.getAlertWarning).toHaveBeenCalledWith('NO Animes data has been found!');
  });

  it('should initialize form with animeId control', () => {
    const form = component.formDeleteAnimes;
    expect(form.get('animeId')).toBeTruthy();
    expect(form.get('animeId')?.hasError('required')).toBeTruthy();
  });

  it('should load data on component init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockAnimesDataService.getAnimes).toHaveBeenCalledWith(1);
  });

  it('should set isLoading to false after data loads', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.isLoading).toBe(false);
  });

  it('should reset form to default id', () => {
    component.id = 5;
    component.onReset();
    expect(component.formDeleteAnimes.get('animeId')?.value).toBe(5);
  });

  it('should call destroy on service during ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(mockAnimesDataService.destroy).toHaveBeenCalled();
  });

  it('should reset animesdata$ observable on destroy', () => {
    fixture.detectChanges();
    component.ngOnDestroy();
    expect(component.isLoading).toBe(true);
  });
});
