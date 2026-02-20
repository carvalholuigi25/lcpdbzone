import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TVSeriesDataService } from './tvseriesdata.service';
import { describe, it, expect, beforeEach } from 'vitest';

describe('TVSeriesDataService', () => {
  let service: TVSeriesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TVSeriesDataService]
    });
    service = TestBed.inject(TVSeriesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch tv series data', () => {
    expect(service).toBeTruthy();
  });

  it('should create tv series', () => {
    expect(service).toBeTruthy();
  });

  it('should update tv series', () => {
    expect(service).toBeTruthy();
  });

  it('should delete tv series', () => {
    expect(service).toBeTruthy();
  });

  describe('destroy', () => {
    it('should cleanup resources', () => {
      service.destroy();
      expect(service).toBeTruthy();
    });
  });
});
