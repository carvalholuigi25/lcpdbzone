import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Data } from './data';
import { myFunctionsService } from '@/app/services';

const mockPages = [
  { id: 1, title: 'Games', link: '/pages/data/games', icon: 'bi-check' },
  { id: 2, title: 'Movies', link: '/pages/data/movies', icon: 'bi-check' },
  { id: 3, title: 'Animes', link: '/pages/data/animes', icon: 'bi-check' },
  { id: 4, title: 'TV Series', link: '/pages/data/tvseries', icon: 'bi-check' },
  { id: 5, title: 'Books', link: '/pages/data/books', icon: 'bi-check' }
];

describe('Data', () => {
  let component: Data;
  let fixture: ComponentFixture<Data>;
  let myFunctionsServiceMock: myFunctionsService;

  beforeEach(async () => {
    myFunctionsServiceMock = {
      getOrderedPagesLinks: vi.fn(() => mockPages)
    } as unknown as myFunctionsService;

    await TestBed.configureTestingModule({
      imports: [Data],
      providers: [
        { provide: myFunctionsService, useValue: myFunctionsServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Data);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load ordered pages from myFunctionsService on init', () => {
    expect(myFunctionsServiceMock.getOrderedPagesLinks).toHaveBeenCalledTimes(1);
    expect(component.aryPages).toEqual(mockPages);
  });
});
