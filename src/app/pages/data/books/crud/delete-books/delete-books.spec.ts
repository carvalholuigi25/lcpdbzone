import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeleteBooks } from './delete-books';
import { ActivatedRoute } from '@angular/router';
import { BooksDataService } from '@/app/services';
import { myFunctionsService } from '@/app/services';
import { BooksModel } from '@/app/models';

const mockUserDetails = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'admin',
  token: 'testtoken'
};

const mockBookData = {
  bookId: 1,
  title: 'Test Book',
  description: 'Test Description',
  studio: 'Test Studio',
  image: 'test.jpg',
  artwork: 'artwork.jpg',
  isFeatured: true,
  releaseDate: '2024-01-01',
  genre: ['Action'],
  format: ['TV'],
  scoreRating: 8
} as BooksModel;

describe('DeleteBooks', () => {
  let component: DeleteBooks;
  let fixture: ComponentFixture<DeleteBooks>;
  let mockBooksDataService: any;
  let mockMyFunctionsService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockBooksDataService = {
      getBooks: vi.fn().mockReturnValue(of(mockBookData)),
      delBooks: vi.fn().mockReturnValue(of({ success: true })),
      destroy: vi.fn()
    };

    mockMyFunctionsService = {
      getAlertWarning: vi.fn().mockReturnValue({
        type: 'warning',
        message: 'NO Books data has been found!'
      })
    };

    mockActivatedRoute = {
      snapshot: { data: { userDetails: mockUserDetails } },
      paramMap: of(new Map([['id', '1']]))
    };

    await TestBed.configureTestingModule({
      imports: [DeleteBooks],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: BooksDataService, useValue: mockBooksDataService },
        { provide: myFunctionsService, useValue: mockMyFunctionsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteBooks);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default id', () => {
    expect(component.id).toBe(1);
  });

  it('should set up data alert on init', () => {
    fixture.detectChanges();
    expect(mockMyFunctionsService.getAlertWarning).toHaveBeenCalledWith('NO Books data has been found!');
  });

  it('should initialize form with bookId control', () => {
    const form = component.formDeleteBooks;
    expect(form.get('bookId')).toBeTruthy();
    expect(form.get('bookId')?.hasError('required')).toBeTruthy();
  });

  it('should load data on component init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockBooksDataService.getBooks).toHaveBeenCalledWith(1);
  });

  it('should set isLoading to false after data loads', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.isLoading).toBe(false);
  });

  it('should reset form to default id', () => {
    component.id = 5;
    component.onReset();
    expect(component.formDeleteBooks.get('bookId')?.value).toBe(5);
  });

  it('should call destroy on service during ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(mockBooksDataService.destroy).toHaveBeenCalled();
  });

  it('should reset booksdata$ observable on destroy', () => {
    fixture.detectChanges();
    component.ngOnDestroy();
    expect(component.isLoading).toBe(true);
  });
});
