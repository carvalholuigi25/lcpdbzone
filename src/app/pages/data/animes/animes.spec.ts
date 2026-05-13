import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

import { Animes } from './animes';
import { AnimesDataService } from '@services/data/animesdata.service';
import { myFunctionsService } from '@/app/services';

describe('Animes', () => {
  let component: Animes;
  let fixture: ComponentFixture<Animes>;
  let mockAnimesDataService: Partial<AnimesDataService>;

  beforeEach(async () => {
    mockAnimesDataService = {
      getAnimes: vi.fn().mockReturnValue(of({ data: [] }))
    };

    await TestBed.configureTestingModule({
      imports: [Animes, HttpClientTestingModule],
      providers: [
        { provide: AnimesDataService, useValue: mockAnimesDataService },
        myFunctionsService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Animes);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call the animes data service once', () => {
    expect(mockAnimesDataService.getAnimes).toHaveBeenCalledOnce();
  });

  it('should initialize the data alert on init', () => {
    expect(component.dataAlert).toEqual({
      alertType: 'warning',
      icoType: 'bi-exclamation-octagon-fill',
      message: 'No data has been found',
    });
  });

  it('should update the current page and scroll to top when onPageChange is called', () => {
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    let currentPage = 1;

    component.currentPage$Obs.subscribe(page => {
      currentPage = page;
    });

    component.onPageChange(2);

    expect(currentPage).toBe(2);
    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
