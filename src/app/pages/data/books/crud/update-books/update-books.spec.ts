import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateBooks } from './update-books';
import { ActivatedRoute } from '@angular/router';
import { BooksDataService } from '@/app/services';
import { AuthService } from '@/app/services/auth.service';
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
  genre: ['Action', 'Adventure'],
  format: ['TV'],
  scoreRating: 8
} as BooksModel;

describe('UpdateBooks', () => {
  let component: UpdateBooks;
  let fixture: ComponentFixture<UpdateBooks>;
  let mockBooksDataService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockBooksDataService = {
      getBooks: vi.fn().mockReturnValue(of(mockBookData)),
      updateBooks: vi.fn().mockReturnValue(of(mockBookData))
    };

    mockActivatedRoute = {
      snapshot: { data: { userDetails: mockUserDetails } },
      paramMap: of(new Map([['id', '1']]))
    };

    await TestBed.configureTestingModule({
      imports: [UpdateBooks],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: BooksDataService, useValue: mockBooksDataService },
        { provide: AuthService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateBooks);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct validators', () => {
    const form = component.formUpdateBooks;
    expect(form.get('title')?.hasError('required')).toBeTruthy();
    expect(form.get('description')?.hasError('required')).toBeTruthy();
    expect(form.get('studio')?.hasError('required')).toBeTruthy();
    expect(form.get('image')?.hasError('required')).toBeTruthy();
  });

  it('should initialize with default book id', () => {
    expect(component.bookId).toBe(1);
  });

  it('should call getBooks on component init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockBooksDataService.getBooks).toHaveBeenCalledWith(1);
  });

  it('should load book data and populate form', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const form = component.formUpdateBooks;
    expect(form.get('title')?.value).toBe(mockBookData.title);
    expect(form.get('studio')?.value).toBe(mockBookData.studio);
  });

  it('should set form as valid when all required fields are filled', () => {
    const form = component.formUpdateBooks;
    form.patchValue({
      title: 'Valid Title',
      description: 'Valid Description',
      studio: 'Valid Studio',
      image: 'valid.jpg'
    });
    expect(form.valid).toBeTruthy();
  });
});
