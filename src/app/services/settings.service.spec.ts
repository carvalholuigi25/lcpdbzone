import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SettingsService } from './settings.service';
import { Settings } from '@/app/models/settings';

describe('SettingsService', () => {
  let service: SettingsService;
  let httpMock: HttpTestingController;

  const mockSettings: Settings = {
    theme: 'dark',
    realTimeDataEnabled: true,
    autoRefreshInterval: 30,
    notificationsEnabled: true,
    enableLogging: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SettingsService]
    });
    service = TestBed.inject(SettingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load settings from localStorage if available', () => {
    localStorage.setItem('settings', JSON.stringify(mockSettings));
    const httpClient = TestBed.inject(HttpClientTestingModule);
    const platformId = 'browser';
    const newService = new SettingsService(httpClient as any, platformId);
    expect(newService.getCurrentSettings()).toBeTruthy();
  });

  it('should get settings', () => {
    service.getSettings().subscribe(settings => {
      expect(settings).toBeTruthy();
    });
  });

  it('should update settings', () => {
    service.updateSettings(mockSettings).subscribe(updated => {
      expect(updated).toEqual(mockSettings);
    });

    const req = httpMock.expectOne('http://localhost:5001/api/settings');
    expect(req.request.method).toBe('PUT');
    req.flush(mockSettings);
  });

  it('should reset to default settings', () => {
    service.resetToDefaults().subscribe(settings => {
      expect(settings).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:5001/api/settings');
    expect(req.request.method).toBe('PUT');
    req.flush(mockSettings);
  });

  it('should get theme options', () => {
    expect(service.themeOptions.length).toBe(3);
    expect(service.themeOptions[0].value).toBe('light');
  });

  it('should save settings locally', () => {
    service.saveSettingsLocally(mockSettings);
    const saved = localStorage.getItem('settings');
    expect(saved).toBeTruthy();
    expect(JSON.parse(saved!)).toEqual(mockSettings);
  });

  it('should apply theme to document', () => {
    service.saveSettingsLocally({ ...mockSettings, theme: 'light' });
    const theme = document.documentElement.getAttribute('data-theme');
    expect(theme).toBe('light');
  });
});
