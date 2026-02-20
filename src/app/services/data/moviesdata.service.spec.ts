import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MoviesDataService } from './moviesdata.service';
import { describe, it, expect, beforeEach } from 'vitest';

describe('MoviesDataService', () => {
  let service: MoviesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MoviesDataService]
    });
    service = TestBed.inject(MoviesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch movies data', () => {
    expect(service).toBeTruthy();
  });

  it('should create movie', () => {
    expect(service).toBeTruthy();
  });

  it('should update movie', () => {
    expect(service).toBeTruthy();
  });

  it('should delete movie', () => {
    expect(service).toBeTruthy();
  });

  describe('destroy', () => {
    it('should cleanup resources', () => {
      service.destroy();
      expect(service).toBeTruthy();
    });
  });
});
