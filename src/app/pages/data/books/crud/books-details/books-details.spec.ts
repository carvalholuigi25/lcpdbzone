import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksDetails } from './books-details';

describe('BooksDetails', () => {
  let component: BooksDetails;
  let fixture: ComponentFixture<BooksDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
