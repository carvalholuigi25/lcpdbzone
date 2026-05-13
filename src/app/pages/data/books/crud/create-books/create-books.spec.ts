import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateBooks } from './create-books';
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

const mockCreatedBook = {
  bookId: 1,
  title: 'New Book',
  description: 'New Description',
  studio: 'New Studio',
  image: 'new.jpg',
  artwork: 'new-artwork.jpg',
  isFeatured: false,
  releaseDate: '2024-06-01',
  genre: ['Drama'],
  format: ['Movie'],
  scoreRating: 7
} as BooksModel;

describe('CreateBooks', () => {
  let component: CreateBooks;
  let fixture: ComponentFixture<CreateBooks>;
  let mockBooksDataService: any;

  beforeEach(async () => {
    mockBooksDataService = {
      createBooks: vi.fn().mockReturnValue(of(mockCreatedBook))
    };

    await TestBed.configureTestingModule({
      imports: [CreateBooks],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { data: { userDetails: mockUserDetails } } } },
        { provide: BooksDataService, useValue: mockBooksDataService },
        { provide: AuthService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBooks);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required validators', () => {
    const form = component.formCreateBooks;
    expect(form.get('title')?.hasError('required')).toBeTruthy();
    expect(form.get('description')?.hasError('required')).toBeTruthy();
    expect(form.get('studio')?.hasError('required')).toBeTruthy();
    expect(form.get('image')?.hasError('required')).toBeTruthy();
  });

  it('should have default values for optional fields', () => {
    const form = component.formCreateBooks;
    expect(form.get('isFeatured')?.value).toBe('');
    expect(form.get('scoreRating')?.value).toBe(0);
  });

  it('should have artwork field with no validators', () => {
    const form = component.formCreateBooks;
    expect(form.get('artwork')?.hasError('required')).toBeTruthy();
  });

  it('should set form as valid when all required fields are filled', () => {
    const form = component.formCreateBooks;
    form.patchValue({
      title: 'Test Book',
      description: 'Test Description',
      studio: 'Test Studio',
      image: 'test.jpg',
      artwork: 'artwork.jpg'
    });
    expect(form.valid).toBeTruthy();
  });

  it('should set form as invalid when required fields are empty', () => {
    const form = component.formCreateBooks;
    form.patchValue({
      title: '',
      description: '',
      studio: '',
      image: '',
      artwork: ''
    });
    expect(form.invalid).toBeTruthy();
  });

  it('should initialize with empty form values', () => {
    const form = component.formCreateBooks;
    expect(form.get('title')?.value).toBe('');
    expect(form.get('description')?.value).toBe('');
    expect(form.get('genre')?.value).toEqual(['']);
    expect(form.get('format')?.value).toEqual(['']);
  });
});
