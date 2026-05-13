import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeleteTvseries } from './delete-tvseries';
import { ActivatedRoute } from '@angular/router';
import { TVSeriesDataService } from '@/app/services';
import { myFunctionsService } from '@/app/services';
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
  genre: ['Action'],
  format: ['TV'],
  scoreRating: 8
} as TvSeriesModel;

describe('DeleteTvseries', () => {
  let component: DeleteTvseries;
  let fixture: ComponentFixture<DeleteTvseries>;
  let mockTvseriesDataService: any;
  let mockMyFunctionsService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockTvseriesDataService = {
      getTvseries: vi.fn().mockReturnValue(of(mockTvserieData)),
      delTvseries: vi.fn().mockReturnValue(of({ success: true })),
      destroy: vi.fn()
    };

    mockMyFunctionsService = {
      getAlertWarning: vi.fn().mockReturnValue({
        type: 'warning',
        message: 'NO Tvseries data has been found!'
      })
    };

    mockActivatedRoute = {
      snapshot: { data: { userDetails: mockUserDetails } },
      paramMap: of(new Map([['id', '1']]))
    };

    await TestBed.configureTestingModule({
      imports: [DeleteTvseries],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TVSeriesDataService, useValue: mockTvseriesDataService },
        { provide: myFunctionsService, useValue: mockMyFunctionsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteTvseries);
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
    expect(mockMyFunctionsService.getAlertWarning).toHaveBeenCalledWith('NO Tvseries data has been found!');
  });

  it('should initialize form with tvserieId control', () => {
    const form = component.formDeleteTVSeries;
    expect(form.get('tvserieId')).toBeTruthy();
    expect(form.get('tvserieId')?.hasError('required')).toBeTruthy();
  });

  it('should load data on component init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockTvseriesDataService.getTvseries).toHaveBeenCalledWith(1);
  });

  it('should set isLoading to false after data loads', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.isLoading).toBe(false);
  });

  it('should reset form to default id', () => {
    component.id = 5;
    component.onReset();
    expect(component.formDeleteTVSeries.get('tvserieId')?.value).toBe(5);
  });

  it('should call destroy on service during ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(mockTvseriesDataService.destroy).toHaveBeenCalled();
  });

  it('should reset tvseriesdata$ observable on destroy', () => {
    fixture.detectChanges();
    component.ngOnDestroy();
    expect(component.isLoading).toBe(true);
  });
});
