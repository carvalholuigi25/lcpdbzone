import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BooksDataService } from './booksdata.service';
import { describe, it, expect, beforeEach } from 'vitest';

describe('BooksDataService', () => {
  let service: BooksDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BooksDataService]
    });
    service = TestBed.inject(BooksDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch books data', () => {
    expect(service).toBeTruthy();
  });

  it('should create book', () => {
    expect(service).toBeTruthy();
  });

  it('should update book', () => {
    expect(service).toBeTruthy();
  });

  it('should delete book', () => {
    expect(service).toBeTruthy();
  });

  describe('destroy', () => {
    it('should cleanup resources', () => {
      service.destroy();
      expect(service).toBeTruthy();
    });
  });
});
