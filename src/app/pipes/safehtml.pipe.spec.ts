import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtmlPipe } from './safehtml.pipe';
import { describe, it, expect, beforeEach } from 'vitest';

describe('SafeHtmlPipe', () => {
  let pipe: SafeHtmlPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SafeHtmlPipe]
    });
    pipe = TestBed.inject(SafeHtmlPipe);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should bypass security for HTML string', () => {
    const htmlString = '<div>Safe HTML</div>';
    const result = pipe.transform(htmlString);

    expect(result).toBeTruthy();
  });

  it('should handle empty string', () => {
    const result = pipe.transform('');

    expect(result).toBe('');
  });

  it('should handle null value', () => {
    const result = pipe.transform(null!);

    expect(result).toBe('');
  });

  it('should handle undefined value', () => {
    const result = pipe.transform(undefined!);

    expect(result).toBe('');
  });

  it('should return empty string for non-string values', () => {
    const result1 = pipe.transform(123 as any);
    const result2 = pipe.transform({ html: 'test' } as any);
    const result3 = pipe.transform(['<div>test</div>'] as any);

    expect(result1).toBe('');
    expect(result2).toBe('');
    expect(result3).toBe('');
  });

  it('should handle complex HTML', () => {
    const complexHtml = '<div class="test"><p>Nested <strong>content</strong></p></div>';
    const result = pipe.transform(complexHtml);

    expect(result).toBeTruthy();
  });

  it('should handle HTML with attributes', () => {
    const htmlWithAttributes = '<img src="image.jpg" alt="test" />';
    const result = pipe.transform(htmlWithAttributes);

    expect(result).toBeTruthy();
  });
});
