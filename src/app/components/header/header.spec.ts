import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { AuthService } from '@services/auth.service';
import { DOCUMENT } from '@angular/common';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let authService: any;

  beforeEach(async () => {
    const authServiceSpy = {
      logout: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as any;
    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user details from localStorage on init', () => {
    const loginData = {
      id: 1,
      displayName: 'John Doe',
      role: 'user',
      username: 'johndoe'
    };

    localStorage.setItem('login', JSON.stringify(loginData));

    const newComponent: Header = new Header(
      TestBed.inject(DOCUMENT),
      authService
    );

    expect(newComponent.userDetails).toEqual({
      id: 1,
      displayName: 'John Doe',
      role: 'user',
      username: 'johndoe'
    });
  });

  it('should handle missing login data', () => {
    localStorage.clear();

    const newComponent: Header = new Header(
      TestBed.inject(DOCUMENT),
      authService
    );

    expect(newComponent.userDetails).toBeUndefined();
  });

  it('should call logout on doLogout', () => {
    component.doLogout();

    expect(authService.logout).toHaveBeenCalled();
  });

  it('should remove login from localStorage on doLogout', () => {
    const loginData = { id: 1, role: 'user' };
    localStorage.setItem('login', JSON.stringify(loginData));

    component.doLogout();

    expect(localStorage.getItem('login')).toBeNull();
  });

  it('should handle ngOnInit', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});
