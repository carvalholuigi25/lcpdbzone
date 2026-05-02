import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { provideRouter } from '@angular/router';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Header } from './header';
import { AuthService } from '@services/auth.service';

// --- Helpers -----------------------------------------------------------

const mockLoginData = {
  id: '123',
  displayName: 'John Doe',
  role: 'admin',
  username: 'johndoe',
};

function buildAuthServiceMock() {
  return { logout: vi.fn() };
}

function mockLocalStorage(overrides: Record<string, string | null> = {}) {
  vi.spyOn(globalThis.localStorage, 'getItem').mockImplementation(
    (key: string) => (key in overrides ? overrides[key] : null)
  );
  vi.spyOn(globalThis.localStorage, 'setItem').mockImplementation(vi.fn());
  vi.spyOn(globalThis.localStorage, 'removeItem').mockImplementation(vi.fn());
}

// --- Tests -------------------------------------------------------------

describe('Header', () => {
  let authServiceMock: ReturnType<typeof buildAuthServiceMock>;

  // Helper: configure TestBed using the real DOCUMENT (required by Angular's DOM renderer)
  async function createComponent() {
    authServiceMock = buildAuthServiceMock();

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([]),
        // Do NOT override DOCUMENT — Angular needs the real one to render
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------
  // Constructor – localStorage scenarios
  // -------------------------------------------------------------------

  describe('constructor', () => {
    it('should create the component', async () => {
      mockLocalStorage(); // no "login" key
      const component = await createComponent();
      expect(component).toBeTruthy();
    });

    it('should populate userDetails when "login" exists in localStorage', async () => {
      mockLocalStorage({ login: JSON.stringify(mockLoginData) });

      const component = await createComponent();

      expect(component.userDetails).toEqual(mockLoginData);
    });

    it('should leave userDetails undefined when "login" is absent', async () => {
      mockLocalStorage(); // getItem always returns null
      const component = await createComponent();

      expect(component.userDetails).toBeUndefined();
    });

    it('should leave userDetails undefined when defaultView is null', async () => {
      // Patch the real document so defaultView appears absent
      vi.spyOn(document, 'defaultView', 'get').mockReturnValue(null);

      const component = await createComponent();

      expect(component.userDetails).toBeUndefined();
    });

    it('should map only the expected fields from the stored login object', async () => {
      const extraData = { ...mockLoginData, extraField: 'ignored' };
      mockLocalStorage({ login: JSON.stringify(extraData) });

      const component = await createComponent();

      expect(component.userDetails).toEqual(mockLoginData);
      expect((component.userDetails as any)?.extraField).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------
  // doLogout
  // -------------------------------------------------------------------

  describe('doLogout()', () => {
    it('should remove "login" from localStorage', async () => {
      mockLocalStorage({ login: JSON.stringify(mockLoginData) });
      const component = await createComponent();

      vi.spyOn(globalThis.location, 'reload').mockImplementation(() => {});

      component.doLogout();

      expect(globalThis.localStorage.removeItem).toHaveBeenCalledWith('login');
    });

    it('should call authService.logout()', async () => {
      mockLocalStorage();
      const component = await createComponent();

      vi.spyOn(globalThis.location, 'reload').mockImplementation(() => {});

      component.doLogout();

      expect(authServiceMock.logout).toHaveBeenCalledOnce();
    });

    it('should call location.reload() after logout', async () => {
      mockLocalStorage();
      const component = await createComponent();

      const reloadSpy = vi.spyOn(globalThis.location, 'reload').mockImplementation(() => {});

      component.doLogout();

      expect(reloadSpy).toHaveBeenCalledOnce();
    });

    it('should still call authService.logout() when localStorage is unavailable', async () => {
      // Simulate localStorage being unavailable via defaultView
      vi.spyOn(document, 'defaultView', 'get').mockReturnValue(null);

      const component = await createComponent();

      vi.spyOn(globalThis.location, 'reload').mockImplementation(() => {});

      component.doLogout();

      expect(authServiceMock.logout).toHaveBeenCalledOnce();
    });
  });
});