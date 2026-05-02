import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { TokenRefreshInterceptor } from './reftoken.interceptor';
import { AuthService } from '../services/auth.service';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MOCK_TOKENS = { accessToken: 'new-access-token', refreshToken: 'new-refresh-token' };

function makeAuthServiceSpy() {
  return {
    refreshToken: vi.fn(),
    storeTokens: vi.fn(),
  };
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('TokenRefreshInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: ReturnType<typeof makeAuthServiceSpy>;
  let interceptor: TokenRefreshInterceptor;

  beforeEach(() => {
    authService = makeAuthServiceSpy();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TokenRefreshInterceptor,
        { provide: AuthService, useValue: authService },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    interceptor = TestBed.inject(TokenRefreshInterceptor);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // -------------------------------------------------------------------------
  // Unit-level tests (interceptor tested in isolation via intercept())
  // -------------------------------------------------------------------------

  describe('intercept()', () => {
    function buildHandler(statusCode: number, body: unknown = {}) {
      return {
        handle: vi.fn().mockReturnValueOnce(
          throwError(
            () =>
              new HttpErrorResponse({
                status: statusCode,
                statusText: statusCode === 401 ? 'Unauthorized' : 'Server Error',
                error: body,
              })
          )
        ),
      };
    }

    function buildSuccessHandler(responseBody = {}) {
      return {
        handle: vi.fn().mockReturnValue(of(responseBody)),
      };
    }

    it('should pass through requests that succeed without modification', () => {
      const req = { url: '/api/data' } as any;
      const next = buildSuccessHandler({ data: 42 });

      const result$ = interceptor.intercept(req, next as any);

      return new Promise<void>((resolve, reject) => {
        result$.subscribe({
          next: (val: any) => {
            expect(val).toEqual({ data: 42 });
            expect(next.handle).toHaveBeenCalledWith(req);
            resolve();
          },
          error: (err: any) => {
            reject(err);
          },
        });
      });
    });

    it('should call auth.refreshToken() when a 401 response is received', () => {
      authService.refreshToken.mockReturnValue(of(MOCK_TOKENS));

      const req = { url: '/api/secure', clone: vi.fn().mockReturnValue({ url: '/api/secure' }) } as any;
      const next = {
        handle: vi
          .fn()
          .mockReturnValueOnce(
            throwError(() => new HttpErrorResponse({ status: 401 }))
          )
          .mockReturnValue(of({ success: true })),
      };

      return new Promise<void>((resolve, reject) => {
        interceptor.intercept(req, next as any).subscribe({
          next: () => {
            expect(authService.refreshToken).toHaveBeenCalledTimes(1);
            resolve();
          },
          error: (err: any) => {
            reject(err);
          },
        });
      });
    });

    it('should store the new tokens after a successful refresh', () => {
      authService.refreshToken.mockReturnValue(of(MOCK_TOKENS));

      const req = { url: '/api/secure', clone: vi.fn().mockReturnValue({}) } as any;
      const next = {
        handle: vi
          .fn()
          .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 401 })))
          .mockReturnValue(of({})),
      };

      return new Promise<void>((resolve, reject) => {
        interceptor.intercept(req, next as any).subscribe({
          next: () => {
            expect(authService.storeTokens).toHaveBeenCalledWith(MOCK_TOKENS);
            resolve();
          },
          error: (err: any) => {
            reject(err);
          },
        });
      });
    });

    it('should retry the original request with a Bearer Authorization header after refresh', () => {
      authService.refreshToken.mockReturnValue(of(MOCK_TOKENS));

      const clonedReq = { url: '/api/secure', headers: 'mocked' };
      const req = { url: '/api/secure', clone: vi.fn().mockReturnValue(clonedReq) } as any;
      const next = {
        handle: vi
          .fn()
          .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 401 })))
          .mockReturnValue(of({ ok: true })),
      };

      return new Promise<void>((resolve, reject) => {
        interceptor.intercept(req, next as any).subscribe({
          next: () => {
            expect(req.clone).toHaveBeenCalledWith({
              setHeaders: { Authorization: `Bearer ${MOCK_TOKENS.accessToken}` },
            });
            expect(next.handle).toHaveBeenCalledWith(clonedReq);
            resolve();
          },
          error: (err: any) => {
            reject(err);
          },
        });
      });
    });

    it('should re-throw non-401 errors without attempting a refresh', () => {
      const error = new HttpErrorResponse({ status: 500 });
      const req = { url: '/api/data' } as any;
      const next = buildHandler(500);

      return new Promise<void>((resolve, reject) => {
        interceptor.intercept(req, next as any).subscribe({
          next: () => reject(new Error('Should not emit a value')),
          error: (err: any) => {
            expect(err).toBeInstanceOf(HttpErrorResponse);
            expect(err.status).toBe(500);
            expect(authService.refreshToken).not.toHaveBeenCalled();
            resolve();
          },
        });
      });
    });

    it('should propagate errors that occur during token refresh', () => {
      const refreshError = new Error('Refresh failed');
      authService.refreshToken.mockReturnValue(throwError(() => refreshError));

      const req = { url: '/api/secure', clone: vi.fn() } as any;
      const next = {
        handle: vi
          .fn()
          .mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 }))),
      };

      return new Promise<void>((resolve, reject) => {
        interceptor.intercept(req, next as any).subscribe({
          next: () => reject(new Error('Should not emit a value')),
          error: (err: any) => {
            expect(err).toBe(refreshError);
            resolve();
          },
        });
      });
    });

    it('should re-throw a 401 error when no 401 handling is needed (non-401 path)', () => {
      const error = new HttpErrorResponse({ status: 403 });
      const req = { url: '/api/forbidden' } as any;
      const next = buildHandler(403);

      return new Promise<void>((resolve, reject) => {
        interceptor.intercept(req, next as any).subscribe({
          error: (err: HttpErrorResponse) => {
            expect(err.status).toBe(403);
            resolve();
          },
        });
      });
    });
  });
});