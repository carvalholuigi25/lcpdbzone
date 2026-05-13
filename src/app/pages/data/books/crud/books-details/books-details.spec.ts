import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BooksDetails } from './books-details';
import { ActivatedRoute } from '@angular/router';
import { BooksDataService } from '@/app/services';
import { BooksModel } from '@models/books';

describe('BooksDetails', () => {
  let component: BooksDetails;
  let fixture: ComponentFixture<BooksDetails>;
  let mockActivatedRoute: any;
  let mockBooksDataService: any;
  const mockBookData: BooksModel = {
    id: 1,
    title: 'Test Book',
  } as BooksModel;

  beforeEach(async () => {
    mockActivatedRoute = {
      paramMap: of(new Map([['id', '1']]))
    };

    mockBooksDataService = {
      getBooks: vi.fn().mockReturnValue(of(mockBookData)),
      destroy: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [BooksDetails],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: BooksDataService, useValue: mockBooksDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BooksDetails);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read id from route params on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.id).toBe(1);
  });

  it('should load book data on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockBooksDataService.getBooks).toHaveBeenCalledWith(1);
    expect(component.isLoading).toBe(false);
  });

  it('should set booksdata$ observable', (done) => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      component.booksdata$.subscribe(data => {
        expect(data).toEqual(mockBookData);
      });
    });
  });

  it('should not load data if id is invalid', async () => {
    mockActivatedRoute.paramMap = of(new Map([['id', 'invalid']]));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockBooksDataService.getBooks).not.toHaveBeenCalled();
  });

  it('should toggle loadedVideo state', () => {
    expect(component.loadedVideo).toBe(false);
    component.toggleLoadVideo();
    expect(component.loadedVideo).toBe(true);
    component.toggleLoadVideo();
    expect(component.loadedVideo).toBe(false);
  });

  it('should call destroy on service during ngOnDestroy', () => {
    fixture.detectChanges();
    component.ngOnDestroy();
    expect(mockBooksDataService.destroy).toHaveBeenCalled();
    vi.spyOn(mockBooksDataService, 'destroy'); // Reset the mock to avoid affecting other tests
  });
});
