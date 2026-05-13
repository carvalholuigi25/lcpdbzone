import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateGames } from './update-games';
import { ActivatedRoute } from '@angular/router';
import { GamesDataService } from '@/app/services';
import { AuthService } from '@/app/services/auth.service';
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
  genre: ['Action', 'Adventure'],
  format: ['TV'],
  scoreRating: 8
} as GamesModel;

describe('UpdateGames', () => {
  let component: UpdateGames;
  let fixture: ComponentFixture<UpdateGames>;
  let mockGamesDataService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockGamesDataService = {
      getGames: vi.fn().mockReturnValue(of(mockGameData)),
      updateGames: vi.fn().mockReturnValue(of(mockGameData))
    };

    mockActivatedRoute = {
      snapshot: { data: { userDetails: mockUserDetails } },
      paramMap: of(new Map([['id', '1']]))
    };

    await TestBed.configureTestingModule({
      imports: [UpdateGames],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: GamesDataService, useValue: mockGamesDataService },
        { provide: AuthService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateGames);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct validators', () => {
    const form = component.formUpdateGames;
    expect(form.get('title')?.hasError('required')).toBeTruthy();
    expect(form.get('description')?.hasError('required')).toBeTruthy();
    expect(form.get('studio')?.hasError('required')).toBeTruthy();
    expect(form.get('image')?.hasError('required')).toBeTruthy();
  });

  it('should initialize with default game id', () => {
    expect(component.gameId).toBe(1);
  });

  it('should call getGames on component init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockGamesDataService.getGames).toHaveBeenCalledWith(1);
  });

  it('should load game data and populate form', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const form = component.formUpdateGames;
    expect(form.get('title')?.value).toBe(mockGameData.title);
    expect(form.get('studio')?.value).toBe(mockGameData.studio);
  });

  it('should set form as valid when all required fields are filled', () => {
    const form = component.formUpdateGames;
    form.patchValue({
      title: 'Valid Title',
      description: 'Valid Description',
      studio: 'Valid Studio',
      image: 'valid.jpg'
    });
    expect(form.valid).toBeTruthy();
  });
});
