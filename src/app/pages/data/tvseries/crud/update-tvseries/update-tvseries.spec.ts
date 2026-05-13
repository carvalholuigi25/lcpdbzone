import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateTvseries } from './update-tvseries';
import { ActivatedRoute } from '@angular/router';
import { TVSeriesDataService } from '@/app/services';
import { AuthService } from '@/app/services/auth.service';
import { TvSeriesModel } from '@/app/models';

const mockUserDetails = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'admin',
  token: 'testtoken'
};

const mockTvserieData = {
  tvserieId: 1,
  title: 'Test Tvserie',
  description: 'Test Description',
  studio: 'Test Studio',
  image: 'test.jpg',
  artwork: 'artwork.jpg',
  isFeatured: true,
  releaseDate: '2024-01-01',
  genre: ['Action', 'Adventure'],
  format: ['TV'],
  scoreRating: 8
} as TvSeriesModel;

describe('UpdateTvseries', () => {
  let component: UpdateTvseries;
  let fixture: ComponentFixture<UpdateTvseries>;
  let mockTvseriesDataService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockTvseriesDataService = {
      getTvseries: vi.fn().mockReturnValue(of(mockTvserieData)),
      updateTvseries: vi.fn().mockReturnValue(of(mockTvserieData))
    };

    mockActivatedRoute = {
      snapshot: { data: { userDetails: mockUserDetails } },
      paramMap: of(new Map([['id', '1']]))
    };

    await TestBed.configureTestingModule({
      imports: [UpdateTvseries],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TVSeriesDataService, useValue: mockTvseriesDataService },
        { provide: AuthService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTvseries);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct validators', () => {
    const form = component.formUpdateTVSeries;
    expect(form.get('title')?.hasError('required')).toBeTruthy();
    expect(form.get('description')?.hasError('required')).toBeTruthy();
    expect(form.get('studio')?.hasError('required')).toBeTruthy();
    expect(form.get('image')?.hasError('required')).toBeTruthy();
  });

  it('should initialize with default tvserie id', () => {
    expect(component.tvserieId).toBe(1);
  });

  it('should call getTvseries on component init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockTvseriesDataService.getTvseries).toHaveBeenCalledWith(1);
  });

  it('should load tvserie data and populate form', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const form = component.formUpdateTVSeries;
    expect(form.get('title')?.value).toBe(mockTvserieData.title);
    expect(form.get('studio')?.value).toBe(mockTvserieData.studio);
  });

  it('should set form as valid when all required fields are filled', () => {
    const form = component.formUpdateTVSeries;
    form.patchValue({
      title: 'Valid Title',
      description: 'Valid Description',
      studio: 'Valid Studio',
      image: 'valid.jpg'
    });
    expect(form.valid).toBeTruthy();
  });
});
