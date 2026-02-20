import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AnimesDataService } from './animesdata.service';
import { AnimesModel, AllDataAnimes } from '@/app/models';
import { describe, it, expect, beforeEach } from 'vitest';

describe('AnimesDataService', () => {
  let service: AnimesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnimesDataService]
    });
    service = TestBed.inject(AnimesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAnimes', () => {
    it('should fetch all animes', () => {
      const mockData: AllDataAnimes = {
        totalCount: 0,
        page: 1,
        pageSize: 10,
        data: []
      };

      service.getAnimes().subscribe(result => {
        expect(result).toEqual(mockData);
      });
    });

    it('should fetch anime by id', () => {
      const mockData: AllDataAnimes = {
        totalCount: 0,
        page: 1,
        pageSize: 10,
        data: []
      };

      service.getAnimes(1).subscribe(result => {
        expect(result).toEqual(mockData);
      });
    });
  });

  describe('createAnimes', () => {
    it('should create new anime', () => {
      const newAnime: AnimesModel = {
        title: 'Test Anime',
        description: 'Test Description',
        image: 'http://example.com/image.jpg'
      };

      service.createAnimes(newAnime).subscribe(result => {
        expect(result).toEqual(newAnime);
      });
    });
  });

  describe('updateAnimes', () => {
    it('should update existing anime', () => {
      const updatedAnime: AnimesModel = {
        title: 'Updated Anime',
        description: 'Updated Description',
        image: 'http://example.com/image.jpg'
      };

      service.updateAnimes(1, updatedAnime).subscribe(result => {
        expect(result).toEqual(updatedAnime);
      });
    });
  });

  describe('delAnimes', () => {
    it('should delete anime', () => {
      const anime: AnimesModel = {
        title: 'Test Anime',
        description: 'Test Description',
        image: 'http://example.com/image.jpg'
      };

      service.delAnimes(1).subscribe(result => {
        expect(result).toEqual(anime);
      });
    });
  });

  describe('destroy', () => {
    it('should cleanup resources', () => {
      service.destroy();
      expect(service).toBeTruthy();
    });
  });
});
