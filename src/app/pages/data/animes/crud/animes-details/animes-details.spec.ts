import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AnimesDetails } from './animes-details';
import { ActivatedRoute } from '@angular/router';
import { AnimesDataService } from '@/app/services';
import { AnimesModel } from '@models/animes';

describe('AnimesDetails', () => {
  let component: AnimesDetails;
  let fixture: ComponentFixture<AnimesDetails>;
  let mockActivatedRoute: any;
  let mockAnimesDataService: any;
  const mockAnimeData: AnimesModel = {
    id: 1,
    title: 'Test Anime',
  } as AnimesModel;

  beforeEach(async () => {
    mockActivatedRoute = {
      paramMap: of(new Map([['id', '1']]))
    };

    mockAnimesDataService = {
      getAnimes: vi.fn().mockReturnValue(of(mockAnimeData)),
      destroy: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AnimesDetails],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AnimesDataService, useValue: mockAnimesDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnimesDetails);
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

  it('should load anime data on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockAnimesDataService.getAnimes).toHaveBeenCalledWith(1);
    expect(component.isLoading).toBe(false);
  });

  it('should set animesdata$ observable', (done) => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.animesdata$.subscribe(data => {
        expect(data).toEqual(mockAnimeData);
      });
    });
  });

  it('should not load data if id is invalid', async () => {
    mockActivatedRoute.paramMap = of(new Map([['id', 'invalid']]));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockAnimesDataService.getAnimes).not.toHaveBeenCalled();
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
    expect(mockAnimesDataService.destroy).toHaveBeenCalled();
    vi.spyOn(mockAnimesDataService, 'destroy'); // Reset the mock to avoid affecting other tests
  });
});
