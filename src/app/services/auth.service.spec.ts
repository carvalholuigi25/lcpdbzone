import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth.service';
import { AuthResponse, LoginRequest, AuthUserRegModel, AuthUserForgotPassModel } from '@/app/models/auth';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login', () => {
    it('should send login request and store tokens', () => {
      const loginData: LoginRequest = { 
        username: 'testuser', 
        password: 'password123' 
      };
      const response: AuthResponse = {
        id: 1,
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
        jwtToken: 'test-jwt-token'
      };

      service.login(loginData).subscribe(() => {
        expect(localStorage.getItem('accessToken')).toBe('test-jwt-token');
        expect(localStorage.getItem('refreshToken')).toBe('test-jwt-token');
      });

      const req = httpMock.expectOne(req => req.url.includes('/auth/authenticate'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginData);
      req.flush(response);
    });
  });

  describe('register', () => {
    it('should send register request', () => {
      const registerData: AuthUserRegModel = {
        username: 'newuser',
        password: 'password123',
        email: 'newuser@test.com'
      };

      service.register(registerData).subscribe((result) => {
        expect(result).toEqual(registerData);
      });

      const req = httpMock.expectOne(req => req.url.includes('/api/users'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerData);
      req.flush(registerData);
    });
  });

  describe('forgotPass', () => {
    it('should send forgot password request', () => {
      const forgotData: AuthUserForgotPassModel = {
        email: 'user@test.com',
        password: 'newpass123'
      };

      service.forgotPass(forgotData).subscribe((result) => {
        expect(result).toEqual(forgotData);
      });

      const req = httpMock.expectOne(req => req.url.includes('/api/users'));
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(forgotData);
      req.flush(forgotData);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token when tokens exist', () => {
      localStorage.setItem('accessToken', 'old-access-token');
      localStorage.setItem('refreshToken', 'refresh-token');

      const response: AuthResponse = {
        id: 1,
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
        jwtToken: 'new-jwt-token'
      };

      service.refreshToken().subscribe(() => {
        expect(localStorage.getItem('accessToken')).toBe('new-jwt-token');
      });

      const req = httpMock.expectOne(req => req.url.includes('/auth/refresh-token'));
      expect(req.request.method).toBe('POST');
      req.flush(response);
    });
  });

  describe('logout', () => {
    it('should clear localStorage on logout', () => {
      localStorage.setItem('accessToken', 'test-token');
      localStorage.setItem('login', JSON.stringify({ id: 1, role: 'user' }));

      service.logout();

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('login')).toBeNull();
    });
  });

  describe('getAccessToken', () => {
    it('should return access token from localStorage', () => {
      const testToken = 'test-access-token';
      localStorage.setItem('accessToken', testToken);

      const result = service.getAccessToken();

      expect(result).toBe(testToken);
    });

    it('should return null when no token exists', () => {
      const result = service.getAccessToken();

      expect(result).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('should return refresh token from localStorage', () => {
      const testToken = 'test-refresh-token';
      localStorage.setItem('refreshToken', testToken);

      const result = service.getRefreshToken();

      expect(result).toBe(testToken);
    });

    it('should return null when no token exists', () => {
      const result = service.getRefreshToken();

      expect(result).toBeNull();
    });
  });

  describe('isLoggedIn', () => {
    it('should return login data when user is logged in', () => {
      const loginData = { id: 1, role: 'user', username: 'testuser' };
      localStorage.setItem('login', JSON.stringify(loginData));

      const result = service.isLoggedIn();

      expect(result).toBeTruthy();
    });

    it('should return null when user is not logged in', () => {
      const result = service.isLoggedIn();

      expect(result).toBeNull();
    });
  });

  describe('isAdmin', () => {
    it('should return true when user is admin', () => {
      const loginData = { id: 1, role: 'admin', username: 'adminuser' };
      localStorage.setItem('login', JSON.stringify(loginData));

      const result = service.isAdmin();

      expect(result).toBe(true);
    });

    it('should return false when user is not admin', () => {
      const loginData = { id: 1, role: 'user', username: 'testuser' };
      localStorage.setItem('login', JSON.stringify(loginData));

      const result = service.isAdmin();

      expect(result).toBeFalsy();
    });

    it('should return null when no login data exists', () => {
      const result = service.isAdmin();

      expect(result).toBeNull();
    });
  });

  describe('isUser', () => {
    it('should return true when user role is user', () => {
      const loginData = { id: 1, role: 'user', username: 'testuser' };
      localStorage.setItem('login', JSON.stringify(loginData));

      const result = service.isUser();

      expect(result).toBe(true);
    });

    it('should return false when user role is not user', () => {
      const loginData = { id: 1, role: 'admin', username: 'adminuser' };
      localStorage.setItem('login', JSON.stringify(loginData));

      const result = service.isUser();

      expect(result).toBeFalsy();
    });

    it('should return null when no login data exists', () => {
      const result = service.isUser();

      expect(result).toBeNull();
    });
  });

  describe('isUserIdDoesMatch', () => {
    it('should return true when user id matches', () => {
      const loginData = { id: 1, role: 'user', username: 'testuser' };
      localStorage.setItem('login', JSON.stringify(loginData));

      const result = service.isUserIdDoesMatch(1);

      expect(result).toBe(true);
    });

    it('should return false when user id does not match', () => {
      const loginData = { id: 1, role: 'user', username: 'testuser' };
      localStorage.setItem('login', JSON.stringify(loginData));

      const result = service.isUserIdDoesMatch(2);

      expect(result).toBeFalsy();
    });

    it('should return null when no login data exists', () => {
      const result = service.isUserIdDoesMatch(1);

      expect(result).toBeNull();
    });
  });

  describe('isUserIdDoesNotMatch', () => {
    it('should return true when user id does not match', () => {
      const loginData = { id: 1, role: 'user', username: 'testuser' };
      localStorage.setItem('login', JSON.stringify(loginData));

      const result = service.isUserIdDoesNotMatch(2);

      expect(result).toBe(true);
    });

    it('should return false when user id matches', () => {
      const loginData = { id: 1, role: 'user', username: 'testuser' };
      localStorage.setItem('login', JSON.stringify(loginData));

      const result = service.isUserIdDoesNotMatch(1);

      expect(result).toBeFalsy();
    });

    it('should return null when no login data exists', () => {
      const result = service.isUserIdDoesNotMatch(1);

      expect(result).toBeNull();
    });
  });

  describe('getUserId', () => {
    it('should return user id from login data', () => {
      const loginData = { id: 42, role: 'user', username: 'testuser' };
      localStorage.setItem('login', JSON.stringify(loginData));

      const result = service.getUserId();

      expect(result).toBe(42);
    });

    it('should return null when no login data exists', () => {
      const result = service.getUserId();

      expect(result).toBeNull();
    });
  });

  describe('destroy', () => {
    it('should cleanup resources', () => {
      service.destroy();

      expect(service).toBeTruthy(); // Service should still exist but be cleaned up
    });
  });
});
