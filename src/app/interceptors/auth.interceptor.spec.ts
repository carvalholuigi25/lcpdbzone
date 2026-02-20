import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should add Authorization header when token exists', () => {
    const testToken = 'test-jwt-token';
    localStorage.setItem('accessToken', testToken);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    
    req.flush({});
  });

  it('should not add Authorization header when token does not exist', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeFalsy();
    
    req.flush({});
  });

  it('should handle multiple requests with token', () => {
    const testToken = 'test-jwt-token';
    localStorage.setItem('accessToken', testToken);

    httpClient.get('/api/test1').subscribe();
    httpClient.get('/api/test2').subscribe();
    httpClient.post('/api/test3', {}).subscribe();

    const req1 = httpMock.expectOne('/api/test1');
    const req2 = httpMock.expectOne('/api/test2');
    const req3 = httpMock.expectOne('/api/test3');

    expect(req1.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    expect(req2.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    expect(req3.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);

    req1.flush({});
    req2.flush({});
    req3.flush({});
  });

  it('should preserve existing headers when adding token', () => {
    const testToken = 'test-jwt-token';
    localStorage.setItem('accessToken', testToken);

    httpClient.get('/api/test', {
      headers: {
        'Custom-Header': 'custom-value'
      }
    }).subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    expect(req.request.headers.get('Custom-Header')).toBe('custom-value');
    
    req.flush({});
  });

  it('should handle empty token value gracefully', () => {
    localStorage.setItem('accessToken', '');

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    // Empty token should not add header
    expect(req.request.headers.has('Authorization')).toBeFalsy();
    
    req.flush({});
  });
});
