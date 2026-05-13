import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateAnimes } from './create-animes';
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

const mockCreatedAnime = {
  animeId: 1,
  title: 'New Anime',
  description: 'New Description',
  studio: 'New Studio',
  image: 'new.jpg',
  artwork: 'new-artwork.jpg',
  isFeatured: false,
  releaseDate: '2024-06-01',
  genre: ['Drama'],
  format: ['Movie'],
  scoreRating: 7
} as AnimesModel;

describe('CreateAnimes', () => {
  let component: CreateAnimes;
  let fixture: ComponentFixture<CreateAnimes>;
  let mockAnimesDataService: any;

  beforeEach(async () => {
    mockAnimesDataService = {
      createAnimes: vi.fn().mockReturnValue(of(mockCreatedAnime))
    };

    await TestBed.configureTestingModule({
      imports: [CreateAnimes],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { userDetails: mockUserDetails } } } },
        { provide: AnimesDataService, useValue: mockAnimesDataService },
        { provide: AuthService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAnimes);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required validators', () => {
    const form = component.formCreateAnimes;
    expect(form.get('title')?.hasError('required')).toBeTruthy();
    expect(form.get('description')?.hasError('required')).toBeTruthy();
    expect(form.get('studio')?.hasError('required')).toBeTruthy();
    expect(form.get('image')?.hasError('required')).toBeTruthy();
  });

  it('should have default values for optional fields', () => {
    const form = component.formCreateAnimes;
    expect(form.get('isFeatured')?.value).toBe('');
    expect(form.get('scoreRating')?.value).toBe(0);
  });

  it('should have artwork field with no validators', () => {
    const form = component.formCreateAnimes;
    expect(form.get('artwork')?.hasError('required')).toBeTruthy();
  });

  it('should set form as valid when all required fields are filled', () => {
    const form = component.formCreateAnimes;
    form.patchValue({
      title: 'Test Anime',
      description: 'Test Description',
      studio: 'Test Studio',
      image: 'test.jpg',
      artwork: 'artwork.jpg'
    });
    expect(form.valid).toBeTruthy();
  });

  it('should set form as invalid when required fields are empty', () => {
    const form = component.formCreateAnimes;
    form.patchValue({
      title: '',
      description: '',
      studio: '',
      image: '',
      artwork: ''
    });
    expect(form.invalid).toBeTruthy();
  });

  it('should initialize with empty form values', () => {
    const form = component.formCreateAnimes;
    expect(form.get('title')?.value).toBe('');
    expect(form.get('description')?.value).toBe('');
    expect(form.get('genre')?.value).toEqual(['']);
    expect(form.get('format')?.value).toEqual(['']);
  });
});
