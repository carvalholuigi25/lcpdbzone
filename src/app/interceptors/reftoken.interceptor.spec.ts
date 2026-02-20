import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenRefreshInterceptor } from './reftoken.interceptor';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('TokenRefreshInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: any;

  beforeEach(() => {
    const authServiceSpy = {
      refreshToken: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenRefreshInterceptor,
          multi: true
        },
        {
          provide: AuthService,
          useValue: authServiceSpy
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should allow request to pass through on success', () => {
    httpClient.get('/api/test').subscribe((response) => {
      expect(response).toEqual({ data: 'test' });
    });

    const req = httpMock.expectOne('/api/test');
    req.flush({ data: 'test' });
  });

  it('should attempt token refresh on 401 error', () => {
    const newTokens = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      jwtToken: 'new-jwt-token',
      id: 1,
      username: 'testuser',
      displayName: 'Test User',
      role: 'user'
    };

    authService.refreshToken.mockReturnValue(of(newTokens));

    httpClient.get('/api/test').subscribe(() => {
      // Handler for success
    });

    const req = httpMock.expectOne('/api/test');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    // Check if token refresh was called
    expect(authService.refreshToken).toHaveBeenCalled();
  });

  it('should pass through non-401 errors', () => {
    httpClient.get('/api/test').subscribe(
      () => {
        // Should not succeed
      },
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne('/api/test');
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should retry request after successful token refresh', () => {
    const newTokens = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      jwtToken: 'new-jwt-token',
      id: 1,
      username: 'testuser',
      displayName: 'Test User',
      role: 'user'
    };

    authService.refreshToken.mockReturnValue(of(newTokens));

    httpClient.get('/api/test').subscribe((response) => {
      expect(response).toEqual({ data: 'test' });
    });

    // First request fails with 401
    const req1 = httpMock.expectOne('/api/test');
    req1.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    // After token refresh, the same request should be retried
    const req2 = httpMock.expectOne('/api/test');
    req2.flush({ data: 'test' });
  });

  it('should handle token refresh failure', () => {
    authService.refreshToken.mockReturnValue(
      throwError(() => new Error('Refresh failed'))
    );

    httpClient.get('/api/test').subscribe(
      () => {
        // Should not succeed
      },
      (error) => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne('/api/test');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should add new token to retried request', () => {
    const newTokens = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      jwtToken: 'new-jwt-token',
      id: 1,
      username: 'testuser',
      displayName: 'Test User',
      role: 'user'
    };

    authService.refreshToken.mockReturnValue(of(newTokens));

    httpClient.get('/api/test').subscribe(() => {
      // Handler for success
    });

    const req1 = httpMock.expectOne('/api/test');
    req1.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    const req2 = httpMock.expectOne('/api/test');
    expect(req2.request.headers.get('Authorization')).toBe(`Bearer ${newTokens.accessToken}`);
    req2.flush({ data: 'test' });
  });
});
