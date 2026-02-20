import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from './safe.pipe';
import { describe, it, expect, beforeEach } from 'vitest';

describe('SafePipe', () => {
  let pipe: SafePipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SafePipe]
    });
    pipe = TestBed.inject(SafePipe);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should bypass security for URL', () => {
    const testUrl = 'https://www.example.com/resource';
    const result = pipe.transform(testUrl);

    expect(result).toBeTruthy();
  });

  it('should handle different URL formats', () => {
    const urls = [
      'https://example.com',
      'http://example.com',
      '/relative/path',
      'about:blank'
    ];

    urls.forEach(url => {
      const result = pipe.transform(url);
      expect(result).toBeTruthy();
    });
  });

  it('should handle empty string', () => {
    const result = pipe.transform('');
    expect(result).toBeTruthy();
  });

  it('should handle iframe URLs', () => {
    const iframeUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    const result = pipe.transform(iframeUrl);
    expect(result).toBeTruthy();
  });
});
