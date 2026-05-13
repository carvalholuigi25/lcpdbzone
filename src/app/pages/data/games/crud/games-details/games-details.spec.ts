import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GamesDetails } from './games-details';
import { ActivatedRoute } from '@angular/router';
import { GamesDataService } from '@/app/services';
import { GamesModel } from '@models/games';

describe('GamesDetails', () => {
  let component: GamesDetails;
  let fixture: ComponentFixture<GamesDetails>;
  let mockActivatedRoute: any;
  let mockGamesDataService: any;
  const mockGameData: GamesModel = {
    id: 1,
    title: 'Test Game',
  } as GamesModel;

  beforeEach(async () => {
    mockActivatedRoute = {
      paramMap: of(new Map([['id', '1']]))
    };

    mockGamesDataService = {
      getGames: vi.fn().mockReturnValue(of(mockGameData)),
      destroy: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [GamesDetails],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: GamesDataService, useValue: mockGamesDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GamesDetails);
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

  it('should load game data on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockGamesDataService.getGames).toHaveBeenCalledWith(1);
    expect(component.isLoading).toBe(false);
  });

  it('should set gamesdata$ observable', (done) => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.gamesdata$.subscribe(data => {
        expect(data).toEqual(mockGameData);
      });
    });
  });

  it('should not load data if id is invalid', async () => {
    mockActivatedRoute.paramMap = of(new Map([['id', 'invalid']]));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockGamesDataService.getGames).not.toHaveBeenCalled();
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
    expect(mockGamesDataService.destroy).toHaveBeenCalled();
    vi.spyOn(mockGamesDataService, 'destroy'); // Reset the mock to avoid affecting other tests
  });
});
