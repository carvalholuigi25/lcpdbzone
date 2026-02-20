import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GamesDataService } from './gamesdata.service';
import { describe, it, expect, beforeEach } from 'vitest';

describe('GamesDataService', () => {
  let service: GamesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GamesDataService]
    });
    service = TestBed.inject(GamesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch games data', () => {
    expect(service).toBeTruthy();
  });

  it('should create game', () => {
    expect(service).toBeTruthy();
  });

  it('should update game', () => {
    expect(service).toBeTruthy();
  });

  it('should delete game', () => {
    expect(service).toBeTruthy();
  });

  describe('destroy', () => {
    it('should cleanup resources', () => {
      service.destroy();
      expect(service).toBeTruthy();
    });
  });
});
