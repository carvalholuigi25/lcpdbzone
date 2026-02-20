import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Settings, ThemeOption } from '@/app/models/settings';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiURL: string = 'http://localhost:5001/api/settings';
  private defaultSettings: Settings = {
    theme: 'dark',
    realTimeDataEnabled: true,
    autoRefreshInterval: 30,
    notificationsEnabled: true,
    enableLogging: false
  };

  private settingsSubject = new BehaviorSubject<Settings>(this.defaultSettings);
  public settings$ = this.settingsSubject.asObservable();

  readonly themeOptions: ThemeOption[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'Auto', value: 'auto' }
  ];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadSettings();
  }

  private loadSettings(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.settingsSubject.next(this.defaultSettings);
      return;
    }

    const stored = localStorage.getItem('settings');
    if (stored) {
      try {
        const settings = JSON.parse(stored);
        this.settingsSubject.next(settings);
      } catch (e) {
        console.error('Error loading settings from localStorage', e);
      }
    } else {
      this.settingsSubject.next(this.defaultSettings);
    }
  }

  getSettings(): Observable<Settings> {
    return this.settings$;
  }

  getCurrentSettings(): Settings {
    return this.settingsSubject.value;
  }

  updateSettings(settings: Settings): Observable<Settings> {
    return this.http.put<Settings>(`${this.apiURL}`, settings)
      .pipe(
        tap((updated) => {
          this.settingsSubject.next(updated);
          this.saveSettingsToLocalStorage(updated);
          this.applyTheme(updated.theme);
        })
      );
  }

  saveSettingsLocally(settings: Settings): void {
    this.settingsSubject.next(settings);
    this.saveSettingsToLocalStorage(settings);
    this.applyTheme(settings.theme);
  }

  private saveSettingsToLocalStorage(settings: Settings): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  private applyTheme(theme: 'light' | 'dark' | 'auto'): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const htmlElement = document.documentElement;
    
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      htmlElement.setAttribute('data-theme', theme);
    }
  }

  resetToDefaults(): Observable<Settings> {
    return this.updateSettings(this.defaultSettings);
  }
}

