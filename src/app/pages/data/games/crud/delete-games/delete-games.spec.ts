import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeleteGames } from './delete-games';
import { ActivatedRoute } from '@angular/router';
import { GamesDataService } from '@/app/services';
import { myFunctionsService } from '@/app/services';
import { GamesModel } from '@/app/models';

const mockUserDetails = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'admin',
  token: 'testtoken'
};

const mockGameData = {
  gameId: 1,
  title: 'Test Game',
  description: 'Test Description',
  studio: 'Test Studio',
  image: 'test.jpg',
  artwork: 'artwork.jpg',
  isFeatured: true,
  releaseDate: '2024-01-01',
  genre: ['Action'],
  format: ['TV'],
  scoreRating: 8
} as GamesModel;

describe('DeleteGames', () => {
  let component: DeleteGames;
  let fixture: ComponentFixture<DeleteGames>;
  let mockGamesDataService: any;
  let mockMyFunctionsService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockGamesDataService = {
      getGames: vi.fn().mockReturnValue(of(mockGameData)),
      delGames: vi.fn().mockReturnValue(of({ success: true })),
      destroy: vi.fn()
    };

    mockMyFunctionsService = {
      getAlertWarning: vi.fn().mockReturnValue({
        type: 'warning',
        message: 'NO Games data has been found!'
      })
    };

    mockActivatedRoute = {
      snapshot: { data: { userDetails: mockUserDetails } },
      paramMap: of(new Map([['id', '1']]))
    };

    await TestBed.configureTestingModule({
      imports: [DeleteGames],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: GamesDataService, useValue: mockGamesDataService },
        { provide: myFunctionsService, useValue: mockMyFunctionsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteGames);
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
    expect(mockMyFunctionsService.getAlertWarning).toHaveBeenCalledWith('NO Games data has been found!');
  });

  it('should initialize form with gameId control', () => {
    const form = component.formDeleteGames;
    expect(form.get('gameId')).toBeTruthy();
    expect(form.get('gameId')?.hasError('required')).toBeTruthy();
  });

  it('should load data on component init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockGamesDataService.getGames).toHaveBeenCalledWith(1);
  });

  it('should set isLoading to false after data loads', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.isLoading).toBe(false);
  });

  it('should reset form to default id', () => {
    component.id = 5;
    component.onReset();
    expect(component.formDeleteGames.get('gameId')?.value).toBe(5);
  });

  it('should call destroy on service during ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(mockGamesDataService.destroy).toHaveBeenCalled();
  });

  it('should reset gamesdata$ observable on destroy', () => {
    fixture.detectChanges();
    component.ngOnDestroy();
    expect(component.isLoading).toBe(true);
  });
});
