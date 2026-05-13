import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TvseriesDetails } from './tvseries-details';
import { ActivatedRoute } from '@angular/router';
import { TVSeriesDataService } from '@/app/services';
import { TvSeriesModel } from '@models/tvseries';

describe('TvseriesDetails', () => {
  let component: TvseriesDetails;
  let fixture: ComponentFixture<TvseriesDetails>;
  let mockActivatedRoute: any;
  let mockTvseriesDataService: any;
  const mockTvseriesData: TvSeriesModel = {
    id: 1,
    title: 'Test Tvseries',
  } as TvSeriesModel;

  beforeEach(async () => {
    mockActivatedRoute = {
      paramMap: of(new Map([['id', '1']]))
    };

    mockTvseriesDataService = {
      getTvseries: vi.fn().mockReturnValue(of(mockTvseriesData)),
      destroy: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TvseriesDetails],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TVSeriesDataService, useValue: mockTvseriesDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TvseriesDetails);
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

  it('should load tvseries data on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockTvseriesDataService.getTvseries).toHaveBeenCalledWith(1);
    expect(component.isLoading).toBe(false);
  });

  it('should set tvseriesdata$ observable', (done) => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.tvseriesdata$.subscribe(data => {
        expect(data).toEqual(mockTvseriesData);
      });
    });
  });

  it('should not load data if id is invalid', async () => {
    mockActivatedRoute.paramMap = of(new Map([['id', 'invalid']]));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockTvseriesDataService.getTvseries).not.toHaveBeenCalled();
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
    expect(mockTvseriesDataService.destroy).toHaveBeenCalled();
    vi.spyOn(mockTvseriesDataService, 'destroy'); // Reset the mock to avoid affecting other tests
  });
});
