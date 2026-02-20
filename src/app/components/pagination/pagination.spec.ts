import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pagination } from './pagination';

describe('Pagination', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagination],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate pages correctly', () => {
    component.totalItems = 100;
    component.itemsPerPage = 12;
    component.currentPage = 1;
    component.ngOnInit();

    expect(component.totalPages).toBe(9);
  });

  it('should emit pageChange event when goToPage is called', () => {
    component.totalItems = 100;
    component.itemsPerPage = 12;
    component.currentPage = 1;
    component.ngOnInit();

    let emittedPage: number | undefined;
    component.pageChange.subscribe((page) => {
      emittedPage = page;
    });

    component.goToPage(2);
    expect(emittedPage).toBe(2);
  });

  it('should not go to page less than 1', () => {
    component.totalItems = 100;
    component.itemsPerPage = 12;
    component.currentPage = 1;
    component.ngOnInit();

    let emitted = false;
    component.pageChange.subscribe(() => {
      emitted = true;
    });

    component.goToPage(0);
    expect(emitted).toBe(false);
  });

  it('should not go to page greater than totalPages', () => {
    component.totalItems = 100;
    component.itemsPerPage = 12;
    component.currentPage = 1;
    component.ngOnInit();

    let emitted = false;
    component.pageChange.subscribe(() => {
      emitted = true;
    });

    component.goToPage(100);
    expect(emitted).toBe(false);
  });

  it('should navigate to previous page', () => {
    component.totalItems = 100;
    component.itemsPerPage = 12;
    component.currentPage = 3;
    component.ngOnInit();

    let emittedPage: number | undefined;
    component.pageChange.subscribe((page) => {
      emittedPage = page;
    });

    component.previousPage();
    expect(emittedPage).toBe(2);
  });

  it('should navigate to next page', () => {
    component.totalItems = 100;
    component.itemsPerPage = 12;
    component.currentPage = 1;
    component.ngOnInit();

    let emittedPage: number | undefined;
    component.pageChange.subscribe((page) => {
      emittedPage = page;
    });

    component.nextPage();
    expect(emittedPage).toBe(2);
  });

  it('should identify first page correctly', () => {
    component.currentPage = 1;
    expect(component.isFirstPage()).toBe(true);

    component.currentPage = 2;
    expect(component.isFirstPage()).toBe(false);
  });

  it('should identify last page correctly', () => {
    component.totalItems = 100;
    component.itemsPerPage = 12;
    component.ngOnInit();
    
    component.currentPage = component.totalPages;
    expect(component.isLastPage()).toBe(true);

    component.currentPage = 1;
    expect(component.isLastPage()).toBe(false);
  });
});
