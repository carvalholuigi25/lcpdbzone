import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateAnimes } from './update-animes';
import { ActivatedRoute } from '@angular/router';
import { AnimesDataService } from '@/app/services';
import { AuthService } from '@/app/services/auth.service';
import { AnimesModel } from '@/app/models';

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
  genre: ['Action', 'Adventure'],
  format: ['TV'],
  scoreRating: 8
} as AnimesModel;

describe('UpdateAnimes', () => {
  let component: UpdateAnimes;
  let fixture: ComponentFixture<UpdateAnimes>;
  let mockAnimesDataService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockAnimesDataService = {
      getAnimes: vi.fn().mockReturnValue(of(mockAnimeData)),
      updateAnimes: vi.fn().mockReturnValue(of(mockAnimeData))
    };

    mockActivatedRoute = {
      snapshot: { data: { userDetails: mockUserDetails } },
      paramMap: of(new Map([['id', '1']]))
    };

    await TestBed.configureTestingModule({
      imports: [UpdateAnimes],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AnimesDataService, useValue: mockAnimesDataService },
        { provide: AuthService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateAnimes);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct validators', () => {
    const form = component.formUpdateAnimes;
    expect(form.get('title')?.hasError('required')).toBeTruthy();
    expect(form.get('description')?.hasError('required')).toBeTruthy();
    expect(form.get('studio')?.hasError('required')).toBeTruthy();
    expect(form.get('image')?.hasError('required')).toBeTruthy();
  });

  it('should initialize with default anime id', () => {
    expect(component.animeId).toBe(1);
  });

  it('should call getAnimes on component init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockAnimesDataService.getAnimes).toHaveBeenCalledWith(1);
  });

  it('should load anime data and populate form', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const form = component.formUpdateAnimes;
    expect(form.get('title')?.value).toBe(mockAnimeData.title);
    expect(form.get('studio')?.value).toBe(mockAnimeData.studio);
  });

  it('should set form as valid when all required fields are filled', () => {
    const form = component.formUpdateAnimes;
    form.patchValue({
      title: 'Valid Title',
      description: 'Valid Description',
      studio: 'Valid Studio',
      image: 'valid.jpg'
    });
    expect(form.valid).toBeTruthy();
  });
});
